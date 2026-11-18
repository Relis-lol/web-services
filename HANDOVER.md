# HANDOVER — Saveroq Studio

**Stand:** 2026-11-17
**Produktion:** https://studio.saveroq.com

Repository, git status und letzter Commit bleiben maßgeblich.

## Positionierung

Saveroq Studio ist die Engineering- und Operations-Einheit hinter Saveroq.
Die Seite bewirbt keine externen IT-Dienstleistungen und dient nicht der
Kundenakquise. Sie erklärt Entwicklung und Betrieb der eigenen
Saveroq-Produkte, Datenpipelines und technischen Systeme.

saveroq.com ist das Hauptprodukt und wird von der Studio-Seite verlinkt.
Code und Deployment der Hauptplattform gehören nicht zu diesem Repository
und dürfen bei Arbeiten am Studio nicht verändert werden.

## Repository und Betrieb

- Lokaler Projektpfad: C:AI-Stuffwebstudio
- Branch: main
- Haupt-Remote: origin
- Zweites Remote: backup
- Server-Checkout: ~/stack/saveroq-studio
- Produktion: Docker Compose hinter Cloudflare Tunnel
- Geheimnisse: ausschließlich deploy/.env auf dem Server; nie im Repository

## Öffentliche Geschäftsdaten

- Inhaber: Björn Boldt
- Geschäftsbezeichnung: Saveroq Studio
- Anschrift: Siemensstraße 32, 90459 Nürnberg, Deutschland
- Allgemeiner Kontakt: kontakt@saveroq.com
- Recht und Datenschutz: kontakt@saveroq.com
- Wirtschafts-Identifikationsnummer: DE442938959-00001
- Technischer Formular-Absender: Saveroq Studio <studio@saveroq.com>

CONTACT_TO ist private Serverkonfiguration und darf nicht öffentlich
dokumentiert werden.

## Website-Struktur

- index.html: zweisprachige Startseite (DE/EN)
- impressum.html, datenschutz.html: Rechtsseiten
- apps-privacy/: Datenschutzinformationen für Saveroq-Apps
- api/: Kontaktformular-Backend und Tests
- deploy/: nginx, Dockerfile, Compose und Env-Vorlage
- scripts/cache-buster.py: Asset-Versionen
- scripts/domain-setzen.py: Domain und Indexierungsstatus

Die Startseite enthält Saveroq als Hauptprodukt, Engineering-Bereiche der
eigenen Systeme, eigene Produkte und Experimente, Operations, einen kompakten
Technologie-Kontext und neutralen Kontakt.

Die früheren Leistungsseiten sind entfernt. nginx leitet ihre bisherigen URLs
dauerhaft auf passende Bereiche der Startseite weiter. Die Sitemap enthält
nur noch die kanonische Startseite.

## Kontaktformular

Der Browser sendet an /api/contact; nginx leitet an FastAPI weiter. Der
Dienst prüft Felder, Honeypot, Origin, Content-Type, Anfragegröße und
Rate-Limit und versendet über Brevo SMTP. Formularinhalte werden nicht in
einer Datenbank gespeichert.

Das Formular ist kein Lead-Formular für IT-Aufträge. Sichtbare Themen sind
Händler-/Produktdaten, Search-/AI-Readiness, technische Hinweise,
Partnerschaften und allgemeine Fragen. Technische Enum-Werte im Backend
bleiben aus Kompatibilitätsgründen bestehen.

## Recht und Datenschutz

Die Datenschutzerklärung nennt den Versandweg über den eigenen Server und
Brevo/Sendinblue GmbH. Die Rechtstexte ersetzen keine anwaltliche Prüfung.

## Qualitätsprüfung

Nach jeder Änderung mindestens prüfen:

- Backend-Tests und JavaScript-Syntax
- Cache-Buster-Probe
- interne Links, Assets, H1, Canonical und JSON-LD
- DE/EN, Dark/Light, Desktop und Mobile
- keine alten Akquise-, Agentur- oder Service-Texte
- alte Leistungs-URLs liefern 301
- Kontaktformular und Rechtsseiten
- Containerzustand und Live-Antworten nach Deployment

## Deployment

1. Arbeitsbaum und Diff prüfen.
2. Tests und Cache-Buster ausführen.
3. Commit nach origin/main und backup/main pushen.
4. Sauberen Server-Checkout per Fast-forward aktualisieren.
5. Docker Compose neu bauen und starten.
6. Live-Seite, Weiterleitungen, Header, Kontakt-API und Container prüfen.

## Offen

- Rechtstexte fachkundig prüfen lassen.
- Aktualisierte Sitemap bei Bedarf in der Search Console prüfen.
- Social-Media-Profile nur mit bestätigten URLs ergänzen.
