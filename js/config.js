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

  /* >>> LAUNCH-FELD 1 — erledigt <<<
     Geschäftsbezeichnung. Erscheint in Kopfzeile, Fußzeile und als
     Anbieterangabe im Impressum. Zusammen mit Launch-Feld 2 steuert der
     Wert, ob die gelben Hinweiskästen auf den Rechtsseiten verschwinden. */
  BUSINESS_NAME: 'Saveroq Studio',

  // Kurzform fürs Logo (2–3 Zeichen). Wird im Logo-Quadrat angezeigt.
  BUSINESS_INITIALS: 'SQ',

  BUSINESS_EMAIL: 'girly.va18@gmail.com',

  // Ansprechpartnerin — wird im Kontaktbereich mit ausgewiesen.
  // Leer lassen oder auf `null` setzen, wenn sie nicht erscheinen soll.
  BUSINESS_CONTACT_PERSON: 'Girly Boldt',

  // Telefonnummer wird nur angezeigt, wenn sie hier gesetzt ist.
  BUSINESS_PHONE: null, // Beispiel: '+49 123 4567890'

  // Standort (frei formuliert).
  BUSINESS_LOCATION: 'Nürnberg, Deutschland',

  /* >>> LAUNCH-FELD 2 <<<
     Steuerliche Angabe fürs Impressum. GENAU EINES von beiden ausfüllen:

       BUSINESS_VAT_ID    Umsatzsteuer-Identifikationsnummer nach § 27a UStG
       BUSINESS_TAX_NOTE  Freitext, wenn keine USt-IdNr. vorliegt
                          (Standardfall bei der Kleinunternehmerregelung)

     Beispiel Kleinunternehmer:
       BUSINESS_TAX_NOTE: 'Als Kleinunternehmer im Sinne von § 19 UStG ' +
                          'wird keine Umsatzsteuer berechnet.' */
  BUSINESS_VAT_ID: null,     // z. B. 'DE123456789'
  BUSINESS_TAX_NOTE: null,   // Freitext statt USt-IdNr.

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
     ---------------------------------------------------------------------- */
  /* Zeigt bereits auf die endgültige GitHub-Pages-Adresse dieses
     Repositories — beim Schalten ist hier also NICHTS zu tun.
     Nur bei einer eigenen Domain umstellen; dafür gibt es
     scripts/domain-setzen.py, das alle Dateien auf einmal anpasst. */
  SITE_URL: 'https://studio.saveroq.com/',

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
