# HANDOVER — Saveroq Studio Website

**Stand:** 2026-09-16
**Zweck:** Technische Übergabe an einen neuen Coding-Agenten ohne Kenntnis der
bisherigen Chatverläufe. Beschrieben ist der *aktuell gültige* Zustand,
verifiziert gegen Repository, laufende Tests und die Live-Seite.

> **Sprachhinweis:** Der gesamte Code ist auf Deutsch kommentiert, Bezeichner
> sind teils deutsch (`kennung`, `antwort`, `fertig`). Das ist Absicht und
> soll beibehalten werden. Neue Kommentare bitte ebenfalls auf Deutsch, ohne
> Umlaute in Python-Dateien (dort wird durchgängig `ue/ae/oe` geschrieben).

---

## 1. Projektziel

**Was ist das Projekt?**
Die Geschäftswebsite eines Einzelunternehmens (Web- und Digitaldienstleistungen)
unter `https://studio.saveroq.com`. Statische, zweisprachige Website plus ein
minimaler Backend-Dienst für das Kontaktformular.

**Was soll es können?**
Leistungen darstellen, Referenzen zeigen und qualifizierte Anfragen per
E-Mail an die Betreiber zustellen. Kein Shop, kein Login, kein CMS.

**Aktueller Scope:**
- Statische Einstiegsseite (`index.html`) mit acht Abschnitten
- Rechtsseiten: `impressum.html`, `datenschutz.html`
- Zweisprachigkeit DE/EN mit Umschalter und Browsersprachenerkennung
- Kontaktformular mit serverseitiger Prüfung und SMTP-Versand
- Eigenes Docker-Deployment hinter Cloudflare Tunnel

**Ausdrücklich NICHT im Scope:**
- **Kein Build-System.** Kein npm, kein Bundler, kein Framework im Frontend.
  Die Dateien werden so ausgeliefert, wie sie im Repository liegen. Das ist
  eine bewusste Entscheidung (siehe Abschnitt 6), keine Lücke.
- Keine Datenbank, keine Benutzerkonten, keine Sitzungsverwaltung
- Keine externen Ressourcen: keine Web Fonts, kein CDN, kein Analytics,
  kein Tracker, keine Cookies. Die CSP erzwingt das.
- **Keine erfundenen Inhalte.** Keine Kundenstimmen, keine Preise, keine
  Zertifikate, keine Firmendaten, keine Aufbewahrungsfristen. Was nicht
  belegt ist, steht nicht auf der Seite.
- Keinerlei Verbindung zu `saveroq.com` (siehe Abschnitt 15)

---

## 2. Aktueller Status

### Vollständig umgesetzt und nachweislich funktionierend

Am 2026-09-16 in dieser Sitzung geprüft:

| Prüfung | Ergebnis |
|---|---|
| Backend-Tests (`pytest`) | **20/20 PASS** |
| Python-Syntax aller Dateien (`py_compile`) | **PASS** |
| `scripts/cache-buster.py --probe` | **PASS** — „Alle Versionskennungen sind aktuell" |
| Live `GET https://studio.saveroq.com/` | **HTTP 200** |
| Live `POST /api/contact` mit ungültigem JSON | **HTTP 400** `{"ok":false,"error":"invalid_json"}` |
| Sicherheits-Header live | CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` alle vorhanden |
| Git | sauber, `main`, synchron mit `origin` |

Der 400er-Test belegt die komplette Kette Cloudflare → Tunnel → nginx →
FastAPI-Container, ohne eine Mail auszulösen.

Weiterhin fertig:
- Zweisprachigkeit inkl. der Projekt-Merkmale (`tech_en`)
- Vier echte Referenzprojekte mit Screenshots (1600 × 1000, WebP)
- Impressum mit getrennten Rollen, Datenschutzerklärung
- Docker-Stack gehärtet (`read_only`, `cap_drop: ALL`, kein Host-Port)
- Mailversand über Brevo-Relay; zwei echte Testmails sind nachweislich
  zugestellt worden und wurden vom Betreiber bestätigt

### Teilweise umgesetzt

- **Suchmaschinen-Indexierung ist absichtlich abgeschaltet.**
  `index.html` trägt `<meta name="robots" content="noindex, follow">`.
  `robots.txt` enthält bewusst **kein** `Disallow` (sonst würde der Crawler
  die Seite nie abrufen und das `noindex` nie sehen). Die Sitemap-Zeile in
  `robots.txt` ist auskommentiert. Umschalten:
  `python scripts/domain-setzen.py --index an` **plus** Sitemap-Zeile
  einkommentieren. Das ist eine Geschäftsentscheidung, kein technischer
  Rückstand — nicht ohne Auftrag umlegen.
- **Umsatzsteuer-ID fehlt**, weil noch keine existiert. `BUSINESS_VAT_ID`
  und `BUSINESS_ECONOMIC_ID` in `js/config.js` stehen auf `null`;
  `applyLegalData()` in `js/main.js` erzeugt den Impressums-Abschnitt in
  `#vat-slot` erst, sobald ein Wert eingetragen ist. Ein leerer Abschnitt
  wäre rechtlich schlechter als gar keiner.

