/* ==========================================================================
   config.js — Zentrale Konfiguration der Website
   --------------------------------------------------------------------------
   HIER werden Firmendaten, Kontakt und Links gepflegt.
   Es ist NICHT nötig, dafür HTML zu bearbeiten.

   Regel: Ein Wert, der `null` oder ein leerer String ist, wird auf der
   Website NICHT angezeigt (z. B. Telefonnummer, Social-Links).
   ========================================================================== */

const SITE_CONFIG = {
  /* ----------------------------------------------------------------------
     1. Firmendaten
     ---------------------------------------------------------------------- */

  // TODO: Endgültige Geschäftsbezeichnung eintragen, sobald die
  //       Gewerbeanmeldung durch ist. Muss dann auch in impressum.html
  //       an der dort markierten Stelle ergänzt werden.
  BUSINESS_NAME: 'Geschäftsname folgt',

  // Kurzform fürs Logo (2–3 Zeichen). Wird im Logo-Quadrat angezeigt.
  // TODO: Passend zum endgültigen Geschäftsnamen anpassen.
  BUSINESS_INITIALS: 'BB',

  BUSINESS_EMAIL: 'girly.va18@gmail.com',

  // Ansprechpartnerin — wird im Kontaktbereich mit ausgewiesen.
  // Leer lassen oder auf `null` setzen, wenn sie nicht erscheinen soll.
  BUSINESS_CONTACT_PERSON: 'Girly Boldt',

  // Telefonnummer wird nur angezeigt, wenn sie hier gesetzt ist.
  BUSINESS_PHONE: null, // Beispiel: '+49 123 4567890'

  // Standort (frei formuliert).
  BUSINESS_LOCATION: 'Nürnberg, Deutschland',

  /* ----------------------------------------------------------------------
     2. Kontaktformular
     ----------------------------------------------------------------------
     WICHTIG — SICHERHEIT:
     Hier gehoert AUSSCHLIESSLICH eine oeffentliche Endpunkt-URL hinein.
     NIEMALS API-Keys, SMTP-Zugangsdaten, Tokens oder Passwoerter.
     Alles in diesem Repository ist oeffentlich lesbar.

     Solange CONTACT_FORM_ENDPOINT `null` ist, laeuft das Formular im
     DEMO-MODUS: Es validiert die Eingaben, versendet aber nichts und
     weist den Besucher sichtbar darauf hin.

     Geeignete Endpunkte (Secrets liegen dort serverseitig):
       - Cloudflare Worker  (siehe README, Abschnitt "Kontaktformular aktivieren")
       - eigene Serverless Function (Netlify / Vercel / AWS Lambda)
       - eigenes Backend
       - seriöser Formular-Anbieter
     ---------------------------------------------------------------------- */
  CONTACT_FORM_ENDPOINT: null, // Beispiel: 'https://forms.example.workers.dev/submit'

  /* ----------------------------------------------------------------------
     3. Social Links
     ----------------------------------------------------------------------
     Nur ausgefüllte Einträge werden im Footer gerendert.
     Leere/null-Einträge erzeugen KEIN leeres Icon.
     ---------------------------------------------------------------------- */
  SOCIAL: {
    github: null,    // Beispiel: 'https://github.com/username'
    linkedin: null,  // Beispiel: 'https://www.linkedin.com/company/…'
    instagram: null  // Beispiel: 'https://www.instagram.com/username'
  },

  /* ----------------------------------------------------------------------
     4. Seiten-/SEO-Basis
     ----------------------------------------------------------------------
     SITE_URL wird für canonical-Links, OpenGraph und sitemap.xml gebraucht.
     TODO: Vor dem Launch auf die echte Domain umstellen und zusätzlich
           in index.html / impressum.html / datenschutz.html / sitemap.xml
           die dortigen canonical- und og:url-Angaben anpassen.
     ---------------------------------------------------------------------- */
  // TODO: Auf die echte Domain umstellen, sobald sie feststeht.
  //       Achtung: Das Repository digitalservice-backup ist NUR die
  //       Sicherungskopie, nicht der spätere Hosting-Ort.
  SITE_URL: 'https://relis-lol.github.io/digitalservice-backup/',

  /* ----------------------------------------------------------------------
     5. Verhalten
     ---------------------------------------------------------------------- */
  // Standardsprache, wenn die Browsersprache weder 'de' noch 'en' ist.
  DEFAULT_LANG: 'de',

  // Maximale Zeichenlängen im Kontaktformular (auch serverseitig prüfen!).
  FORM_LIMITS: {
    name: 100,
    email: 150,
    company: 120,
    website: 200,
    message: 2000
  }
};
