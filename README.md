# Saveroq Studio — Website

Statische Website für **Saveroq Studio**, den Dienstleistungsbereich neben
der Saveroq-Plattform. Öffentliche Adresse: `https://studio.saveroq.com`.

**Hosting:** eigener Docker-Container auf dem On-Prem-Server hinter
Cloudflare Tunnel — nicht GitHub Pages. Dieses Repository ist Quelle und
Sicherung. Siehe [Deployment](#deployment).

> **Getrennt von saveroq.com.** Die Hauptplattform bleibt unangetastet: keine
> gemeinsame Navigation, keine Weiterleitung, keine gegenseitige Verlinkung,
> kein Eintrag in der Saveroq-Sitemap, keine Änderung an deren SEO-Daten.
> Dieses Repository enthält ausschließlich die Studio-Seite.

Aufbau: Kein Build-System,
keine Frameworks, keine externen Abhängigkeiten: reines HTML5, CSS und
Vanilla JavaScript. Läuft direkt auf GitHub Pages und lässt sich später ohne
Umbau auf eine eigene Domain umziehen.

Zweisprachig (Deutsch/Englisch) mit Browser-Spracherkennung und Umschalter,
optionalem Dark Mode und einem Kontaktformular, das bewusst noch nichts
versendet (siehe [Kontaktformular aktivieren](#kontaktformular-aktivieren)).

> **Zum Livegang: [LAUNCH.md](LAUNCH.md)** — zwei Felder ausfüllen, einen
> Schalter umlegen. Mehr ist es nicht.

---

## Inhalt

- [Dateistruktur](#dateistruktur)
- [Lokal starten](#lokal-starten)
- [Deployment](#deployment)
- [Custom Domain](#custom-domain-nur-bei-wechsel-auf-eine-eigene-domain)
- [Firmeninformationen ändern](#firmeninformationen-ändern)
- [Business-E-Mail eintragen](#business-e-mail-eintragen)
- [Social Links ändern](#social-links-ändern)
- [Projekte austauschen](#projekte-austauschen)
- [Texte ändern (Deutsch/Englisch)](#texte-ändern-deutschenglisch)
- [Hintergrund-Grafik anpassen](#hintergrund-grafik-anpassen)
- [Fortschreitende Gestaltung](#fortschreitende-gestaltung)
- [Kontaktformular](#kontaktformular)
- [SEO-Daten ändern](#seo-daten-ändern)
- [Security Header (später)](#security-header-später)
- [Checkliste vor dem kommerziellen Launch](#checkliste-vor-dem-kommerziellen-launch)

---

## Dateistruktur

```text
/
├── index.html            Startseite (Onepager mit allen Sections)
├── impressum.html        Anbieterdaten gefüllt, zwei Angaben offen
├── datenschutz.html      verantwortliche Stelle gefüllt, Endpunkt-Angaben offen
├── css/
│   └── styles.css        Gesamtes Design, in nummerierte Abschnitte gegliedert
├── api/                  Kontakt-Endpunkt (FastAPI) + Tests
├── js/
│   ├── config.js         >> Firmendaten, Kontakt, Social, Endpunkt <<
│   ├── projects.js       >> Die drei Referenzprojekte <<
│   ├── i18n.js           Englische Übersetzungen + Sprachlogik
│   └── main.js           Verhalten (Menü, Projekte, Formular, Theme)
├── assets/
│   ├── images/           og-image.png (Social-Vorschaubild)
│   ├── projects/         Projekt-Screenshots
│   └── icons/            favicon.svg, apple-touch-icon.png
├── CNAME                 Custom Domain für GitHub Pages
├── scripts/
│   └── domain-setzen.py  stellt alle Adressen auf einmal um
├── LAUNCH.md             >> Anleitung fürs Schalten <<
├── robots.txt
├── sitemap.xml
├── deploy/               Docker-Deployment (Dockerfile, compose.yml, nginx.conf)
├── .nojekyll             nur für eine mögliche Pages-Vorschau, nicht für Produktion
└── .gitignore
```

Für den Alltag reichen zwei Dateien: **`js/config.js`** und **`js/projects.js`**.

Der Onepager ist so aufgebaut, dass jede Section (`<section id="…">`) später
ohne Umbau in eine eigene Unterseite gezogen werden kann — Kopf, Fußzeile und
alle Skripte sind bereits seitenübergreifend nutzbar, wie `impressum.html`
zeigt.

---

## Lokal starten

Die Seite braucht einen kleinen HTTP-Server; ein Doppelklick auf `index.html`
funktioniert wegen der `file://`-Beschränkungen mancher Browser nicht
zuverlässig.

Mit Python (auf den meisten Systemen vorhanden):

```bash
python -m http.server 8000
```

Danach `http://localhost:8000` im Browser öffnen.

Alternativ mit Node.js:

```bash
npx serve .
```

---

## Deployment

Produktion läuft auf dem eigenen Server, nicht auf GitHub Pages.

```bash
ssh relis@192.168.178.47
cd ~/stack/saveroq-studio
git pull
docker compose -f deploy/compose.yml up -d --build
```

### Aufbau

| | |
|---|---|
| Compose-Projekt | `saveroq-studio` |
| Container | `saveroq-studio` (nginx), `saveroq-studio-tunnel` (cloudflared) |
| Netz | `saveroq-studio_studio` |
| Interner Port | 8080 |
| Veröffentlichter Host-Port | **keiner** |
| Öffentlicher Weg | Internet → Cloudflare → Tunnel (nur ausgehend) → `web:8080` |

Der Stack ist bewusst eigenständig. `ai-price-index`, der `saveroq.com`
bedient, wird nicht angefasst: kein gemeinsames Netz, kein gemeinsamer
Tunnel, keine Verlinkung.

Das Abbild baut auf `nginx-unprivileged` statt auf dem Standard-nginx —
letzteres startet den Master-Prozess als root und verträgt sich nicht mit
`read_only: true`.

### Tunnel-Token

Das Token gehört in `deploy/.env` **auf dem Server** und niemals ins
Repository. Vorlage: `deploy/.env.example`.

Fehlt es, startet nur der Tunnel-Container in einer Neustartschleife — der
Webserver läuft weiter und ist im Docker-Netz erreichbar. Das ist Absicht:
So lässt sich das Deployment prüfen, bevor die Seite öffentlich wird.

### Sicherheits-Header

Sie sind jetzt **aktiv** (auf GitHub Pages waren sie nicht setzbar):
Content-Security-Policy, X-Content-Type-Options, Referrer-Policy,
Permissions-Policy und HSTS. Gesetzt in `deploy/nginx.conf`.

> **Beim Kontaktformular beachten:** Sobald `CONTACT_FORM_ENDPOINT` gesetzt
> wird, muss dessen Origin in `deploy/nginx.conf` unter `connect-src`
> ergänzt werden — sonst blockiert der Browser das Absenden.

## Custom Domain (nur bei Wechsel auf eine eigene Domain)

1. Beim Domain-Anbieter DNS-Einträge setzen:
   - **Apex-Domain** (`beispiel.de`) → vier `A`-Records auf
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **Subdomain** (`www.beispiel.de`) → ein `CNAME` auf `relis-lol.github.io`
2. In **Settings → Pages → Custom domain** die Domain eintragen. GitHub legt
   dabei automatisch eine `CNAME`-Datei im Repository an.
3. **„Enforce HTTPS"** aktivieren, sobald das Zertifikat ausgestellt ist
   (dauert in der Regel wenige Minuten bis Stunden).
4. Danach alle Adressen im Projekt auf einmal umstellen:

```bash
python scripts/domain-setzen.py https://beispiel.de/
```

---

## Firmeninformationen ändern

Alles in **`js/config.js`**:

```js
BUSINESS_NAME:           null,                    // Launch-Feld 1, siehe LAUNCH.md
BUSINESS_INITIALS:       'BB',                    // 2–3 Zeichen fürs Logo-Quadrat
BUSINESS_EMAIL:          'girly.va18@gmail.com',
BUSINESS_CONTACT_PERSON: 'Girly Boldt',           // Ansprechpartnerin
BUSINESS_PHONE:          null,                    // null = wird nicht angezeigt
BUSINESS_LOCATION:       'Nürnberg, Deutschland',
BUSINESS_VAT_ID:         null,                    // Launch-Feld 2, Variante A
BUSINESS_TAX_NOTE:       null,                    // Launch-Feld 2, Variante B
```

Die beiden Launch-Felder steuern zusätzlich, ob die Seite als startklar gilt.
Solange `BUSINESS_NAME` leer ist, bleiben im Impressum die eckigen Platzhalter
und auf beiden Rechtsseiten die gelben Hinweiskästen stehen. Sobald Name und
steuerliche Angabe gesetzt sind, verschwinden sie von selbst — ohne dass am
HTML etwas geändert werden muss. Details in [LAUNCH.md](LAUNCH.md).

Grundregel: **Was `null` ist, erscheint nicht auf der Seite.** Die
Telefonnummer bleibt also unsichtbar, solange sie nicht eingetragen ist — es
wird nichts erfunden und es bleibt kein leeres Feld stehen.

Name und Initialen werden automatisch in Kopfzeile, Fußzeile und auf allen
Unterseiten eingesetzt.

---

## Business-E-Mail eintragen

In `js/config.js` `BUSINESS_EMAIL` setzen. Solange dort `null` steht, zeigt
die Seite keine Adresse an, sondern verweist auf das Kontaktformular. Sobald
eine Adresse eingetragen ist, erscheint sie im Kontaktbereich und in der
Fußzeile als anklickbarer `mailto:`-Link.

---

## Social Links ändern

Ebenfalls in `js/config.js`:

```js
SOCIAL: {
  github:    'https://github.com/username',
  linkedin:  null,
  instagram: null
}
```

Nur ausgefüllte Einträge werden gerendert — es entstehen keine leeren Icons.
Alle externen Links erhalten automatisch `target="_blank"` und
`rel="noopener noreferrer"`.

---

## Projekte austauschen

Alles in **`js/projects.js`**. Am HTML muss nichts geändert werden.

Pro Projekt:

```js
{
  id: 'kundenname',
  title: 'Website für Musterbetrieb',
  title_en: 'Website for Musterbetrieb',       // optional
  category: 'Firmenwebsite',
  category_en: 'Company website',              // optional
  description: 'Zwei bis drei Sätze zum Projekt.',
  description_en: 'Two or three sentences.',   // optional
  tech: ['HTML', 'CSS', 'Kontaktformular'],
  image: 'assets/projects/musterbetrieb.webp',
  imageWidth: 1600,
  imageHeight: 1000,
  url: 'https://musterbetrieb.de',
  detailUrl: null,
  placeholder: false                           // Platzhalter-Markierung entfernen
}
```

**Screenshots:** Seitenverhältnis 16:10 (z. B. 1600 × 1000 px), als `.webp`
oder `.jpg`, möglichst unter 250 KB. Ablage in `assets/projects/`. Die Karten
schneiden Desktop-Screenshots oben ausgerichtet zu, damit der Kopfbereich der
gezeigten Website sichtbar bleibt.

`imageWidth` und `imageHeight` bitte mit angeben — sie verhindern, dass das
Layout beim Nachladen springt (Cumulative Layout Shift).

Steht bei `url` noch `null`, wird bewusst kein toter Button erzeugt, sondern
ein Hinweis angezeigt.

---

## Texte ändern (Deutsch/Englisch)

Die Seite erkennt beim ersten Besuch die Browsersprache und wählt Deutsch oder
Englisch. Die Auswahl über den `DE`/`EN`-Schalter wird im Browser gespeichert
und beim nächsten Besuch wiederverwendet.

| Sprache | Wo geändert wird |
|---|---|
| **Deutsch** | direkt im HTML (`index.html` usw.) — Deutsch ist die Standardsprache und funktioniert auch ohne JavaScript |
| **Englisch** | im Objekt `EN` in `js/i18n.js`, über den Schlüssel aus dem `data-i18n`-Attribut |

Beispiel:

```html
<h3 data-i18n="services.web.title">Websites &amp; Landingpages</h3>
```

```js
'services.web.title': 'Websites & landing pages',
```

Fehlt ein englischer Schlüssel, bleibt der deutsche Text stehen — es entstehen
also keine leeren Stellen. Texte, die erst von JavaScript erzeugt werden
(Projektbuttons, Formularfehler), liegen im Objekt `UI` am Ende von
`js/i18n.js` in beiden Sprachen.

---

## Hintergrund-Grafik anpassen

Hinter dem Inhalt der Startseite liegt **ein Browserfenster mit einer
Website darin**, das sich beim Scrollen entwickelt: aus einem technischen
Riss wird eine fertige Seite. Reines Vektor-Linienwerk, kein Bild — die
Ladezeit bleibt unberührt.

Wichtig zum Verständnis: Es sind **keine mehreren Bilder, die abwechselnd
eingeblendet werden.** Jedes Element behält seine Position über den gesamten
Scrollweg und verwandelt sich an Ort und Stelle:

| Scrollweg | Was passiert |
|---|---|
| 5 – 50 % | Ein Lichtpunkt läuft die Umrisse entlang … |
| 7 – 47 % | … und zieht die feste Linie hinter sich her |
| 0 – 34 % | Raster, Bemaßung und Konstruktionslinien treten zurück |
| 20 – 50 % | Die Flächen füllen sich, die Ecken runden sich (3 px → 21 px) |
| 30 – 60 % | Das Browserfenster erscheint: Fensterknöpfe und Adresszeile |
| 34 – 70 % | Die Seite füllt sich: Logo, Navigation, Schaltflächen, Überschrift, Fließtext, Bild mit Motiv, drei Karten, Fußzeile mit Spalten |
| 42 – 80 % | Weiche Farbverläufe legen sich darunter |

Die Fenster überlappen **kräftig**. Das ist kein Zufall: Ohne diese
Überlappung wären in der Mitte alle Gruppen gleichzeitig halb ausgeblendet
und die Grafik fiele in ein sichtbares Loch. Die Gesamtdichte schwankt
dadurch nur noch zwischen 0,43 und 0,65 statt gegen null zu laufen.

Die Zeichnung steht in `index.html` im Block `<div class="bg-art">`. Gesteuert
wird alles über **eine einzige Zahl**: `--p` (0 = Seitenanfang, 1 = Ende),
gesetzt von `initBackgroundArt()` in `js/main.js`. Der Wert läuft dem
Scrollstand weich nach, damit die Entwicklung gleitet statt zu springen.

**Tempo ändern:** ausschließlich die Zeitfenster in `css/styles.css`,
Abschnitt 15. Das SVG bleibt dabei unberührt. Ohne JavaScript bleibt `--p`
bei 0 — dann steht die technische Zeichnung, was für sich stimmig aussieht.

### Der Lichtpunkt

Die fünf Rahmen tragen `pathLength="100"`. Dadurch wird jeder Umriss auf
100 Einheiten normiert und alle laufen im Gleichschritt, unabhängig von
ihrer tatsächlichen Größe. Der Punkt besteht aus zwei Strichen übereinander:
ein breiter, weicher Schein (7 px) und ein schmaler, heller Kern (1,8 px).

**Stärke ändern** — in `css/styles.css` bei den Design-Tokens:

```css
--art-opacity: .13;    /* ruhendes Linienwerk, hell   */
--art-spark:   .155;   /* Lichtpunkt, hell            */
--art-opacity: .19;    /* ruhendes Linienwerk, dunkel */
--art-spark:   .19;    /* Lichtpunkt, dunkel          */
```

> **Vorsicht mit diesen Werten.** Sie sehen klein aus, sind aber richtig so.
> Die Grafik liegt hinter dem Fließtext, deshalb kostet jede Erhöhung direkt
> Textkontrast. Bei den aktuellen Werten bleibt der Kontrast selbst im
> ungünstigsten Fall bei mindestens 4,65 : 1 (hell) und 4,93 : 1 (dunkel) —
> WCAG AA verlangt 4,5 : 1. **Luft nach oben gibt es praktisch keine mehr.**
>
> `--art-spark` ist dabei der empfindlichste Wert: Der Lichtpunkt kreuzt
> beim Wandern zwangsläufig auch Fließtext, und weil sein Kern voll deckend
> gezeichnet wird, schlägt seine Deckkraft ungebremst durch. Bei `.20` hell
> fällt der Kontrast bereits unter die Grenze.

Damit die Grafik nicht verdeckt wird, sind die farbigen Abschnitte (74 %),
die Karten (88 %) und die Fußzeile durchlässig. Das Kontaktformular und das
mobile Menü bleiben deckend — dort braucht der Text ungestörten Grund.

Die Rechtsseiten (`impressum.html`, `datenschutz.html`) haben die Grafik
bewusst nicht: dort zählt reine Lesbarkeit.

## Fortschreitende Gestaltung

Die Website gestaltet sich selbst aus: Der erste Abschnitt wirkt wie ein
Entwurf, der letzte ist vollständig ausgearbeitet. Damit erzählt nicht nur
der Hintergrund die Geschichte, sondern die Seite selbst.

| Abschnitt | Reifegrad `--e` | Karten-Ecken | Kartenfläche | Schaltflächen |
|---|---|---|---|---|
| Hero | 0,14 | — | — | 7 px, Kasten |
| Leistungen | 0,28 | 6 px | 25 % | — |
| Wartung & Support | 0,43 | 8 px | 38 % | — |
| Projekte | 0,57 | 10 px | 50 % | — |
| Ablauf | 0,71 | — | — | — |
| Kalkulation | 0,86 | 19 px | voll | 26 px |
| Kontakt | 1,00 | 22 px | voll + Schatten | 30 px, Pille |

Gesetzt wird `--e` von `initProgressiveStyling()` in `js/main.js`, ausgewertet
in `css/styles.css`, Abschnitt 16. Der Wert ist **statisch** — er wird einmal
je Abschnitt gesetzt und bleibt stehen. Die Seite verändert sich also nicht
unter dem Leser, während er scrollt, und beim Scrollen entsteht kein
Rechenaufwand.

### Zwei Regeln, die diesen Effekt ungefährlich machen

**1. Keine Texteigenschaft wird angefasst.** Weder Schriftfarbe noch -größe
oder -stärke. Der Textkontrast ist im ersten Abschnitt exakt derselbe wie im
letzten. Verändert werden ausschließlich Eckenrundung, Rahmenfarbe, Schatten,
Flächendeckung und Farbsättigung — also nur die Einheiten **um** den Text
herum.

**2. Nichts, was Größe oder Position beeinflusst.** Rahmenbreiten und
Innenabstände bleiben konstant. Nachgemessen: Über 31 Elemente hinweg sind
Position und Größe bei `--e: 0` auf das Pixel genau identisch mit `--e: 1` —
es gibt keinen Layout-Sprung.

Dass die Karten oben halbtransparent sind, kostet keinen Kontrast: Der Text
fällt dann einfach auf den Seitenhintergrund zurück. Gemessen bleibt der
schwächste Wert in den durchsichtigsten Karten bei 7,57 : 1 (hell) und
8,60 : 1 (dunkel) — WCAG AA verlangt 4,5 : 1.

**Stärke ändern:** In `js/main.js` steht `const START = 0.14`. Das ist der
Reifegrad des ersten Abschnitts. Höher = die Seite wirkt oben schon fertiger,
niedriger = der Entwurfscharakter ist deutlicher. Bei 0 sähe der Hero für
Besucher, die das Konzept nicht erkennen, allerdings schlicht nach einer
kaputten Seite aus — deshalb der Startwert oberhalb von null.

Ohne JavaScript bleibt `--e` beim Standardwert 1: Dann sieht der Besucher
schlicht die fertig gestaltete Seite.

## Kontaktformular

Das Formular sendet an einen eigenen Dienst im selben Stack:

```text
Browser -> https://studio.saveroq.com/api/contact -> nginx -> saveroq-studio-api
```

Kein veröffentlichter Port, keine Zugangsdaten im Browser. Der Quellcode
liegt in `api/`, die Weiterleitung in `deploy/nginx.conf`.

### Was noch fehlt: SMTP

Ohne SMTP-Angaben nimmt das Formular Eingaben entgegen, meldet dem Besucher
aber ehrlich einen Fehler — es wird **nie** ein Versand vorgetäuscht.

In `deploy/.env` auf dem Server einzutragen:

| Variable | Pflicht | Bedeutung |
|---|---|---|
| `SMTP_HOST` | ja | Mailserver |
| `SMTP_PORT` | ja | 587 (STARTTLS) oder 465 (SSL) |
| `SMTP_FROM` | ja | Absenderadresse, muss zum Postfach passen |
| `CONTACT_TO` | ja | Zieladresse — kommt nur von hier, nie aus dem Browser |
| `SMTP_USERNAME` | nein | leer lassen bei Relays ohne Anmeldung |
| `SMTP_PASSWORD` | nein | " |
| `SMTP_SECURITY` | nein | `starttls` (Standard), `ssl` oder `none` |

Danach `docker compose -f deploy/compose.yml up -d api`.
Prüfen mit `curl http://api:8000/api/health` im Stack-Netz — dort steht
`smtp_configured`.

### Sicherheit

| | |
|---|---|
| Validierung | vollständig serverseitig, Feldlängen, E-Mail-Format, erlaubte Auswahlwerte |
| Header-Injection | konstruktiv ausgeschlossen: fester Betreff und Empfänger, Nutzereingaben nur im Text |
| Ratenbegrenzung | 10 Anfragen je IP in 15 Minuten, 60 insgesamt; nginx fängt Fluten davor ab |
| Honeypot | unsichtbares Feld, serverseitig geprüft |
| Body-Grenze | 16 KB in nginx und im Dienst |
| Protokoll | keine Inhalte, Namen oder Adressen; IP nur als gekürzter Hash |

### Tests

```bash
docker compose -f deploy/compose.yml --profile test run --rm test
```

20 Tests: Erfolgsfall, fehlende und ungültige Felder, überlange Eingaben,
Header-Injection, Honeypot, Ratenbegrenzung, falsche Methode, ungültiges
JSON, zu großer Body, fehlendes und gestörtes SMTP, Protokollhygiene.

## SEO-Daten ändern

Titel und Meta-Description stehen im `<head>` von `index.html`; die englischen
Fassungen unter den Schlüsseln `meta.title` und `meta.description` in
`js/i18n.js`.

Beim Umzug auf eine eigene Domain müssen die Platzhalter-URLs an vier Stellen
ersetzt werden:

| Datei | Was |
|---|---|
| `index.html` | `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` |
| `impressum.html`, `datenschutz.html` | `<link rel="canonical">` |
| `robots.txt` | `Sitemap:`-Zeile |
| `sitemap.xml` | `<loc>` und `<lastmod>` |

Zusätzlich `SITE_URL` in `js/config.js` pflegen.

Das Social-Vorschaubild liegt unter `assets/images/og-image.png` (1200 × 630 px)
und ist derzeit ein sichtbar markierter Platzhalter.

---

## Security Header (später)

GitHub Pages kann keine eigenen HTTP-Header setzen — die folgenden Header sind
also **noch nicht aktiv**. Sobald die Seite über Cloudflare oder einen eigenen
Webserver läuft, sind sie sinnvoll:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';
    img-src 'self' data:; font-src 'self'; connect-src 'self' https://DEIN-FORMULAR-ENDPUNKT;
    form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Strict-Transport-Security: max-age=31536000; includeSubDomains   ← erst nach vollständiger HTTPS-Umstellung
```

Die Seite ist bereits so gebaut, dass diese CSP ohne Anpassung greift: keine
Inline-Skripte, keine Inline-Eventhandler, keine externen Ressourcen. Nur
`connect-src` muss um den Formular-Endpunkt ergänzt werden.

---

## Checkliste vor dem kommerziellen Launch

Stand: Die Seite ist inhaltlich fertig und wartet auf die Gewerbeanmeldung.

### Erledigt

- [x] Drei echte Referenzen eingetragen (WIVOKO, EVE Tradelooper, Portfolio)
- [x] Business-E-Mail und Ansprechpartnerin in `js/config.js`
- [x] Standort eingetragen
- [x] Impressum mit Anbieterdaten gefüllt
- [x] Datenschutzhinweise mit verantwortlicher Stelle, Hosting, Aufsichtsbehörde
- [x] Beide Rechtsseiten zweisprachig
- [x] Sicherung im privaten Repository `Relis-lol/digitalservice-backup`

### Offen — hängt an der Gewerbeanmeldung

- [ ] Geschäftsbezeichnung in `js/config.js` (`BUSINESS_NAME`) **und** in
      `impressum.html` an der markierten Stelle
- [ ] Logo-Initialen (`BUSINESS_INITIALS`) passend dazu
- [ ] Steuernummer / USt-IdNr. in `impressum.html` — oder Hinweis auf die
      Kleinunternehmerregelung nach § 19 UStG
- [ ] Beide `todo-box`-Kästen aus den Rechtsseiten entfernen, sobald gefüllt

### Offen — Inhalte

- [x] Screenshots der drei Projekte eingebunden (16:10 WebP, 32–96 KB)
- [x] WIVOKO ist online — geprüft am 2026-08-16, Apex leitet auf `/en` weiter
- [x] Alle drei Projektbeschreibungen anhand der Live-Seiten gegengeprüft
      und neu formuliert
- [ ] Eigenes Logo statt `assets/icons/favicon.svg` und `apple-touch-icon.png`
- [ ] OpenGraph-Bild `assets/images/og-image.png` ersetzen
- [ ] Social Links in `js/config.js`, falls gewünscht

### Offen — Technik

- [ ] Domain festlegen und in **fünf** Dateien eintragen: `js/config.js`
      (`SITE_URL`), die canonical-Links in `index.html`, `impressum.html`
      und `datenschutz.html`, dazu `robots.txt` und `sitemap.xml`.
      Aktuell zeigen sie auf das **Backup**-Repository — das ist nicht der
      spätere Hosting-Ort.
- [ ] Kontakt-Endpunkt in `js/config.js` (`CONTACT_FORM_ENDPOINT`)
- [ ] Endpunkt serverseitig absichern (Validierung, Rate Limiting, CORS)
- [ ] Nach Einrichtung: Abschnitt „Kontaktformular" in `datenschutz.html`
      um Empfänger, Verarbeitungsweg und Speicherdauer ergänzen
- [ ] Formular real testen — Absenden, Fehlerfälle, Bestätigung
- [ ] Hosting-Angabe in `datenschutz.html` prüfen, falls nicht GitHub Pages
- [ ] Rechtstexte fachkundig prüfen lassen
- [ ] Beide Sprachen durchklicken, Dark Mode prüfen
- [ ] Mobile Darstellung auf einem echten Gerät prüfen
- [ ] Lighthouse ausführen
- [ ] Alle Links prüfen
- [ ] Keine Secrets im Repository — auch nicht in der Historie

> **Hinweis zum Backup-Repository:** `digitalservice-backup` ist privat und
> dient nur der Sicherung. GitHub Pages aus einem privaten Repository
> auszuliefern erfordert einen kostenpflichtigen Plan — für das Hosting
> wird also ohnehin ein anderer Weg gebraucht.