### Was noch fehlt

- Favicon, Apple-Touch-Icon und OpenGraph-Bild sind Platzhalter
  (`assets/icons/`, `assets/images/og-image.png`)
- Keine Social-Links gepflegt (`SOCIAL` in `js/config.js` ist leer;
  die Liste wird dann schlicht nicht gerendert)
- Die Rechtstexte sind **nicht** anwaltlich geprüft
- Kein automatisierter Frontend-Test (siehe Abschnitt 11)

---

## 3. Repository / Arbeitsumgebung

| | |
|---|---|
| Lokaler Pfad | `C:\AI-Stuff\webstudio` |
| Remote `origin` | `https://github.com/Relis-lol/web-services.git` (**öffentlich**) |
| Remote `backup` | `https://github.com/Relis-lol/digitalservice-backup.git` |
| Branch | `main` |
| Letzter Commit | `368118b` — „Server-Adresse aus dem oeffentlichen README entfernt" |
| Git-Status | sauber bis auf diese Datei — `HANDOVER.md` ist ungetrackt und **absichtlich nicht committet** |
| Synchronität | `origin/main` ↔ `HEAD`: 0 voraus / 0 zurück |
| Betriebssystem (Entwicklung) | Windows 11 Pro |
| Python (lokal) | 3.12.10 |
| Docker (lokal) | **nicht installiert** — Container laufen nur auf dem Server |
| Zielsystem | Linux-Server im LAN, Docker Compose |

> **`origin` ist ein öffentliches Repository.** Nichts committen, was das nicht
> verträgt. Genau daran ist zuletzt eine interne Serveradresse aufgefallen und
> in `368118b` entfernt worden.

Beide Remotes bekommen denselben Stand:
`git push origin main && git push backup main`

---

## 4. Architektur

```
Besucher
   │  HTTPS
   ▼
Cloudflare  (TLS, Cache, Email-Obfuscation)
   │  nur ausgehende Verbindung
   ▼
cloudflared           Container  saveroq-studio-tunnel
   │  Docker-Netz  saveroq-studio_studio
   ▼
nginx :8080           Container  saveroq-studio
   │  statische Dateien direkt
   │  nur  = /api/contact  wird weitergereicht
   ▼
FastAPI :8000         Container  saveroq-studio-api
   │  SMTP STARTTLS :587
   ▼
Brevo-Relay  →  CONTACT_TO
```

**Frontend** — statisch, kein Build. Reihenfolge der Skripte ist relevant:
`config.js` → `i18n.js` → `projects.js` → `main.js`.

- `config.js` — einzige Quelle für Geschäfts- und Kontaktdaten. Wer Name,
  Adresse oder E-Mail ändern will, ändert **nur hier**, nicht im HTML.
- `i18n.js` — Wörterbuch. Deutsch steht im HTML (SEO und Funktion ohne
  JavaScript), Englisch kommt aus dem Objekt. Der deutsche Originaltext wird
  beim ersten Umschalten in einer `WeakMap` zwischengespeichert, damit das
  Zurückschalten verlustfrei ist. Elemente tragen `data-i18n` (Textinhalt)
  bzw. `data-i18n-attr` (Attribut).
- `projects.js` — die vier Referenzprojekte als Datenliste. **Projekte werden
  hier gepflegt, nicht im HTML** — die Karten werden erzeugt.
- `main.js` — das gesamte Verhalten in einer IIFE, ohne globale Streuung.
  Rund 35 benannte Funktionen, thematisch gruppiert: Theme, Sprache, Nav,
  Scrollspy, Reveal, Hintergrundgrafik, progressive Gestaltung,
  Geschäftsdaten, Projektkarten, Kontaktformular.

**Backend** — FastAPI, ein einziger fachlicher Endpunkt.

| Datei | Aufgabe |
|---|---|
| `api/app.py` | Routen, Ablauf, Protokollierung, IP-Kennung |
| `api/config.py` | Einstellungen, ausschließlich aus Umgebungsvariablen |
| `api/validation.py` | serverseitige Feldprüfung, Zeichen-Sperrliste |
| `api/mailer.py` | SMTP-Versand, sichere Header |
| `api/ratelimit.py` | gleitendes Zeitfenster, im Arbeitsspeicher |

Routen:
- `POST /api/contact` — der Kontaktendpunkt, öffentlich erreichbar
- `GET /api/health` — **nur containerintern.** nginx reicht ausschließlich
  `= /api/contact` weiter; von außen liefert `/api/health` einen 404.
  Das ist verifiziert und beabsichtigt, kein Fehler.
