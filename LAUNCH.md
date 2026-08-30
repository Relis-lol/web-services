# Livegang

Die Seite ist fertig und wartet nur noch auf die Gewerbeanmeldung.
Zum Schalten sind **zwei Felder** auszufüllen und **ein Schalter** umzulegen.

---

## Schritt 1 — zwei Felder in `js/config.js`

```js
BUSINESS_NAME: 'Boldt Web Services',      // Feld 1: Geschäftsbezeichnung

BUSINESS_VAT_ID: 'DE123456789',           // Feld 2, Variante A: USt-IdNr.
// ODER, falls keine USt-IdNr. vorliegt:
BUSINESS_TAX_NOTE: 'Als Kleinunternehmer im Sinne von § 19 UStG ' +
                   'wird keine Umsatzsteuer berechnet.',
```

Von **Feld 2** wird genau eine der beiden Varianten gefüllt, die andere
bleibt auf `null`.

Optional dazu: `BUSINESS_INITIALS` auf die Initialen des neuen Namens
setzen (steht derzeit auf `BB`).

**Das war es an Textarbeit.** Am HTML ist nichts zu ändern. Sobald beide
Felder gefüllt sind, passiert automatisch Folgendes:

- Der Geschäftsname erscheint in Kopfzeile, Fußzeile und im Impressum
- Die steuerliche Angabe wird ins Impressum eingesetzt, zweisprachig
- Die eckigen Platzhalter verschwinden
- Die gelben Hinweiskästen auf beiden Rechtsseiten verschwinden

Zum Prüfen vorher lokal starten:

```bash
python -m http.server 8000
```

---

## Schritt 2 — Domain zuerst, dann Pages

Die Seite soll über Google gefunden werden. Dafür braucht sie eine **eigene
Domain**, keinen Unterpfad. `relis-lol.github.io/web-services/` ist als
Adresse ungeeignet: Sie gehört sichtbar zu einem fremden Profil und ist als
Projektpfad für Suchmaschinen schwächer als eine eigene Domain.

Deshalb steht in `index.html` derzeit `noindex`. Wird nämlich zuerst der
Projektpfad indexiert, steht er später als konkurrierende Fassung im Index —
und GitHub Pages kann aus einem Projektpfad **keine 301-Weiterleitung** auf
die neue Domain setzen. Die alten Treffer liessen sich also nicht sauber
umleiten.

Reihenfolge deshalb:

1. Domain registrieren
2. DNS setzen (siehe unten)
3. In **Settings → Pages → Custom domain** eintragen, **Enforce HTTPS** an
4. Adressen umstellen — das schaltet `noindex` automatisch ab:

```bash
python scripts/domain-setzen.py https://deine-domain.de/
```

5. Domain in der Google Search Console anmelden und die Sitemap einreichen

Wer trotzdem vorab auf dem Projektpfad starten will: Das geht, die Seite
bleibt dann nur aus dem Suchindex heraus. Zum Testen reicht das völlig.

## Schritt 3 — GitHub Pages einschalten

Im Repository **Settings → Pages**:

- Source: **Deploy from a branch**
- Branch: **main**, Ordner: **/ (root)**
- Speichern

Nach ein bis zwei Minuten läuft die Seite unter
`https://relis-lol.github.io/web-services/`.

Die URLs im Projekt zeigen bereits dorthin — es ist **keine** weitere
Änderung nötig.

---

## DNS-Einträge für die eigene Domain

1. Beim Domain-Anbieter DNS setzen
   - Apex (`beispiel.de`) → vier `A`-Records auf
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` auf `relis-lol.github.io`
2. In **Settings → Pages → Custom domain** die Domain eintragen
3. **Enforce HTTPS** aktivieren, sobald das Zertifikat da ist
4. Alle Adressen im Projekt auf einmal umstellen:

```bash
python scripts/domain-setzen.py https://beispiel.de/
```

Vorher ansehen, was sich ändern würde:

```bash
python scripts/domain-setzen.py https://beispiel.de/ --probe
```

---

## Was danach noch offen bleibt

Diese Punkte hindern den Start nicht, sollten aber nachgezogen werden:

| Punkt | Wo |
|---|---|
| Screenshots der drei Projekte statt der Platzhaltergrafik | `js/projects.js`, Bilder nach `assets/projects/` |
| Kontaktformular scharf schalten | `CONTACT_FORM_ENDPOINT` in `js/config.js`, siehe README |
| Danach: Empfänger und Speicherdauer im Datenschutz ergänzen | `datenschutz.html`, Abschnitt Kontaktformular |
| Eigenes Logo statt der Platzhaltergrafik | `assets/icons/favicon.svg`, `apple-touch-icon.png` |
| OpenGraph-Vorschaubild | `assets/images/og-image.png` |
| Rechtstexte fachkundig prüfen lassen | `impressum.html`, `datenschutz.html` |
| Social Links, falls gewünscht | `SOCIAL` in `js/config.js` |

---

## Zur Sichtbarkeit

Dieses Repository ist **öffentlich**. Der Inhalt — einschließlich der
Anschrift im Impressum — ist damit lesbar, **auch solange GitHub Pages
ausgeschaltet ist**. Wer das bis zum Start vermeiden will, schaltet das
Repository vorübergehend auf privat:

```bash
gh repo edit Relis-lol/web-services --visibility private --accept-visibility-change-consequences
```

Und zum Start zurück:

```bash
gh repo edit Relis-lol/web-services --visibility public --accept-visibility-change-consequences
```

GitHub Pages aus einem privaten Repository auszuliefern setzt einen
kostenpflichtigen Plan voraus — zum Zeitpunkt des Starts muss das
Repository also ohnehin öffentlich sein.
