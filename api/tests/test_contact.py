"""Tests fuer den Kontakt-Endpunkt.

Der Mailversand wird durchgehend abgefangen. Kein Test baut eine echte
SMTP-Verbindung auf oder braucht Zugangsdaten.
"""

import logging
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import app as app_modul          # noqa: E402
import mailer                    # noqa: E402
from config import settings      # noqa: E402


GUELTIG = {
    "name": "Maria Beispiel",
    "email": "maria@example.de",
    "company": "Beispiel GmbH",
    "topic": "neue-website",
    "existing_website": "https://example.de",
    "budget": "mittel",
    "message": "Wir braeuchten eine neue Firmenwebsite mit Kontaktformular.",
    "lang": "de",
}


@pytest.fixture
def client(monkeypatch):
    """Frischer Zaehler und konfiguriertes SMTP je Test."""
    app_modul.limiter.reset()
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.example.invalid")
    monkeypatch.setattr(settings, "SMTP_PORT", 587)
    monkeypatch.setattr(settings, "SMTP_FROM", "noreply@example.invalid")
    monkeypatch.setattr(settings, "CONTACT_TO", "ziel@example.invalid")
    return TestClient(app_modul.app)


@pytest.fixture
def gesendet(monkeypatch):
    """Faengt den Versand ab und merkt sich die uebergebenen Daten."""
    aufrufe = []
    monkeypatch.setattr(mailer, "send", lambda d: aufrufe.append(d))
    return aufrufe


# --------------------------------------------------------------- Erfolg
def test_gueltige_anfrage(client, gesendet):
    r = client.post("/api/contact", json=GUELTIG)
    assert r.status_code == 200
    assert r.json() == {"ok": True}
    assert len(gesendet) == 1
    assert gesendet[0]["email"] == "maria@example.de"


def test_optionale_felder_duerfen_fehlen(client, gesendet):
    knapp = {k: GUELTIG[k] for k in ("name", "email", "topic", "message")}
    r = client.post("/api/contact", json=knapp)
    assert r.status_code == 200
    assert gesendet[0]["budget"] == "offen"


# ----------------------------------------------------------- Validierung
def test_fehlender_name(client, gesendet):
    r = client.post("/api/contact", json={**GUELTIG, "name": ""})
    assert r.status_code == 400
    assert r.json()["error"] == "validation_error"
    assert "name" in r.json()["fields"]
    assert not gesendet


def test_ungueltige_email(client, gesendet):
    ungueltig = ["keine-mail", "a@b", "a b@c.de", "a@@b.de", "",
                 "a\\b@c.de", "a`b@c.de", "a|b@c.de"]
    for schlecht in ungueltig:
        app_modul.limiter.reset()
        r = client.post("/api/contact", json={**GUELTIG, "email": schlecht})
        assert r.status_code == 400, schlecht
        assert "email" in r.json()["fields"], schlecht
    assert not gesendet


def test_leere_nachricht(client, gesendet):
    r = client.post("/api/contact", json={**GUELTIG, "message": "   "})
    assert r.status_code == 400
    assert "message" in r.json()["fields"]
    assert not gesendet


def test_zu_kurze_nachricht(client, gesendet):
    r = client.post("/api/contact", json={**GUELTIG, "message": "zu kurz"})
    assert r.status_code == 400
    assert "message" in r.json()["fields"]


def test_ueberlange_felder(client, gesendet):
    r = client.post("/api/contact", json={**GUELTIG, "name": "A" * 101})
    assert r.status_code == 400
    assert "name" in r.json()["fields"]

    app_modul.limiter.reset()
    r = client.post("/api/contact", json={**GUELTIG, "message": "x" * 2001})
    assert r.status_code == 400
    assert "message" in r.json()["fields"]
    assert not gesendet


def test_unbekanntes_thema_wird_abgelehnt(client, gesendet):
    r = client.post("/api/contact", json={**GUELTIG, "topic": "ausgedacht"})
    assert r.status_code == 400
    assert "topic" in r.json()["fields"]
    assert not gesendet


def test_header_injection_wird_abgewiesen(client, gesendet):
    """Zeilenumbrueche in Name oder Adresse duerfen nie durchkommen."""
    faelle = [
        ("name", "Eva\r\nBcc: opfer@example.com"),
        ("email", "eva@example.de\nBcc: opfer@example.com"),
    ]
    for feld, wert in faelle:
        app_modul.limiter.reset()
        r = client.post("/api/contact", json={**GUELTIG, feld: wert})
        assert r.status_code == 400, feld
        assert feld in r.json()["fields"], feld
    assert not gesendet