- Keine `/docs`, `/redoc`, `/openapi.json` — in `app.py` abgeschaltet

**Keine Datenbank.** Auch die Ratenbegrenzung liegt im Arbeitsspeicher des
Prozesses und ist nach einem Neustart leer. Bei einem einzelnen Worker ist
das korrekt; siehe Abschnitt 8.

**Externe Abhängigkeiten:** Cloudflare (DNS, TLS, Tunnel) und Brevo (SMTP).
Sonst keine. Das Frontend lädt **null** externe Ressourcen.

---

## 5. Wichtige Dateien und Verzeichnisse

```
index.html            Einstiegsseite, 8 Abschnitte (top, leistungen, support,
                      assistenz, projekte, ablauf, preise, kontakt)
impressum.html        Anbieterkennzeichnung, Rollen getrennt, #vat-slot
datenschutz.html      Datenschutzerklärung inkl. Kontaktformular-Abschnitt

css/styles.css        gesamte Gestaltung (1288 Zeilen), CSS Custom Properties
js/config.js          Geschäftsdaten, Endpunkt, Formulargrenzen  ← hier pflegen
js/i18n.js            englisches Wörterbuch + Umschaltlogik
js/projects.js        die vier Referenzprojekte                  ← hier pflegen
js/main.js            gesamtes Verhalten

api/app.py            FastAPI-Anwendung
api/config.py         Einstellungen aus Umgebungsvariablen
api/validation.py     serverseitige Prüfung
api/mailer.py         SMTP
api/ratelimit.py      Ratenbegrenzung
api/tests/test_contact.py   20 Tests
api/Dockerfile        Produktionsabbild — kopiert Module EINZELN auf
api/Dockerfile.test   Testabbild — kopiert das ganze Verzeichnis

deploy/compose.yml    der Stack (Projektname `saveroq-studio`)
deploy/nginx.conf     Auslieferung, Sicherheits-Header, API-Weiterleitung
deploy/Dockerfile     nginx-Abbild
deploy/.env.example   Vorlage, nur Namen und Erklärungen — keine Werte
deploy/.env           NICHT im Repository, liegt nur auf dem Server

scripts/cache-buster.py    Versionskennungen gegen Cloudflares Browsercache
scripts/domain-setzen.py   Domainwechsel + Indexierungsschalter

robots.txt            kein Disallow (mit Begründung im Kopf der Datei)
sitemap.xml           aktuell, aber in robots.txt nicht beworben
assets/projects/      vier Screenshots als WebP, je 1600 × 1000
```

---

## 6. Wichtige technische Entscheidungen

**Kein Build-System, kein Framework.**
Die Seite ist statisch und soll auch in fünf Jahren ohne
Abhängigkeitspflege ausliefer- und änderbar sein. Ein Bundler brächte hier
nichts außer Wartungslast. *Nicht „modernisieren".*

**Deutsch im HTML, Englisch im Wörterbuch.**
Ohne JavaScript ist die Seite vollständig lesbar, und Suchmaschinen sehen
echten Text statt eines leeren Gerüsts.

**`add_header` wird in nginx nicht vererbt.**
Sobald ein `location`-Block eigene Header setzt, fallen **alle** auf
Server-Ebene gesetzten Header dort lautlos weg. Deshalb wird der
Cache-Wert über `map $uri $saveroq_cache_control` abgeleitet und alles
**einmal** auf Server-Ebene gesetzt. Wer hier ein `add_header` in einen
`location`-Block schreibt, schaltet unbemerkt die CSP ab.

**`proxy_pass` mit Variable und eigenem Resolver.**
`resolver 127.0.0.11` + `set $backend "api:8000"`. Ein direkter
`proxy_pass http://api:8000/...` würde den Namen einmal beim Start auflösen:
nginx startet nicht, solange das Backend fehlt, und zeigt nach einem Neubau
des Backends weiter auf die tote alte Container-IP.

**Die Zieladresse der Mail kommt ausschließlich aus `CONTACT_TO`.**
Der Browser kann sie unter keinen Umständen beeinflussen.

**Benutzereingaben werden nie direkt als Mail-Header verwendet.**
`mailer.py` baut Adressen über `email.headerregistry.Address`.
`validation.py` verbietet zusätzlich CR/LF, Steuerzeichen und
`\`, `` ` ``, `|` in allen Feldern.

**Kein vorgetäuschter Versand.**
Fehlt die SMTP-Konfiguration, antwortet der Endpunkt ehrlich mit
`503 mail_not_configured`. Er tut nie so, als sei etwas zugestellt worden.

