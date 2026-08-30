"""Serverseitige Pruefung der Formulardaten.

Die Pruefung im Browser ist Bequemlichkeit fuer den Besucher und laesst
sich umgehen. Verbindlich ist ausschliesslich, was hier passiert.
"""

import re

# Laengen entsprechen FORM_LIMITS in js/config.js. Weichen sie ab, gilt
# dieser Wert — der Browser kann seine Grenzen ohnehin ignorieren.
LIMITS = {
    "name": 100,
    "email": 150,
    "company": 120,
    "existing_website": 200,
    "message": 2000,
}

# Auswahlfelder: nur bekannte Werte. Alles andere wird abgelehnt, statt
# es ungeprueft in die Mail zu uebernehmen.
TOPICS = {
    "neue-website", "website-ueberarbeiten", "web-funktion", "datenbank-api",
    "ai-support", "websitepflege", "server", "email-dns", "social",
    "assistenz", "sonstiges",
}
BUDGETS = {"offen", "klein", "mittel", "gross"}

# Absichtlich streng und ohne Bibliothek: etwas vor dem @, ein Punkt
# danach, keine Leerzeichen. Deckt echte Adressen ab und schliesst alles
# aus, was in einem Mailheader Unfug anrichten koennte.
#
# Der Backslash steht bewusst NICHT in der Zeichenklasse, sondern wird
# getrennt geprueft. Ein maskierter Backslash unmittelbar vor der
# schliessenden Klammer ist eine bekannte Fehlerquelle: Geht die
# Maskierung verloren, endet die Klasse an der falschen Stelle und der
# Ausdruck bedeutet lautlos etwas voellig anderes, ohne dass das
# Kompilieren fehlschlaegt.
EMAIL_RE = re.compile(r"^[^\s@,;:<>\"']+@[^\s@,;:<>\"']+\.[A-Za-z]{2,}$")
URL_RE = re.compile(r"^https?://[^\s<>\"']+$", re.IGNORECASE)

# Zeichen, die in keinem Feld etwas zu suchen haben.
VERBOTENE_ZEICHEN = ("\\", "`", "|")

# Steuerzeichen einschliesslich CR und LF. Sie sind der Hebel fuer
# Header-Injection und haben in keinem der Felder etwas zu suchen.
CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
NEWLINE_RE = re.compile(r"[\r\n]")


class ValidationError(Exception):
    def __init__(self, fields):
        self.fields = fields
        super().__init__("validation failed")


def _text(raw, key, *, required, minimum=0, allow_newlines=False):
    if raw is None:
        raw = ""
    if not isinstance(raw, str):
        return None, "muss Text sein"

    value = raw.strip()

    if CONTROL_RE.search(value):
        return None, "enthaelt unzulaessige Zeichen"
    if not allow_newlines and NEWLINE_RE.search(value):
        return None, "enthaelt unzulaessige Zeilenumbrueche"
    # Nur in Kurzfeldern. In der Nachricht selbst sind diese Zeichen
    # harmlos, weil sie ausschliesslich im Mailtext landen.
    if not allow_newlines and any(z in value for z in VERBOTENE_ZEICHEN):
        return None, "enthaelt unzulaessige Zeichen"

    if not value:
        return ("", None) if not required else (None, "ist erforderlich")
    if len(value) > LIMITS[key]:
        return None, "ist zu lang (max. %d Zeichen)" % LIMITS[key]
    if len(value) < minimum:
        return None, "ist zu kurz (min. %d Zeichen)" % minimum
    return value, None


def validate(payload):
    """Gibt die geprueften Daten zurueck oder wirft ValidationError.

    Es werden ALLE Felder geprueft, nicht nur bis zum ersten Fehler —
    der Besucher soll alles auf einmal korrigieren koennen.
    """
    if not isinstance(payload, dict):
        raise ValidationError({"_": "ungueltiges Format"})

    errors = {}
    data = {}

    for key, required, minimum in (
        ("name", True, 2),
        ("email", True, 0),
        ("company", False, 0),
        ("existing_website", False, 0),
    ):
        value, err = _text(payload.get(key), key, required=required, minimum=minimum)
        if err:
            errors[key] = err
        else:
            data[key] = value

    # Nachricht darf Zeilenumbrueche enthalten — sie landet im Mailtext,
    # niemals in einem Header.
    message, err = _text(payload.get("message"), "message",
                         required=True, minimum=10, allow_newlines=True)
    if err:
        errors["message"] = err
    else:
        data["message"] = message

    if "email" in data and not EMAIL_RE.match(data["email"]):
        errors["email"] = "ist keine gueltige E-Mail-Adresse"

    if data.get("existing_website") and not URL_RE.match(data["existing_website"]):
        errors["existing_website"] = "muss mit http:// oder https:// beginnen"

    topic = payload.get("topic")
    if not isinstance(topic, str) or topic not in TOPICS:
        errors["topic"] = "ist erforderlich"
    else:
        data["topic"] = topic

    budget = payload.get("budget")
    data["budget"] = budget if isinstance(budget, str) and budget in BUDGETS else "offen"

    lang = payload.get("lang")
    data["lang"] = lang if lang in ("de", "en") else "de"

    if errors:
        raise ValidationError(errors)
    return data


def honeypot_tripped(payload) -> bool:
    """Das Feld ist im Formular unsichtbar. Menschen fuellen es nie aus."""
    value = payload.get("website_url") if isinstance(payload, dict) else None
    return isinstance(value, str) and value.strip() != ""
