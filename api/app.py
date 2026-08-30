"""Saveroq Studio — Kontakt-Endpunkt.

Ein einziger Endpunkt: POST /api/contact.

Der Dienst ist von aussen nicht direkt erreichbar. Der Weg ist
    Cloudflare -> Tunnel -> nginx -> dieser Container
und es gibt keine Portfreigabe auf dem Host.

PROTOKOLLIERUNG: Es werden keine Inhalte, Namen oder E-Mail-Adressen
geschrieben. IP-Adressen sind personenbezogen und werden ebenfalls nicht
im Klartext abgelegt — fuer die Nachvollziehbarkeit von
Ratenbegrenzungen genuegt ein gekuerzter Hashwert mit prozesslokalem
Zufallssalz, der nach einem Neustart niemanden mehr identifiziert.
"""

import hashlib
import json
import logging
import os
import secrets
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

import mailer
from config import settings
from ratelimit import SlidingWindowLimiter
from validation import ValidationError, honeypot_tripped, validate

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("kontakt")

# Prozesslokal und zufaellig: Derselbe Hash laesst sich nach einem
# Neustart keiner IP mehr zuordnen.
_IP_SALT = secrets.token_bytes(16)

limiter = SlidingWindowLimiter(
    max_events=settings.RATE_LIMIT_MAX,
    window_seconds=settings.RATE_LIMIT_WINDOW,
    global_max=settings.RATE_LIMIT_GLOBAL_MAX,
)

# Schaltet die Auswertung der Proxy-Header. Standard: an, weil der Dienst
# ausschliesslich hinter dem eigenen nginx laeuft.
TRUST_PROXY = os.environ.get("TRUST_PROXY_HEADERS", "1").strip() != "0"

app = FastAPI(
    title="Saveroq Studio Kontakt",
    # Keine automatische Dokumentation: Der Dienst hat genau einen
    # Endpunkt und braucht keine zusaetzliche Angriffsflaeche.
    docs_url=None, redoc_url=None, openapi_url=None,
)


def client_key(request: Request) -> str:
    """Ermittelt die Client-Kennung fuer die Ratenbegrenzung.

    WICHTIG zur Vertrauensfrage: `CF-Connecting-IP` wird hier NICHT
    direkt gelesen. Der Header ist faelschbar, sobald jemand den Dienst
    direkt erreicht. Vertraut wird allein `X-Real-IP`, und den setzt der
    eigene nginx — der wiederum uebernimmt CF-Connecting-IP nur von
    Absendern aus dem Docker-Netz (set_real_ip_from in nginx.conf).
    Faellt beides aus, bleibt die Adresse der TCP-Gegenstelle.
    """
    ip = ""
    if TRUST_PROXY:
        ip = (request.headers.get("x-real-ip") or "").strip()
    if not ip and request.client:
        ip = request.client.host or ""
    return hashlib.sha256(_IP_SALT + ip.encode("utf-8")).hexdigest()[:12]


def antwort(status: int, payload: dict, request_id: str) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content=payload,
        headers={"X-Request-Id": request_id, "Cache-Control": "no-store"},
    )


@app.get("/api/health")
async def health():
    return {"ok": True, "smtp_configured": settings.smtp_configured()}


@app.post("/api/contact")
async def contact(request: Request):
    request_id = (request.headers.get("x-request-id") or uuid.uuid4().hex)[:32]
    begonnen = time.monotonic()
    kennung = client_key(request)

    def fertig(status, code, extra=None):
        log.info(
            "contact rid=%s status=%s code=%s ip=%s dauer_ms=%d",
            request_id, status, code, kennung,
            (time.monotonic() - begonnen) * 1000,
        )
        nutzlast = {"ok": status < 400, "error": code} if status >= 400 else {"ok": True}
        if extra:
            nutzlast.update(extra)
        return antwort(status, nutzlast, request_id)

    # ---- Groessenbegrenzung -------------------------------------------
    # Erst der angekuendigte Wert, danach die tatsaechlich gelesene Menge:
    # Content-Length allein ist eine Behauptung des Absenders.
    laenge = request.headers.get("content-length")
    if laenge and laenge.isdigit() and int(laenge) > settings.MAX_BODY_BYTES:
        return fertig(413, "payload_too_large")

    roh = await request.body()
    if len(roh) > settings.MAX_BODY_BYTES:
        return fertig(413, "payload_too_large")

    # ---- Ratenbegrenzung ----------------------------------------------
    erlaubt, warten = limiter.check(kennung)
    if not erlaubt:
        log.warning("rate_limit rid=%s ip=%s warten=%ds", request_id, kennung, warten)
        return fertig(429, "rate_limited", {"retry_after": warten})

    # ---- JSON ----------------------------------------------------------
    try:
        nutzlast = json.loads(roh.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return fertig(400, "invalid_json")

    # ---- Honeypot -------------------------------------------------------
    # Stiller Abbruch mit Erfolgsmeldung: Ein Bot soll nicht lernen,
    # woran er gescheitert ist. Es wird nichts versendet.
    if honeypot_tripped(nutzlast):
        log.info("honeypot rid=%s ip=%s", request_id, kennung)
        return fertig(200, "ok")

    # ---- Pruefung -------------------------------------------------------
    try:
        daten = validate(nutzlast)
    except ValidationError as err:
        return fertig(400, "validation_error", {"fields": err.fields})

    # ---- Versand ---------------------------------------------------------
    if not settings.smtp_configured():
        # Kein Vortaeuschen eines Versands. Der Besucher bekommt einen
        # ehrlichen Fehler, der Betreiber sieht den Grund im Log.
        log.error("smtp_not_configured rid=%s", request_id)
        return fertig(503, "mail_not_configured")

    try:
        await run_in_threadpool(mailer.send, daten)
    except mailer.MailNotConfigured:
        log.error("smtp_not_configured rid=%s", request_id)
        return fertig(503, "mail_not_configured")
    except mailer.MailSendFailed as exc:
        # Nur die Fehlerart, nicht Adresse oder Inhalt.
        log.error("smtp_failed rid=%s art=%s", request_id, exc)
        return fertig(502, "mail_failed")

    return fertig(200, "ok")