**Keine personenbezogenen Daten im Protokoll.**
Weder Inhalte noch Namen noch Adressen. Die IP wird mit einem
prozesslokalen Zufallssalz gehasht und auf 12 Zeichen gekürzt — nach einem
Neustart ist sie niemandem mehr zuzuordnen. Aus demselben Grund läuft
uvicorn mit `--no-access-log`: dessen Zugriffsprotokoll schrieb die
Besucher-IP im Klartext.

**`X-Real-IP` statt `CF-Connecting-IP` im Backend.**
`CF-Connecting-IP` ist fälschbar, sobald jemand den Dienst direkt erreicht.
Vertraut wird allein `X-Real-IP` vom eigenen nginx, und der übernimmt
`CF-Connecting-IP` nur von Absendern aus privaten Docker-Netzen. nginx
leert den Header beim Weiterreichen zusätzlich.

**Kein veröffentlichter Host-Port.**
Der einzige Weg von außen führt durch den Cloudflare Tunnel, der eine
*ausgehende* Verbindung aufbaut. Container laufen mit `read_only: true`,
`cap_drop: ALL`, `no-new-privileges`, unprivilegiert.

**`<!--email_off-->` um alle `mailto:`-Links.**
Cloudflares Email Address Obfuscation ersetzte die Impressums-Adresse sonst
durch einen JavaScript-Platzhalter — ohne JavaScript war die Pflichtangabe
dann unlesbar. Der Kommentar löst das, ohne die zonenweite
Cloudflare-Einstellung anzufassen (die gilt auch für `saveroq.com`).

**Versionskennungen statt Cache-Einstellung.**
Cloudflare überschreibt zonenweit den `Cache-Control`-Header und setzt für
statische Dateien 4 Stunden Browsercache. `scripts/cache-buster.py` hängt
deshalb `?v=<sha256[:8]>` an CSS, JS und Projektbilder. **Reihenfolge ist
wichtig:** Bilder zuerst, denn das ändert `projects.js` und damit dessen
eigene Kennung.

**`api/Dockerfile` kopiert Module einzeln.**
Bewusst kein `COPY api/ .`: So fällt beim Hinzufügen eines Moduls sofort
auf, dass die Liste ergänzt werden muss. Genau das ist einmal übersehen
worden (siehe Abschnitt 7).

**`smtp_configured()` ist Instanz-, nicht Klassenmethode.**
Als `classmethod` läse sie die Klassenattribute, während der Rest der
Anwendung über die Instanz `settings` geht — Tests, die die Instanz ändern,
blieben wirkungslos.

---

## 7. Bereits untersuchte / verworfene Ansätze

> **Dieser Abschnitt existiert, damit abgeschlossene Fehlersuchen nicht
> wiederholt werden.** Die Punkte sind geprüft und entschieden.

| Was | Warum verworfen / gelöst | Erneut untersuchen? |
|---|---|---|
| **GitHub Pages als Hosting** | Ersetzt durch eigenen Docker-Stack. Pages kann keine Sicherheits-Header setzen und kein Backend betreiben. `.nojekyll` ist ein Überbleibsel ohne Wirkung. | **Nein** |
| **Drei verschiedene Hintergrundzeichnungen, die überblenden** | Wirkte wie eine Bildercollage statt wie eine Entwicklung. Ersetzt durch **eine** Szene, die sich an Ort und Stelle wandelt (`--p` 0–1 aus der Scrollposition, `clamp()`-Fenster, `stroke-dasharray`). | **Nein** |
| **Progressive Gestaltung auf Texteigenschaften anwenden** | Ausdrücklich verworfen. `--e` (Reifegrad je Abschnitt) verändert **nur** Rundung, Rahmenfarbe, Schatten, Hintergrund-Alpha und Sättigung — nie Schrift, nie Layoutmaße. Sonst leidet Lesbarkeit. | **Nein** |
| **Leuchtpunkt heller stellen** | Der Text darüber fiel unter WCAG AA (gemessen 3.67 / 2.71). Auf `.155` / `.19` gedimmt → **4.65 / 4.93**. Nicht wieder aufhellen. | **Nein** |
| **E-Mail-Prüfung per Bibliothek** | Bewusst selbst implementiert, um keine Abhängigkeit für einen einzigen Endpunkt zu pflegen. | **Nein** |
| **Backslash in der Zeichenklasse von `EMAIL_RE`** | War eine echte Falle: ein verlorener Backslash beendete die Klasse an der falschen Stelle, kompilierte aber fehlerfrei und wies **jede** gültige Adresse ab. Backslash wird jetzt getrennt über `VERBOTENE_ZEICHEN` geprüft. **Nicht zurückbauen.** | **Nein** |
| **Gmail-SMTP / App-Passwörter / WIVOKO-Absender** | Alle drei ausdrücklich ausgeschlossen. Versendet wird über den vorhandenen Brevo-Relay mit `studio@saveroq.com`. | **Nein** |
| **Engere Ratenbegrenzung** | War zu streng (3. Anfrage blockiert). Wer beim Ausfüllen nachbessert, darf nicht ausgesperrt werden. Jetzt: nginx 30 r/min mit `burst=10`, Backend 10 je IP in 15 min. | **Nein** |
| **`ratelimit.py` fehlte im Dockerfile** | Die Tests blieben grün, weil das Testabbild das ganze Verzeichnis kopiert. Erst der echte Containerstart zeigte es. Merke: **grüne Tests beweisen die Vollständigkeit der `COPY`-Liste nicht.** | Nur bei neuen Modulen |
| **Cloudflare-Cacheeinstellung ändern** | Gilt zonenweit und beträfe auch `saveroq.com`. Deshalb der Cache-Buster statt einer Zonenänderung. | **Nein** |
| **`Disallow` in `robots.txt`** | Wäre kontraproduktiv: Der Crawler dürfte die Seite gar nicht abrufen und sähe das `noindex` nie. Die URL könnte trotzdem im Index landen, nur inhaltsleer. | **Nein** |
| **Git-Historie umschreiben** (die entfernte Serveradresse steht noch in 5 alten Commits) | Bewusst unterlassen: RFC1918-Adresse, von außen wertlos, `filter-repo` + Force-Push auf zwei Remotes ist das größere Risiko. | Nur auf ausdrücklichen Auftrag |