def test_ungueltige_url(client, gesendet):
    r = client.post("/api/contact",
                    json={**GUELTIG, "existing_website": "javascript:alert(1)"})
    assert r.status_code == 400
    assert "existing_website" in r.json()["fields"]


# --------------------------------------------------------------- Honeypot
def test_honeypot_meldet_erfolg_sendet_aber_nicht(client, gesendet):
    r = client.post("/api/contact", json={**GUELTIG, "website_url": "http://spam"})
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert not gesendet, "Honeypot darf nichts versenden"


# --------------------------------------------------------- Ratenbegrenzung
def test_rate_limit(monkeypatch, client, gesendet):
    monkeypatch.setattr(app_modul.limiter, "_max", 3)
    for i in range(3):
        assert client.post("/api/contact", json=GUELTIG).status_code == 200, i
    r = client.post("/api/contact", json=GUELTIG)
    assert r.status_code == 429
    assert r.json()["error"] == "rate_limited"
    assert r.json()["retry_after"] > 0
    assert len(gesendet) == 3


# ------------------------------------------------------------- Protokoll
def test_falsche_methode(client):
    assert client.get("/api/contact").status_code == 405
    assert client.put("/api/contact", json=GUELTIG).status_code == 405


def test_ungueltiges_json(client, gesendet):
    r = client.post("/api/contact", content=b"{kein json",
                    headers={"Content-Type": "application/json"})
    assert r.status_code == 400
    assert r.json()["error"] == "invalid_json"
    assert not gesendet


def test_zu_grosser_body(client, gesendet):
    zuviel = b"x" * (settings.MAX_BODY_BYTES + 100)
    r = client.post("/api/contact", content=zuviel,
                    headers={"Content-Type": "application/json"})
    assert r.status_code == 413
    assert r.json()["error"] == "payload_too_large"
    assert not gesendet


# ------------------------------------------------------------------ SMTP
def test_smtp_nicht_konfiguriert(monkeypatch, client, gesendet):
    monkeypatch.setattr(settings, "SMTP_HOST", "")
    r = client.post("/api/contact", json=GUELTIG)
    assert r.status_code == 503
    assert r.json()["error"] == "mail_not_configured"
    assert not gesendet, "ohne SMTP darf kein Erfolg vorgetaeuscht werden"


def test_smtp_stoerung(monkeypatch, client):
    def kaputt(_):
        raise mailer.MailSendFailed("SMTPServerDisconnected")
    monkeypatch.setattr(mailer, "send", kaputt)
    r = client.post("/api/contact", json=GUELTIG)
    assert r.status_code == 502
    assert r.json()["error"] == "mail_failed"
    # Keine internen Angaben nach aussen
    assert "SMTPServerDisconnected" not in r.text
    assert "Traceback" not in r.text


# --------------------------------------------------- Keine Daten im Log
def test_keine_personenbezogenen_daten_im_log(client, gesendet, caplog):
    with caplog.at_level(logging.DEBUG):
        client.post("/api/contact", json=GUELTIG)
    text = "\n".join(r.getMessage() for r in caplog.records)
    geheimnisse = [GUELTIG["email"], GUELTIG["name"], GUELTIG["message"],
                   GUELTIG["company"], "testclient"]
    for geheim in geheimnisse:
        assert geheim not in text, "im Log gefunden: " + geheim


def test_ip_wird_nur_gehasht_verwendet(client):
    from starlette.requests import Request
    req = Request({"type": "http", "headers": [(b"x-real-ip", b"203.0.113.9")],
                   "client": ("172.24.0.5", 1234), "method": "POST", "path": "/"})
    kennung = app_modul.client_key(req)
    assert "203.0.113.9" not in kennung
    assert len(kennung) == 12


# ------------------------------------------------------------ Mailaufbau
def test_mailaufbau_ist_sicher(monkeypatch):
    monkeypatch.setattr(settings, "SMTP_FROM", "noreply@example.invalid")
    monkeypatch.setattr(settings, "CONTACT_TO", "ziel@example.invalid")
    from validation import validate
    msg = mailer.build_message(validate(GUELTIG))

    assert msg["To"] == "ziel@example.invalid"          # nie aus dem Browser
    assert msg["Subject"] == settings.SUBJECT           # fest
    assert "maria@example.de" in str(msg["Reply-To"])
    assert msg.get_content_type() == "text/plain"       # kein HTML
    assert GUELTIG["message"] in msg.get_content()
