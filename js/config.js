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

  /* Geschäftsbezeichnung. Erscheint in Kopfzeile, Fußzeile und als
     Anbieterangabe im Impressum. */
  BUSINESS_NAME: 'Saveroq Studio',

  // Kurzform fürs Logo (2–3 Zeichen). Wird im Logo-Quadrat angezeigt.
  BUSINESS_INITIALS: 'SQ',

  /* Kundenkontakt. Diese Adresse steht im Kontaktbereich, in der Fusszeile
     und ist das Ziel des Kontaktformulars. */
  BUSINESS_EMAIL: 'girly.va18@gmail.com',

  /* Ansprechpartnerin fuer Kundenanfragen, Angebote, Termine und die
     virtuelle Assistenz. */
  BUSINESS_CONTACT_PERSON: 'Girly Boldt',

  /* Betreiber im Sinne des Impressums. Einzelunternehmen — bewusst keine
     Bezeichnung als Geschaeftsfuehrung. */
  BUSINESS_OWNER: 'Björn Boldt',

  /* Rechtliche, formelle und datenschutzbezogene Anfragen gehen an den
     Betreiber, nicht an den Kundenkontakt. Bewusst getrennt: Eine
     Auskunft nach Art. 15 DSGVO gehoert nicht ins Anfragepostfach. */
  BUSINESS_LEGAL_EMAIL: 'relislol@yahoo.com',

  // Telefonnummer wird nur angezeigt, wenn sie hier gesetzt ist.
  BUSINESS_PHONE: null, // Beispiel: '+49 123 4567890'

  // Standort (frei formuliert).
  BUSINESS_LOCATION: 'Nürnberg, Deutschland',

  /* ----------------------------------------------------------------------
     Steuerliche Kennungen — optional
     ----------------------------------------------------------------------
     Nach § 5 DDG anzugeben ist eine Umsatzsteuer-Identifikationsnummer
     oder eine Wirtschafts-Identifikationsnummer, SOFERN VORHANDEN. Eine
     gewoehnliche Steuernummer gehoert ausdruecklich nicht auf die Seite.

     Solange beide Felder `null` sind, erscheint im Impressum GAR KEIN
     Abschnitt dazu — kein Platzhalter, keine leere Ueberschrift. Der
     Abschnitt wird von js/main.js erst erzeugt, wenn hier etwas steht.
     ---------------------------------------------------------------------- */
  BUSINESS_VAT_ID: null,        // z. B. 'DE123456789'
  BUSINESS_ECONOMIC_ID: null,   // Wirtschafts-Identifikationsnummer

  /* ----------------------------------------------------------------------
     2. Kontaktformular
     ----------------------------------------------------------------------
     Der Endpunkt liegt auf derselben Adresse wie die Seite. nginx reicht
     ihn an einen internen Container weiter, der die Anfrage prueft und
     per SMTP zustellt.

     WICHTIG — SICHERHEIT:
     Hier steht nur ein Pfad, niemals Zugangsdaten. SMTP-Benutzer,
     Passwort und Zieladresse liegen ausschliesslich in deploy/.env auf
     dem Server und sind fuer den Browser unerreichbar.

     Eine absolute URL waere hier moeglich, aber unnoetig: Ein relativer
     Pfad bleibt bei einem Domainwechsel richtig und kommt ohne
     Erweiterung der CSP aus (connect-src 'self' deckt ihn ab).
     ---------------------------------------------------------------------- */
  CONTACT_FORM_ENDPOINT: '/api/contact',

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