---

## 8. Bekannte Probleme / technische Schulden

**Veraltete Kommentare (Dokumentation, nicht Funktion):**
1. `deploy/.env.example` behauptet in einem langen Absatz, für `saveroq.com`
   sei **keine** Brevo-Absenderadresse eingerichtet und `SMTP_FROM` sei
   „das Einzige, was noch fehlt". **Das ist überholt.** Die Domain ist
   authentifiziert, der Sender `Saveroq Studio <studio@saveroq.com>` ist
   verifiziert, `SMTP_FROM` ist auf dem Server gesetzt, und es wurden bereits
   echte Mails zugestellt. Der Abschnitt gehört gekürzt.
2. `scripts/domain-setzen.py` erwähnt im Hilfetext noch GitHub Pages als
   Betriebsart. Funktion ist korrekt, Text veraltet.
3. `deploy/nginx.conf` (Kommentar über der `map`) sagt, die Assetnamen trügen
   keine Prüfsumme. Seit dem Cache-Buster tragen sie eine — als Query-Anhang,
   nicht im Dateinamen. Der abgeleitete Cache-Wert bleibt richtig.

Diese drei sind bewusst **nicht** in dieser Sitzung geändert worden, damit die
Übergabe keinen unbestätigten Commit enthält.

**Technische Schulden und Grenzen:**
- `.nojekyll` ist ein Überbleibsel aus der GitHub-Pages-Zeit und wirkungslos.
- Die Ratenbegrenzung liegt im Prozessspeicher. Korrekt bei **einem** Worker
  (so läuft es: `--workers 1`). Wer auf mehrere Worker geht, muss sie ersetzen,
  sonst vervielfacht sich das Limit stillschweigend.
- Kein automatisierter Frontend-Test. Das Frontend ist ausschließlich manuell
  und per Browserwerkzeug geprüft.
- **`api/__pycache__/validation.cpython-312.pyc` ist versehentlich
  eincheckt.** `git ls-files` listet die Datei; in `.gitignore` fehlt ein
  Eintrag für `__pycache__/` und `*.pyc`. Folge: Jeder lokale Testlauf
  erzeugt Bytecode neu und macht das Arbeitsverzeichnis schmutzig — die
  eine getrackte Datei erscheint als geändert, die übrigen als ungetrackt.
  Sauber wäre `git rm --cached` plus ein `.gitignore`-Eintrag. Bewusst nicht
  in dieser Sitzung erledigt, weil dafür ein Commit nötig wäre.

**Offene Risiken / externe Blocker:**
- Die Rechtstexte sind nicht anwaltlich geprüft.
- Umsatzsteuer-ID hängt an der Gewerbeanmeldung.
- Die Zustellbarkeit hängt an Brevo und an der DNS-Konfiguration von
  `saveroq.com` — die liegt außerhalb dieses Repositories.
- Container altern. Die Absicherung ist gut, aber `nginx` und die
  Python-Abhängigkeiten brauchen regelmäßig ein `--build --pull always`.

---

## 9. Dependencies / Konfiguration

**Frontend:** keine. Null Pakete, null externe Ressourcen.

**Backend** (`api/requirements.txt`, bewusst minimal):
```
fastapi==0.115.6
uvicorn[standard]==0.34.0
```

**Test** (`api/requirements-test.txt`):
```
-r requirements.txt
pytest==8.3.4
httpx==0.28.1
```

