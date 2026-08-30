"""Mailversand.

Kernpunkt: Benutzereingaben landen ausschliesslich im Nachrichtentext,
niemals als roher Headerwert. Betreff und Empfaenger sind fest, die
Absenderadresse des Interessenten wird nur als Reply-To gesetzt — und
das erst, nachdem sie die Pruefung bestanden hat.
"""

import smtplib
import ssl
from email.headerregistry import Address
from email.message import EmailMessage

from config import settings

TOPIC_LABELS = {
    "neue-website": "Neue Website",
    "website-ueberarbeiten": "Bestehende Website ueberarbeiten",
    "web-funktion": "Individuelle Web-Funktion",
    "datenbank-api": "Datenbank / API",
    "ai-support": "AI Customer Support",
    "websitepflege": "Websitepflege",
    "server": "Server / technische Betreuung",
    "email-dns": "E-Mail / DNS",
    "social": "Social-Media-Support",
    "assistenz": "Virtuelle Assistenz",
    "sonstiges": "Sonstiges",
}

BUDGET_LABELS = {
    "offen": "Noch offen",
    "klein": "Kleines Projekt",
    "mittel": "Mittleres Projekt",
    "gross": "Groesseres individuelles Projekt",
}


class MailNotConfigured(Exception):
    pass


class MailSendFailed(Exception):
    pass


def build_message(data) -> EmailMessage:
    msg = EmailMessage()

    # Fester Betreff. Kaeme er aus der Eingabe, waere er der bequemste
    # Weg fuer Header-Injection.
    msg["Subject"] = settings.SUBJECT
    msg["From"] = settings.SMTP_FROM
    msg["To"] = settings.CONTACT_TO

    # Reply-To ist der einzige Header mit Benutzerbezug. Die Adresse hat
    # die Pruefung bestanden (kein Steuerzeichen, kein Komma, kein
    # spitzes Klammerpaar), und Address() kodiert den Anzeigenamen
    # zusaetzlich regelkonform.
    local, _, domain = data["email"].partition("@")
    msg["Reply-To"] = Address(display_name=data["name"],
                              username=local, domain=domain)

    zeilen = [
        "Neue Anfrage ueber das Kontaktformular von studio.saveroq.com",
        "",
        "Name:      %s" % data["name"],
        "E-Mail:    %s" % data["email"],
        "Thema:     %s" % TOPIC_LABELS.get(data["topic"], data["topic"]),
        "Budget:    %s" % BUDGET_LABELS.get(data["budget"], data["budget"]),
        "Sprache:   %s" % data["lang"],
    ]
    if data.get("company"):
        zeilen.append("Firma:     %s" % data["company"])
    if data.get("existing_website"):
        zeilen.append("Website:   %s" % data["existing_website"])
    zeilen += ["", "Nachricht:", "-" * 60, data["message"], "-" * 60]

    # Nur Text, kein HTML. Damit kann im Mailprogramm nichts ausgefuehrt
    # oder als Markup interpretiert werden.
    msg.set_content("\n".join(zeilen))
    return msg


def send(data) -> None:
    if not settings.smtp_configured():
        raise MailNotConfigured()

    message = build_message(data)

    try:
        if settings.SMTP_SECURITY == "ssl":
            server = smtplib.SMTP_SSL(
                settings.SMTP_HOST, settings.SMTP_PORT,
                timeout=settings.SMTP_TIMEOUT,
                context=ssl.create_default_context())
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT,
                                  timeout=settings.SMTP_TIMEOUT)

        with server:
            if settings.SMTP_SECURITY == "starttls":
                server.starttls(context=ssl.create_default_context())
            if settings.SMTP_USERNAME:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(message)
    except Exception as exc:  # noqa: BLE001 - bewusst breit
        # Der Grund wird oben protokolliert (ohne Inhalte), nach aussen
        # geht nur eine allgemeine Meldung.
        raise MailSendFailed(type(exc).__name__) from exc
