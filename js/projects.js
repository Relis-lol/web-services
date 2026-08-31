/* ==========================================================================
   projects.js — Referenzprojekte
   --------------------------------------------------------------------------
   HIER werden die Projekte gepflegt. Das HTML muss dafür NICHT angefasst
   werden — die Karten werden aus dieser Liste erzeugt.

   Felder je Projekt:
     id          Interne, eindeutige Kennung (nur a-z, 0-9, Bindestrich).
     title       Projektname (Deutsch / Anzeigename).
     title_en    Optional: englischer Titel. Fehlt er, wird `title` genutzt.
     category    Kategorie, z. B. 'Firmenwebsite', 'Web-Anwendung'.
     category_en Optional: englische Kategorie.
     description Kurzbeschreibung, 1–3 Sätze.
     description_en Optional: englische Kurzbeschreibung.
     tech        Liste von Technologien / Leistungen (Strings), deutsch.
     tech_en     Optional: englische Fassung derselben Liste. Fehlt sie,
                 bleiben die deutschen Merkmale auch in der englischen
                 Sprachfassung stehen — genau das war ein Fehler, den ein
                 Besucher der englischen Seite sofort sieht.
     image       Pfad zum Screenshot, relativ zum Projektstamm.
     imageWidth  Natürliche Bildbreite in Pixeln  ┐ verhindert Layout-Shift
     imageHeight Natürliche Bildhöhe in Pixeln    ┘ (CLS)
     url         Öffentliche Projekt-URL oder `null` (Button wird dann
                 deaktiviert dargestellt statt ins Leere zu verlinken).
     detailUrl   Optional: Link zu einer ausführlichen Case Study oder `null`.
     placeholder true = Karte wird sichtbar als Platzhalter markiert.
                 Bei echten Projekten auf `false` setzen oder entfernen.

   SCREENSHOT-EMPFEHLUNG:
     Seitenverhältnis 16:10 (z. B. 1600x1000 px), als .webp oder .jpg,
     Dateigröße möglichst unter 250 KB. Bilder nach assets/projects/ legen.
   ========================================================================== */