**Container-Images:** `nginxinc/nginx-unprivileged`, `python` (Slim),
`cloudflare/cloudflared:2026.8.2`

**Config-Dateien:** `js/config.js` (Geschäftsdaten), `deploy/compose.yml`,
`deploy/nginx.conf`, `deploy/.env` (nur auf dem Server), `robots.txt`,
`sitemap.xml`

### Umgebungsvariablen — nur Namen

Gelesen in `api/config.py` und `api/app.py`, gesetzt in `deploy/.env`:

| Name | Pflicht | Bemerkung |
|---|---|---|
| `SMTP_HOST` | ja | |
| `SMTP_PORT` | ja | Vorgabe 587 |
| `SMTP_USERNAME` | nein | |
| `SMTP_PASSWORD` | nein | **Geheimnis** |
| `SMTP_FROM` | ja | muss beim Anbieter freigegeben sein |
| `SMTP_FROM_NAME` | nein | Vorgabe `Saveroq Studio` |
| `SMTP_SECURITY` | nein | `starttls` \| `ssl` \| `none` |
| `SMTP_TIMEOUT` | nein | Vorgabe 20 |
| `CONTACT_TO` | ja | Zieladresse, nie vom Browser bestimmt |
| `CONTACT_SUBJECT` | nein | |
| `RATE_LIMIT_MAX` | nein | Vorgabe 10 |
| `RATE_LIMIT_WINDOW` | nein | Vorgabe 900 |
| `RATE_LIMIT_GLOBAL_MAX` | nein | Vorgabe 60 |
| `MAX_BODY_BYTES` | nein | Vorgabe 16384 |
| `TRUST_PROXY_HEADERS` | nein | Vorgabe an; `0` schaltet ab |
| `CLOUDFLARE_TUNNEL_TOKEN` | ja (Tunnel) | **Geheimnis** |

Pflicht für den Versand sind `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`,
`CONTACT_TO` — geprüft in `Settings.smtp_configured()`.

> **Keine Werte in dieser Datei, im Repository oder in Berichten.**
> `deploy/.env` steht in `.gitignore`; `deploy/.env.example` ist über eine
> Ausnahmeregel bewusst eingeschlossen und enthält nur Namen.

---

## 10. Startanleitung

### Frontend lokal ansehen

```bash
cd C:\AI-Stuff\webstudio
python -m http.server 8000
```
Dann `http://localhost:8000/` öffnen. Ohne Backend meldet das Formular
einen Verbindungsfehler — das ist das korrekte Verhalten.

### Backend lokal starten

```bash
cd C:\AI-Stuff\webstudio\api
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-test.txt
.venv\Scripts\python.exe -m uvicorn app:app --reload --port 8000
```
Ohne gesetzte SMTP-Variablen antwortet `/api/contact` mit
`503 mail_not_configured`. Auch das ist korrekt.

### Vollständiger Stack (auf dem Server, Docker)

```bash
cd ~/stack/saveroq-studio
git pull
docker compose -f deploy/compose.yml up -d --build
docker compose -f deploy/compose.yml ps
```

### Vor jedem Commit mit geänderten Assets

```bash
python scripts/cache-buster.py
```

---

## 11. Tests und Validierung

**Am 2026-09-16 tatsächlich ausgeführt:**

```
Backend-Tests (pytest, 20 Tests)        20/20 PASS
Python-Syntax (py_compile, alle Dateien)      PASS
cache-buster.py --probe                       PASS  (keine Kennung veraltet)
Git-Arbeitsverzeichnis                      SAUBER
Live GET  https://studio.saveroq.com/    HTTP 200
Live POST /api/contact (ungültiges JSON) HTTP 400  invalid_json
Live Sicherheits-Header                       PASS  (CSP, HSTS, XCTO,
                                                     Referrer, Permissions)
Lint                                    NICHT VORHANDEN
Typecheck                               NICHT VORHANDEN
Build                                   ENTFÄLLT (kein Build-System)
```

**Lint und Typecheck gibt es in diesem Projekt nicht** — weder für das
Frontend (kein npm) noch für das Backend (kein ruff/mypy konfiguriert).
Das ist der Ist-Zustand, keine fehlgeschlagene Prüfung. Wer sie einführen
will, sollte das vorher abstimmen.

**Testbefehle:**

```bash
# lokal, mit installierten Testabhängigkeiten
cd C:\AI-Stuff\webstudio\api
python -m pytest tests/ -q

# im Container, auf dem Server
docker compose -f deploy/compose.yml --profile test run --rm test
```

> Die lokalen Testabhängigkeiten sind **nicht** im System-Python installiert.
> Für diesen Lauf wurde eine Wegwerf-venv im Scratchpad benutzt. Wer lokal
> testen will, legt sich eine venv an (Abschnitt 10).

