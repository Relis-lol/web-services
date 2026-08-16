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
     tech        Liste von Technologien / Leistungen (Strings).
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
    title: 'WIVOKO — Fashion-Marke',
    title_en: 'WIVOKO — fashion brand',
    category: 'Marken- & Produktseite',
    category_en: 'Brand & product site',
    description:
      'Produktseite für eine Fashion-Marke mit Sitz in Korea und internationalem ' +
      'Verkauf. Vier Sprachfassungen, durchgehend auf das Smartphone ausgelegt und ' +
      'darauf optimiert, Produktbilder schnell und in voller Qualität auszuliefern.',
    description_en:
      'Product site for a fashion brand based in Korea selling internationally. ' +
      'Four language versions, built mobile-first and tuned to deliver product ' +
      'imagery quickly and at full quality.',
    tech: ['Next.js', 'Vier Sprachen', 'Mobile First', 'Bildoptimierung', 'Basis-SEO'],
    // TODO: Echten Screenshot ergänzen (16:10, .webp, unter 250 KB).
    image: 'assets/projects/placeholder.svg',
    imageWidth: 1600,
    imageHeight: 1000,
    url: 'https://wivoko.com/',
    detailUrl: null,
    placeholder: false
  },
  {
    id: 'eve-tradelooper',
    title: 'EVE Tradelooper — Handelsplattform',
    title_en: 'EVE Tradelooper — trading platform',
    category: 'Web-Anwendung, API & Datenbank',
    category_en: 'Web application, API & database',
    description:
      'Auswertungsplattform für Marktdaten mit eigener API und Datenbank im ' +
      'Hintergrund. Die Datenbasis umfasst Millionen Datensätze und wird täglich ' +
      'automatisch aktualisiert. Läuft auf einem eigenen Linux-Server mit ' +
      'festem Deployment-Weg.',
    description_en:
      'Market data analysis platform with its own API and database behind it. ' +
      'The dataset runs into millions of records and is refreshed automatically ' +
      'every day. Hosted on a dedicated Linux server with a fixed deployment path.',
    tech: ['Eigene API', 'Datenbank', 'Millionen Datensätze', 'Tägliche Aktualisierung',
           'Linux-Server', 'Deployment-Workflow'],
    // TODO: Echten Screenshot ergänzen (16:10, .webp, unter 250 KB).
    image: 'assets/projects/placeholder.svg',
    imageWidth: 1600,
    imageHeight: 1000,
    url: 'https://eve-tradelooper.com/',
    detailUrl: null,
    placeholder: false
  },
  {
    id: 'portfolio',
    title: 'Entwickler-Portfolio',
    title_en: 'Developer portfolio',
    category: 'Portfolio & Projektübersicht',
    category_en: 'Portfolio & project overview',
    description:
      'Persönliche Portfolioseite mit Projektübersicht. Vollständig statisch ' +
      'ausgeliefert: keine Datenbank, kein Framework, keine externen Abhängigkeiten. ' +
      'Dadurch lädt sie praktisch verzögerungsfrei und ist wartungsarm im Betrieb.',
    description_en:
      'Personal portfolio site with a project overview. Served entirely as static ' +
      'files: no database, no framework, no external dependencies. The result loads ' +
      'almost instantly and needs very little upkeep.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Statisch', 'GitHub Pages', 'Responsive'],
    // TODO: Echten Screenshot ergänzen (16:10, .webp, unter 250 KB).
    image: 'assets/projects/placeholder.svg',
    imageWidth: 1600,
    imageHeight: 1000,
    url: 'https://relis-lol.github.io/',
    detailUrl: null,
    placeholder: false
  }

  /* Später problemlos erweiterbar, z. B. um eine Case Study für ein
     AI-/Creative-Projekt — einfach ein weiteres Objekt anhängen. */
];