const PROJECTS = [
  {
    id: 'wivoko',
    title: 'WIVOKO — Fashion-Charm-Marke',
    title_en: 'WIVOKO — fashion charm brand',
    category: 'Marken- & Produktpräsentation',
    category_en: 'Brand & product presentation',
    description:
      'Markenauftritt für ein modulares Fashion-Charm-System: ein etwa 15 cm großer ' +
      'Charakter, der sich über austauschbare Haare, Kleidung und Accessoires immer ' +
      'neu stylen lässt. Neun Unterseiten in vier Sprachen für den englischen und ' +
      'asiatischen Markt, vorgerendert ausgeliefert und mit durchgehend ' +
      'komprimierten Produktbildern.',
    description_en:
      'Brand presence for a modular fashion charm system: a character roughly 15 cm ' +
      'tall that can be restyled through interchangeable hair, clothing and ' +
      'accessories. Nine subpages across four languages for the English-speaking and ' +
      'Asian markets, served pre-rendered with fully compressed product imagery.',
    tech: ['Next.js', 'Vorgerendert (SSG)', 'Vier Sprachen (EN/KO/JA/ZH)',
           'WebP-Bilder', 'Cloudflare', 'Responsive'],
    tech_en: ['Next.js', 'Pre-rendered (SSG)', 'Four languages (EN/KO/JA/ZH)',
              'WebP images', 'Cloudflare', 'Responsive'],
    image: 'assets/projects/wivoko.webp',
    imageWidth: 1600,
    imageHeight: 1000,
    // Geprüft am 2026-08-19: Die Apex-Domain leitet auf /en weiter (307).
    // Bewusst ohne "www" und ohne Sprachpfad — so landet jeder Besucher
    // automatisch in der für ihn passenden Sprachfassung.
    url: 'https://wivoko.com/',
    detailUrl: null,
    placeholder: false
  },
  {
    id: 'eve-tradelooper',
    title: 'EVE Market Tools',
    title_en: 'EVE Market Tools',
    category: 'Web-Anwendung, API & Datenbank',
    category_en: 'Web application, API & database',
    description:
      'Umfangreiche Werkzeugsammlung für ein Online-Spiel, aufgebaut auf einer ' +
      'eigenen Datenbank mit angeschlossener API. Rund 7,5 Millionen neue ' +
      'Datensätze am Tag werden automatisch eingelesen und stehen in Handels-, ' +
      'Industrie- und Abbaurechnern, in der Routenbewertung und in der ' +
      'Kampfauswertung zur Verfügung. Ein einziges Eingabefeld erkennt ' +
      'selbstständig, welche Art von Liste eingefügt wurde. Acht Sprachen, ohne ' +
      'Anmeldung und ohne Werbung.',
    description_en:
      'An extensive toolset for an online game, built on a dedicated database with ' +
      'an API on top. Around 7.5 million new records a day are imported ' +
      'automatically and feed trade, industry and mining calculators, route risk ' +
      'assessment and combat analysis. A single input field works out on its own ' +
      'what kind of list has been pasted. Eight languages, no login and no ads.',
    tech: ['Eigene API', 'Datenbank', '7,5 Mio. Datensätze pro Tag',
           'Automatischer Import', 'Acht Sprachen', 'Linux-Server'],
    tech_en: ['Custom API', 'Database', '7.5M records per day',
              'Automated import', 'Eight languages', 'Linux server'],
    image: 'assets/projects/eve.webp',
    imageWidth: 1120,
    imageHeight: 700,
    url: 'https://eve-tradelooper.com/',
    detailUrl: null,
    placeholder: false
  },
  {
    id: 'alice-syndrome-archive',
    title: 'ALICE SYNDROME Archive',
    title_en: 'ALICE SYNDROME Archive',
    category: 'Redaktionelles Archiv, zweisprachig',
    category_en: 'Editorial archive, bilingual',
    description:
      'Fan-Archiv zu einer koreanischen Rockband — ausdrücklich inoffiziell, ' +
      'so steht es auch auf der Seite selbst. Bündelt Mitglieder, Diskografie, ' +
      'Zeitleiste, Termine und wöchentliche Rückblicke. Jede Meldung ist ' +
      'datiert und mit ihrer Quelle verknüpft. Vollständig auf Koreanisch und ' +
      'Englisch, mit einem Hintergrunddienst, der die Einträge laufend pflegt.',
    description_en:
      'Fan archive for a Korean rock band — explicitly unofficial, as the site ' +
      'itself states. It brings together members, discography, timeline, dates ' +
      'and weekly recaps. Every entry is dated and linked to its source. Fully ' +
      'bilingual in Korean and English, with a background service keeping the ' +
      'entries current.',
    tech: ['Next.js', 'Koreanisch & Englisch', 'Hintergrunddienst',
           'Datenhaltung', 'Cloudflare Tunnel', 'Docker'],
    tech_en: ['Next.js', 'Korean & English', 'Background worker',
              'Data storage', 'Cloudflare Tunnel', 'Docker'],
    image: 'assets/projects/alice.webp',
    imageWidth: 1600,
    imageHeight: 1000,
    url: 'https://alicesyndromearchive.com/',
    detailUrl: null,
    placeholder: false
  },
  {
    id: 'portfolio',
    title: 'Technisches Profil — Cloud & Plattformbetrieb',
    title_en: 'Technical profile — cloud & platform operations',
    category: 'Kompetenznachweis',
    category_en: 'Proof of competence',
    description:
      'Kein Kundenprojekt, sondern der Nachweis der technischen Grundlage ' +
      'hinter diesen Leistungen: ein eigenes Profil für Cloud- und ' +
      'Plattformbetrieb mit Linux, Docker, Python, PostgreSQL und ' +
      'Azure-Grundlagen. Dort sind drei selbst betriebene Systeme mit ' +
      'Kennzahl, Technologiestack und Verweis auf den Quellcode ' +
      'dokumentiert — darunter die Plattform aus Projekt 02.',
    description_en:
      'Not a client project but evidence of the technical grounding behind ' +
      'these services: a personal profile for cloud and platform operations ' +
      'covering Linux, Docker, Python, PostgreSQL and Azure fundamentals. It ' +
      'documents three self-operated systems with a headline metric, ' +
      'technology stack and links to the source code — including the ' +
      'platform from project 02.',
    tech: ['Linux', 'Docker', 'Python', 'PostgreSQL',
           'Azure-Grundlagen (AZ-900)', 'Statische Auslieferung'],
    tech_en: ['Linux', 'Docker', 'Python', 'PostgreSQL',
              'Azure fundamentals (AZ-900)', 'Static delivery'],
    image: 'assets/projects/portfolio.webp',
    imageWidth: 1600,
    imageHeight: 1000,
    url: 'https://relis-lol.github.io/',
    detailUrl: null,
    placeholder: false
  }

  /* Später problemlos erweiterbar, z. B. um eine Case Study für ein
     AI-/Creative-Projekt — einfach ein weiteres Objekt anhängen. */
];