**Was die 20 Tests abdecken:** Erfolgspfad, fehlende Pflichtfelder,
ungültige Adressen, Längenüberschreitung, Honeypot, Header-Injection über
CR/LF, zu großer Body, ungültiges JSON, Ratenbegrenzung, fehlende
SMTP-Konfiguration.

**Nicht automatisiert geprüft:** das gesamte Frontend.

---

## 12. Externe / manuelle Schritte

Diese Dinge sind nicht automatisierbar und brauchen den Betreiber:

- **Server-Deployment** — läuft über SSH auf einen Linux-Rechner im LAN.
  Die Zugangsdaten stehen bewusst nicht im Repository. Docker ist auf dem
  Entwicklungsrechner **nicht** installiert; der Stack lässt sich lokal
  nicht starten.
- **Cloudflare** — Tunnel, DNS-Eintrag für `studio.saveroq.com`, die
  zonenweite Cacheeinstellung. Nur im Dashboard änderbar.
- **Brevo** — Absenderfreigabe, DKIM/SPF. Nur im Anbieter-Dashboard.
- **Echter Mailversand** — nur manuell zu bestätigen, indem jemand ins
  Zielpostfach sieht. Ein automatischer Test dafür würde echte Mails
  verschicken.
- **Prüfung der Mail-Kopfzeilen** — Testmail öffnen → Original anzeigen →
  Zeile `Authentication-Results`. Erwartet: `dkim=pass header.d=saveroq.com`
  und `dmarc=pass`. *Dieser Punkt ist noch offen.*
- **Gewerbeanmeldung** — Voraussetzung für die Umsatzsteuer-ID.
- **Anwaltliche Prüfung** der Rechtstexte.
- **Visuelle Abnahme** — Erscheinungsbild, Hintergrundanimation und die
  progressive Gestaltung lassen sich sinnvoll nur im Browser beurteilen.

---

## 13. Aktueller Arbeitsstand

**Zuletzt gemacht** (chronologisch, die letzten drei Schritte):

1. `3ddcffa` — Viertes Referenzprojekt (`alicesyndromearchive.com`) ergänzt.
   Gleichzeitig ein gemeldeter Übersetzungsfehler behoben: Die
   Merkmals-Schlagworte der Projektkarten blieben in der englischen Fassung
   deutsch. Ursache war `pick()`, das über `isFilled()` nur nicht-leere
   **Strings** akzeptiert und bei einem Array immer `false` liefert. Gelöst
   mit der neuen Funktion `pickList()` in `js/main.js:522`.
2. `0676bda` — Bessere Screenshots für EVE Market Tools und Portfolio.
   Beide auf exakt 16:10 zugeschnitten, als WebP 1600 × 1000. Dabei wurde
   `scripts/cache-buster.py` erweitert, damit es auch die Bildpfade in
   `projects.js` stempelt.
3. `368118b` — **letzter Commit.** Eine reale Serveradresse samt Benutzername
   stand im Klartext im Deploy-Abschnitt des öffentlichen README. Ersetzt
   durch `ssh <benutzer>@<server>`. Ein anschließender Scan über das gesamte
   Repository fand keine weiteren Treffer: keine echten IPs (die
   IP-ähnlichen Zeichenfolgen in `js/main.js:470` sind SVG-Pfadkoordinaten),
   keine Zugangsdaten, keine Home-Pfade.

**Bereits vorbereitet:**
- Alles für den Livegang außer der Indexierung
- `scripts/domain-setzen.py --index an` als fertiger Schalter
- Die Sitemap ist aktuell, nur in `robots.txt` noch auskommentiert

**Es steht keine angefangene Arbeit offen.** Arbeitsverzeichnis sauber,
beide Remotes synchron, Live-Stand entspricht `main`.

---

## 14. Empfohlener nächster Schritt

Es gibt keine dringende technische Aufgabe. Der sinnvollste sofort
umsetzbare Schritt ist das Aufräumen der drei veralteten Kommentare aus
Abschnitt 8 — klein, risikoarm, und es verhindert, dass ein späterer
Bearbeiter dem falschen Text glaubt:

1. In `deploy/.env.example` den Absatz ab
   `# >>> DAS EINZIGE, WAS NOCH FEHLT <<<` auf zwei, drei Zeilen kürzen:
   Absender ist verifiziert und gesetzt, Wert steht nur in `deploy/.env`.
   **Keinen Wert eintragen.**
2. In `scripts/domain-setzen.py` den GitHub-Pages-Hinweis im Hilfetext
   durch den tatsächlichen Betrieb ersetzen.
3. In `deploy/nginx.conf` den Kommentar über der `map` an den Cache-Buster
   anpassen.
4. Den eingecheckten Bytecode entfernen und künftig ignorieren:
   ```bash
   git rm --cached api/__pycache__/validation.cpython-312.pyc
   printf '\n# Python-Bytecode\n__pycache__/\n*.pyc\n' >> .gitignore
   ```

