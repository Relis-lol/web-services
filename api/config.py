"""Konfiguration des Kontakt-Endpunkts.

Alle Werte kommen aus Umgebungsvariablen. Es gibt bewusst keine
eingebauten Zugangsdaten und keine Vorgabewerte fuer Geheimnisse.
"""

import os


def _int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, "").strip() or default)
    except ValueError:
        return default


def _str(name: str, default: str = "") -> str:
    return os.environ.get(name, "").strip() or default


class Settings:
    # ---- SMTP ---------------------------------------------------------
    SMTP_HOST = _str("SMTP_HOST")
    SMTP_PORT = _int("SMTP_PORT", 587)
    SMTP_USERNAME = _str("SMTP_USERNAME")
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")  # nicht strippen
    SMTP_FROM = _str("SMTP_FROM")
    # starttls (Standard, Port 587) | ssl (Port 465) | none (nur fuer Tests)
    SMTP_SECURITY = _str("SMTP_SECURITY", "starttls").lower()
    SMTP_TIMEOUT = _int("SMTP_TIMEOUT", 20)

    # Zieladresse. Kommt ausschliesslich von hier — der Browser darf sie
    # unter keinen Umstaenden bestimmen.
    CONTACT_TO = _str("CONTACT_TO")

    # ---- Ratenbegrenzung ----------------------------------------------
    # 10 Anfragen je IP in 15 Minuten. Auch fehlgeschlagene Eingaben zaehlen
    # mit, deshalb nicht zu knapp: Wer beim Ausfuellen mehrfach nachbessert,
    # darf nicht ausgesperrt werden. Fuer echten Missbrauch ist der Wert
    # trotzdem eng — mehr als 10 Mails in 15 Minuten will hier niemand.
    RATE_LIMIT_MAX = _int("RATE_LIMIT_MAX", 10)
    RATE_LIMIT_WINDOW = _int("RATE_LIMIT_WINDOW", 900)
    # Obergrenze ueber alle IPs zusammen. Schuetzt gegen verteilte Versuche,
    # bei denen jede einzelne Adresse unauffaellig bleibt.
    RATE_LIMIT_GLOBAL_MAX = _int("RATE_LIMIT_GLOBAL_MAX", 60)

    # ---- Sonstiges -----------------------------------------------------
    MAX_BODY_BYTES = _int("MAX_BODY_BYTES", 16 * 1024)
    SUBJECT = _str("CONTACT_SUBJECT", "Neue Anfrage – Saveroq Studio")

    def smtp_configured(self) -> bool:
        """Ohne diese vier Angaben kann nicht zugestellt werden.

        Benutzername und Passwort sind bewusst nicht Pflicht: Manche
        Relays im eigenen Netz nehmen ohne Anmeldung an.

        Bewusst KEINE classmethod. Als solche laese sie die Attribute der
        Klasse, waehrend der Rest der Anwendung ueber die Instanz
        `settings` geht. Wer die Instanz veraendert — Tests tun genau
        das — bliebe hier wirkungslos, und die Pruefung antwortete anders
        als der Rest des Programms.
        """
        return bool(self.SMTP_HOST and self.SMTP_PORT
                    and self.SMTP_FROM and self.CONTACT_TO)


settings = Settings()
