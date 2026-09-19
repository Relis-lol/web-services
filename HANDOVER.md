# HANDOVER — Saveroq Studio

**Stand:** 2026-09-19
**Projekt:** Produktionswebsite unter `https://studio.saveroq.com`

Dieses Dokument beschreibt den aktuellen Releasekandidaten. Maßgeblich bleiben
Repository, `git status` und der letzte Commit.

## Zweck und Grenzen

Saveroq Studio ist die Geschäftswebsite des Einzelunternehmens von Björn Boldt.
Sie besteht aus statischen HTML-, CSS- und JavaScript-Dateien sowie einem kleinen
FastAPI-Dienst für das Kontaktformular. Es gibt kein Frontend-Buildsystem, kein
CMS, keine Datenbank, kein Tracking und keine extern geladenen Web-Ressourcen.

Das Schwesterprojekt `saveroq.com` und der AI Price Index gehören nicht zu
diesem Repository und dürfen bei Arbeiten an dieser Website nicht verändert
werden.

## Repository und Betrieb

- Lokaler Projektpfad: `C:\AI-Stuff\webstudio`
- Branch: `main`
- Öffentliches Haupt-Remote: `origin`
- Zweites Remote: `backup`
- Server-Checkout: `~/stack/saveroq-studio`
- Produktion: Docker Compose hinter Cloudflare Tunnel
- Geheimnisse: ausschließlich `deploy/.env` auf dem Server; nie ins Repository
- Aktuellen Commit immer mit `git log -1 --oneline` prüfen.

Der Server-Checkout enthielt vor diesem Release zwei lokale Commits für die
Kontaktadresse und Wirtschafts-Identifikationsnummer. Deren Änderungen wurden
in den lokalen Hauptzweig übernommen. Vor einem Deployment muss der Server auf
den veröffentlichten `origin/main`-Stand gebracht werden; eine Sicherheitsbranch
des vorherigen Serverstands ist dabei sinnvoll.

## Öffentliche Geschäftsdaten

- Inhaber: Björn Boldt
- Geschäftsbezeichnung: Saveroq Studio
- Anschrift: Siemensstraße 32, 90459 Nürnberg, Deutschland
- Kundenkontakt: Girly Boldt, `kontakt@saveroq.com`
- Recht und Datenschutz: `relislol@yahoo.com`
- Wirtschafts-Identifikationsnummer: `DE442938959-00001`
- Technischer Formular-Absender: `Saveroq Studio <studio@saveroq.com>`

`CONTACT_TO` ist eine private Serverkonfiguration und darf nicht öffentlich
dokumentiert werden.

## Website-Struktur

- `index.html`: zweisprachige Startseite (DE/EN)
- `impressum.html`, `datenschutz.html`: Rechtsseiten
- `websites/`
- `web-apps-saas/`
- `ai-automatisierung/`
- `api-integrationen/`
- `hosting-betrieb/`
- `wartung-support/`
- `virtuelle-assistenz/`
- `api/`: Kontaktformular-Backend und Tests
- `deploy/`: nginx, Dockerfile, Compose und Env-Vorlage
- `scripts/cache-buster.py`: aktualisiert und prüft Asset-Versionen
- `scripts/domain-setzen.py`: pflegt Domain und Indexierungsstatus

Alle acht in der Sitemap enthaltenen öffentlichen Ziel-URLs sind auf
`index, follow` gestellt. Die Leistungsseiten haben jeweils einen eigenen
Titel, eine eigene Beschreibung, eine kanonische URL, genau eine H1 und
Service-JSON-LD. Die Startseite enthält Organization/ProfessionalService- und
Angebotsdaten. Inhalt und Projektkarten sind auch ohne JavaScript vorhanden.

## Kontaktformular

Der Browser sendet an `/api/contact`. nginx leitet die Anfrage an FastAPI
weiter. Der API-Dienst prüft Felder, Honeypot, Origin, Content-Type,
Anfragegröße und Rate-Limit und versendet anschließend über den konfigurierten
Brevo-SMTP-Relay. Formularinhalte werden nicht in einer Datenbank gespeichert.

`smtp_configured()` akzeptiert für `SMTP_SECURITY` nur `starttls`, `ssl`
oder `none`. Alte Rate-Limit-Buckets werden vor der Grenzwertprüfung entfernt.

## Recht und Datenschutz

Die Datenschutzerklärung nennt den Versandweg über den eigenen Server und
Brevo/Sendinblue GmbH. Der Formularhinweis bestätigt die Kenntnisnahme der
Datenschutzhinweise und formuliert keine unnötige Einwilligung.

Die eingestellte EU-OS-Plattform wird nicht mehr genannt. Eine Aussage nach
§ 36 VSBG wurde nicht veröffentlicht, weil die dafür entscheidende
Beschäftigtenzahl nicht belegt ist. Die Rechtstexte sind technisch und
redaktionell geprüft, ersetzen aber keine anwaltliche Prüfung.

## Validierter Releasekandidat

Am 2026-09-19 lokal geprüft:

- Backend: `22 passed`
- Python-Syntax: PASS
- `python scripts/cache-buster.py --probe`: PASS
- zehn HTML-Seiten: interne Links und Assets vorhanden, keine doppelten IDs
- genau eine H1, eindeutige Titel, Beschreibungen und Canonicals je Seite
- alle JSON-LD-Blöcke parsbar
- `sitemap.xml`: gültiges XML mit acht erwarteten URLs
- Responsive Sichtprüfung: Desktop, 768 × 1024 und 375 × 812
- kein horizontaler Überlauf in den geprüften Viewports
- Lighthouse lokal: Performance 98, Accessibility 100,
  Best Practices 100, SEO 100
- `git diff --check`: PASS

Lighthouse auf dem lokalen Entwicklungsserver bewertet Browser-Caching und
Produktionslatenz nur eingeschränkt. Der Produktionsstand muss nach jedem
Deployment separat geprüft werden.

## Deployment

Vor dem Deployment:

1. Arbeitsbaum und Diff prüfen.
2. Tests und Cache-Buster-Probe ausführen.
3. Commit nach `origin/main` und `backup/main` pushen.
4. Sicherstellen, dass `deploy/.env` auf dem Server vorhanden und vollständig
   ist, ohne Werte auszugeben.
5. Den sauberen Server-Checkout auf den veröffentlichten `origin/main`-Stand
   bringen und den vorherigen Stand über eine Sicherheitsbranch erhalten.
6. `docker compose -f deploy/compose.yml up -d --build --pull always`
   ausführen.

Nach dem Deployment prüfen:

- Startseite und alle sieben Leistungsseiten liefern HTTP 200.
- `robots.txt` und `sitemap.xml` sind erreichbar und korrekt.
- Canonicals, `index, follow` und Sicherheitsheader sind vorhanden.
- Eine unbekannte URL liefert 404.
- Ein ungültiger JSON-POST an `/api/contact` liefert 400, ohne eine Mail
  auszulösen.
- Container sind gesund; SMTP-Konfiguration ist innerhalb der API als
  vollständig erkannt.

## Noch offen

- Rechtstexte fachkundig prüfen lassen.
- `https://studio.saveroq.com/sitemap.xml` in der vorhandenen Google Search
  Console Domain Property einreichen.
- Dort anschließend die Startseite und die sieben Leistungsseiten prüfen.
- Social-Media-Profile nur ergänzen, wenn bestätigte URLs vorliegen.

Der lokale Releasekandidat ist vorbereitet; der endgültige Live-Status ist
nach dem Deployment in Git und auf der Produktionsseite zu verifizieren.