Danach:
```bash
python scripts/cache-buster.py --probe
cd api && python -m pytest tests/ -q
```

**Alles darüber hinaus bitte erst abstimmen.** Insbesondere die Indexierung
(Abschnitt 2) ist eine Geschäftsentscheidung und wartet auf die
Gewerbeanmeldung.

---

## 15. Do-not-touch / wichtige Warnungen

**`saveroq.com` ist ein fremdes System.**
Die Hauptdomain wird auf demselben Server vom Stack `ai-price-index`
bedient und hat **nichts** mit diesem Projekt zu tun. Verlangt war und gilt:
keine Links dorthin, keine gemeinsame Navigation, keine gemeinsame Sitemap,
keine Weiterleitungen, keine Änderung an deren SEO-, Canonical- oder
Schema-Daten, kein gemeinsames Netz, kein gemeinsamer Tunnel. Geteilt wird
allein der Markenname.

**Geheimnisse.** `deploy/.env` niemals committen, nie ausgeben, nie in einen
Bericht kopieren. `origin` ist **öffentlich**.

**Reale Personen- und Kontaktdaten.** Die Angaben in `js/config.js`,
`impressum.html` und `datenschutz.html` sind echt und rechtlich verbindlich.
Niemals durch Beispieldaten ersetzen, nie „aufhübschen", nie erfinden. Ist
eine Angabe unklar, melden statt raten.

**Keine erfundenen Inhalte.** Gilt unverändert: keine Kundenstimmen, keine
Preise, keine Zertifikate, keine Aufbewahrungsfristen. Projektbeschreibungen
nur nach Prüfung an der echten Seite.

**Nicht anfassen ohne guten Grund:**
- Die nginx-Header-Struktur (die `add_header`-Vererbungsfalle)
- `proxy_pass` mit Variable und Resolver
- `EMAIL_RE` und `VERBOTENE_ZEICHEN` in `validation.py`
- Die Deckkraftwerte der Hintergrundgrafik (WCAG-AA-geprüft)
- Die Härtung in `compose.yml` — insbesondere: **kein `ports:` hinzufügen.**
  Sobald ein Port veröffentlicht wird, ist die Vertrauensannahme hinter
  `set_real_ip_from` verletzt und die IP-Ermittlung wird fälschbar.
- `--no-access-log` und `--workers 1` im `api/Dockerfile`
- `robots.txt` und das `noindex` — ohne ausdrücklichen Auftrag nicht umlegen
- Die `COPY`-Liste in `api/Dockerfile` bei jedem neuen Modul **ergänzen**

**Deployment** läuft ausschließlich über den Server. Nicht versuchen, lokal
Container zu starten — Docker ist auf dem Entwicklungsrechner nicht
installiert.

---

## 16. Übergabe-Check

| Frage | Antwort |
|---|---|
| Reicht das Dokument ohne den bisherigen Chat? | **Ja.** Aufbau, Deployment, Entscheidungen, verworfene Ansätze und der nächste Schritt stehen hier. |
| Stimmen die Angaben mit dem Repository überein? | **Ja.** Branch, Commit, Status, Dateiliste, Abhängigkeiten und Umgebungsvariablen sind am 2026-09-16 direkt aus dem Arbeitsverzeichnis gelesen. |
| Sind Testergebnisse tatsächlich ausgeführt? | **Ja.** 20/20 pytest, `py_compile`, Cache-Buster-Probelauf und drei Live-Abfragen wurden real ausgeführt. Lint/Typecheck sind als *nicht vorhanden* markiert, nicht als bestanden. |
| Sind Geheimnisse enthalten? | **Nein.** Nur Variablennamen. Keine Token, Passwörter, Serveradressen oder Benutzernamen. |
| Offene und erledigte Punkte getrennt? | **Ja** — Abschnitt 2 trennt fertig / teilweise / offen, Abschnitt 8 listet die Schulden. |
| Ist der nächste Schritt eindeutig? | **Ja**, Abschnitt 14 mit drei konkreten Dateien und den Prüfbefehlen danach. |

**Einschränkung, die der Ehrlichkeit halber hierher gehört:** Der
Server-Zustand konnte in dieser Sitzung nicht per SSH geprüft werden — der
Zugriff war in der Arbeitsumgebung gesperrt. Die Aussagen über die laufenden
Container stützen sich auf die Konfiguration im Repository plus die
Live-Abfragen aus Abschnitt 11. Dass die Seite mit 200 antwortet, die
API-Kette bis zum FastAPI-Container durchläuft und alle Sicherheits-Header
liefert, belegt den Betrieb hinreichend — der genaue `docker ps`-Zustand ist
damit aber nicht verifiziert.
