/* ==========================================================================
   main.js — Verhalten der Website
   --------------------------------------------------------------------------
   Enthält bewusst nur das, was ohne JavaScript nicht ginge:
     - Sprachumschaltung  - Farbschema      - Mobiles Menü
     - Projektkarten      - Kontaktdaten    - Formularvalidierung
     - dezente Einblendungen beim Scrollen

   Sicherheitsregeln, die hier durchgängig gelten:
     - Kein `innerHTML` mit Daten aus Konfiguration oder Nutzereingaben.
       Alles wird über createElement / textContent aufgebaut.
     - Keine Inline-Eventhandler im HTML, kein `eval`.
     - Externe Links immer mit rel="noopener noreferrer".
     - Keine Secrets in dieser Datei. Das gesamte Repository ist öffentlich.
   ========================================================================== */

(function () {
  'use strict';

  const doc = document;
  const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* JS ist aktiv -> Einblende-Effekte dürfen greifen. */
  doc.documentElement.classList.add('js');

  /* Kleine Helfer ------------------------------------------------------- */

  function el(tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function isFilled(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function store(action, key, value) {
    try {
      if (action === 'get') return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* localStorage kann blockiert sein */ }
    return null;
  }

  /* ======================================================================
     1. FARBSCHEMA
     ====================================================================== */

  const THEME_KEY = 'site-theme';

  function effectiveTheme() {
    const stored = store('get', THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    doc.documentElement.setAttribute('data-theme', theme);
    store('set', THEME_KEY, theme);
    const meta = doc.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0e1116' : '#ffffff');
  }

  function initTheme() {
    const stored = store('get', THEME_KEY);
    // Ohne gespeicherte Auswahl bleibt "auto" -> Systemeinstellung entscheidet.
    doc.documentElement.setAttribute('data-theme', stored === 'light' || stored === 'dark' ? stored : 'auto');

    const toggle = doc.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ======================================================================
     2. SPRACHE
     ====================================================================== */

  function initLanguage() {
    if (typeof I18N === 'undefined') return;

    I18N.apply(I18N.detect());

    doc.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        I18N.apply(btn.dataset.lang);
      });
    });
  }

  /* ======================================================================
     3. MOBILES MENÜ
     ====================================================================== */

  function initMobileNav() {
    const toggle = doc.getElementById('nav-toggle');
    const nav = doc.getElementById('nav-mobile');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.hidden = !open;
      if (typeof I18N !== 'undefined') {
        toggle.setAttribute('aria-label', I18N.t(open ? 'menuClose' : 'menuOpen'));
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Nach der Auswahl eines Links schließen.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    // Escape schließt und gibt den Fokus zurück.
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Beim Wechsel auf Desktop-Breite aufräumen.
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ======================================================================
     4. HEADER-ZUSTAND & AKTIVER NAVIGATIONSPUNKT
     ====================================================================== */

  function initHeader() {
    const header = doc.getElementById('site-header');
    if (!header) return;

    let ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initScrollSpy() {
    const links = Array.prototype.slice.call(
      doc.querySelectorAll('.nav-desktop a[href^="#"]')
    );
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = links
      .map(function (link) {
        const id = link.getAttribute('href').slice(1);
        return id ? doc.getElementById(id) : null;
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          const match = link.getAttribute('href') === '#' + entry.target.id;
          if (match) { link.setAttribute('aria-current', 'true'); }
          else { link.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ======================================================================
     5. EINBLENDUNGEN BEIM SCROLLEN
     ====================================================================== */

  function initReveal() {
    const items = doc.querySelectorAll('.reveal');
    if (!items.length) return;

    function showAll() {
      items.forEach(function (item) { item.classList.add('is-visible'); });
    }

    // Ohne nutzbares Viewport kann kein IntersectionObserver auslösen
    // (z. B. in eingebetteten Vorschauen). Dann gar nicht erst animieren.
    function viewportUsable() {
      return window.innerHeight > 0 && window.innerWidth > 0;
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window) || !viewportUsable()) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    items.forEach(function (item) { observer.observe(item); });

    // Sicherheitsnetz: Falls das Viewport erst später zusammenbricht oder
    // gar nichts ausgelöst wurde, wird alles regulär angezeigt.
    // Inhalte dürfen unter keinen Umständen unsichtbar bleiben.
    window.setTimeout(function () {
      if (viewportUsable()) return;
      observer.disconnect();
      showAll();
    }, 1500);
  }

  /* ======================================================================
     5b. HINTERGRUND-GRAFIK
     ----------------------------------------------------------------------
     Blendet drei SVG-Ebenen abhängig vom Scroll-Fortschritt ineinander:
       Anfang der Seite  -> technische Zeichnung
       Mitte             -> Aufbau, Flächen entstehen
       Ende              -> fertige Komposition

     Es wird ausschließlich `opacity` verändert. Das läuft im Compositor
     und erzwingt kein neues Layout — auch auf schwächeren Geräten günstig.
     ====================================================================== */

  function initBackgroundArt() {
    const art = doc.getElementById('bg-art');
    if (!art) return;

    let current = 0;      // aktuell gezeigter Fortschritt
    let target = 0;       // vom Scrollstand geforderter Fortschritt
    let running = false;

    function targetFromScroll() {
      const scrollable = doc.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return 0;   // zu kurze Seite: Ausgangszustand
      return Math.min(1, Math.max(0, window.scrollY / scrollable));
    }

    function paint(value) {
      current = value;
      art.style.setProperty('--p', value.toFixed(4));
    }

    /* Weiches Nachlaufen: Der gezeigte Wert nähert sich pro Bild ein Stück
       dem Zielwert an. Dadurch entwickelt sich die Zeichnung gleitend
       weiter, statt bei jedem Scroll-Ereignis zu springen — auch beim
       Scrollen mit dem Mausrad, das in groben Stufen arbeitet. */
    function tick() {
      const diff = target - current;

      if (Math.abs(diff) < 0.0008) {
        paint(target);
        running = false;
        return;
      }
      paint(current + diff * 0.14);
      window.requestAnimationFrame(tick);
    }

    function onScroll() {
      target = targetFromScroll();

      // Bei reduzierter Bewegung ohne Nachlauf direkt setzen.
      if (prefersReducedMotion) { paint(target); return; }

      if (!running) { running = true; window.requestAnimationFrame(tick); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    target = targetFromScroll();
    paint(target);
  }

  /* ======================================================================
     5c. FORTSCHREITENDE GESTALTUNG
     ----------------------------------------------------------------------
     Setzt je Abschnitt den Reifegrad --e anhand seiner Position im
     Dokument: oben Entwurf, unten fertig gestaltet.

     Der Wert wird EINMAL gesetzt und bleibt dann stehen. Die Seite
     verändert sich also nicht unter dem Leser, während er scrollt —
     das wäre unruhig und würde vom Inhalt ablenken.

     Was --e bewirkt, steht in css/styles.css, Abschnitt 16. Dort ist
     auch festgehalten, warum keine Texteigenschaft davon berührt wird.

     Ohne JavaScript bleibt --e beim Standardwert 1: dann sieht der
     Besucher schlicht die fertig gestaltete Seite.
     ====================================================================== */

  function initProgressiveStyling() {
    const stages = doc.querySelectorAll('main > section');
    if (stages.length < 2) return;

    // Der erste Abschnitt startet nicht bei 0, sondern etwas darüber.
    // Ein völlig roher Entwurf würde für Besucher, die das Konzept nicht
    // erkennen, schlicht nach einer kaputten Seite aussehen.
    const START = 0.14;
    const last = stages.length - 1;

    stages.forEach(function (section, index) {
      const e = START + (1 - START) * (index / last);
      section.style.setProperty('--e', e.toFixed(3));
    });
  }

  /* ======================================================================
     6. FIRMENDATEN AUS config.js EINSETZEN
     ====================================================================== */

  function applyBusinessData() {
    if (isFilled(cfg.BUSINESS_NAME)) {
      doc.querySelectorAll('[data-site="name"]').forEach(function (node) {
        node.textContent = cfg.BUSINESS_NAME;
      });
    }
    if (isFilled(cfg.BUSINESS_INITIALS)) {
      doc.querySelectorAll('[data-site="initials"]').forEach(function (node) {
        node.textContent = cfg.BUSINESS_INITIALS;
      });
    }
    const year = doc.getElementById('footer-year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* Ein Eintrag der Kontaktliste: Label + Wert (optional als Link). */
  function contactItem(label, value, href) {
    const li = el('li');
    if (isFilled(label)) li.appendChild(el('span', 'label', label));
    if (href) {
      const a = el('a', null, value);
      a.href = href;
      li.appendChild(a);
    } else {
      li.appendChild(doc.createTextNode(value));
    }
    return li;
  }

  function renderContactDetails() {
    const targets = [
      doc.getElementById('contact-details'),
      doc.getElementById('footer-contact')
    ].filter(Boolean);
    if (!targets.length) return;

    const t = typeof I18N !== 'undefined' ? I18N.t.bind(I18N) : function (k) { return k; };

    targets.forEach(function (list) {
      list.textContent = '';   // sicher leeren
      const isFooter = list.id === 'footer-contact';

      if (isFilled(cfg.BUSINESS_EMAIL)) {
        list.appendChild(
          isFooter
            ? contactItem('', cfg.BUSINESS_EMAIL, 'mailto:' + cfg.BUSINESS_EMAIL)
            : contactItem(t('labelEmail'), cfg.BUSINESS_EMAIL, 'mailto:' + cfg.BUSINESS_EMAIL)
        );
      } else {
        // Keine erfundene Adresse anzeigen — stattdessen aufs Formular verweisen.
        const li = el('li');
        const a = el('a', null, t('contactViaForm'));
        a.href = isFooter ? 'index.html#kontakt' : '#kontakt';
        li.appendChild(a);
        list.appendChild(li);
      }

      // Ansprechpartnerin, Telefon und Standort: nur wenn konfiguriert.
      if (isFilled(cfg.BUSINESS_CONTACT_PERSON)) {
        list.appendChild(
          contactItem(isFooter ? '' : t('labelPerson'), cfg.BUSINESS_CONTACT_PERSON, null)
        );
      }
      if (isFilled(cfg.BUSINESS_PHONE)) {
        const tel = 'tel:' + cfg.BUSINESS_PHONE.replace(/[^\d+]/g, '');
        list.appendChild(
          contactItem(isFooter ? '' : t('labelPhone'), cfg.BUSINESS_PHONE, tel)
        );
      }
      if (isFilled(cfg.BUSINESS_LOCATION)) {
        list.appendChild(
          contactItem(isFooter ? '' : t('labelLocation'), cfg.BUSINESS_LOCATION, null)
        );
      }
    });
  }

  /* ======================================================================
     6b. STARTKLAR-ZUSTAND DER RECHTSSEITEN
     ----------------------------------------------------------------------
     Die Seite gilt als startklar, sobald in js/config.js beide
     Launch-Felder ausgefüllt sind:

       1. BUSINESS_NAME
       2. BUSINESS_VAT_ID  ODER  BUSINESS_TAX_NOTE

     Bis dahin bleiben die gelben Hinweiskästen und die eckigen
     Platzhalter sichtbar. Danach verschwinden sie von selbst — es muss
     also kein HTML angefasst werden, um die Seite zu veröffentlichen.
     ====================================================================== */

  /* Ein Hinweiskasten im HTML nennt seine Bedingungen selbst, z. B.
     data-todo-until-ready="firma endpunkt". Er verschwindet erst, wenn
     ALLE genannten Bedingungen erfüllt sind. Dadurch kann kein Kasten
     versehentlich verschwinden, dessen Warnung noch gilt. */
  const LAUNCH_BEDINGUNGEN = {
    // Geschäftsbezeichnung und steuerliche Angabe stehen fest
    firma: function () {
      return isFilled(cfg.BUSINESS_NAME) &&
             (isFilled(cfg.BUSINESS_VAT_ID) || isFilled(cfg.BUSINESS_TAX_NOTE));
    },
    // Das Kontaktformular versendet tatsächlich
    endpunkt: function () {
      return isFilled(cfg.CONTACT_FORM_ENDPOINT);
    }
  };

  function erfuellt(bedingungen) {
    return String(bedingungen || 'firma').split(/\s+/).every(function (name) {
      const pruefung = LAUNCH_BEDINGUNGEN[name];
      return pruefung ? pruefung() : true;
    });
  }

  function applyLaunchState() {
    const t = typeof I18N !== 'undefined' ? I18N.t.bind(I18N) : function (k) { return k; };

    // Geschäftsbezeichnung im Impressum
    const legalName = doc.querySelector('[data-site="legalname"]');
    if (legalName && isFilled(cfg.BUSINESS_NAME)) {
      legalName.textContent = cfg.BUSINESS_NAME;
      legalName.classList.remove('placeholder-value');
    }

    // Steuerliche Angabe im Impressum
    const vat = doc.getElementById('vat-line');
    if (vat) {
      if (isFilled(cfg.BUSINESS_VAT_ID)) {
        vat.textContent = '';
        vat.appendChild(el('span', null, t('vatLabel') + ' '));
        vat.appendChild(el('strong', null, cfg.BUSINESS_VAT_ID));
      } else if (isFilled(cfg.BUSINESS_TAX_NOTE)) {
        vat.textContent = cfg.BUSINESS_TAX_NOTE;
      }
      // Ohne beides bleibt der Platzhalter aus dem HTML stehen.
    }

    // Jeden Hinweiskasten einzeln gegen SEINE Bedingungen prüfen.
    doc.querySelectorAll('[data-todo-until-ready]').forEach(function (box) {
      if (erfuellt(box.getAttribute('data-todo-until-ready'))) box.remove();
    });
  }

  /* ======================================================================
     7. SOCIAL LINKS (nur konfigurierte)
     ====================================================================== */

  // Statische, im Code hinterlegte Pfade — keine Daten von außen.
  const SOCIAL_ICONS = {
    github: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z',
    linkedin: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9z',
    instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58zm8.4-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0z'
  };

  const SOCIAL_LABELS = { github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram' };

  function socialIcon(name) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = doc.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = doc.createElementNS(NS, 'path');
    path.setAttribute('d', SOCIAL_ICONS[name]);
    svg.appendChild(path);
    return svg;
  }

  function renderSocial() {
    const list = doc.getElementById('social-list');
    if (!list) return;
    list.textContent = '';

    const social = cfg.SOCIAL || {};
    Object.keys(SOCIAL_ICONS).forEach(function (name) {
      const url = social[name];
      if (!isFilled(url)) return;          // kein leeres Icon rendern

      const li = el('li');
      const a = el('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', SOCIAL_LABELS[name]);
      a.appendChild(socialIcon(name));
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ======================================================================
     8. PROJEKTKARTEN
     ====================================================================== */

  function pick(project, field) {
    // Englische Variante nutzen, falls vorhanden und EN aktiv ist.
    const lang = typeof I18N !== 'undefined' ? I18N.lang : 'de';
    const enField = project[field + '_en'];
    return (lang === 'en' && isFilled(enField)) ? enField : project[field];
  }

  function buildProjectCard(project) {
    const t = typeof I18N !== 'undefined' ? I18N.t.bind(I18N) : function (k) { return k; };

    const card = el('article', 'project-card');

    /* --- Bild --- */
    const media = el('div', 'project-media');
    const img = el('img');
    img.src = project.image;
    img.alt = '';                       // rein dekorativ: Titel steht daneben
    img.setAttribute('role', 'presentation');
    img.loading = 'lazy';
    img.decoding = 'async';
    if (project.imageWidth) img.width = project.imageWidth;
    if (project.imageHeight) img.height = project.imageHeight;
    media.appendChild(img);

    if (project.placeholder) {
      media.appendChild(el('span', 'project-badge', t('projectPending')));
    }
    card.appendChild(media);

    /* --- Text --- */
    const body = el('div', 'project-body');
    body.appendChild(el('p', 'project-category', pick(project, 'category')));

    const title = el('h3', 'project-title', pick(project, 'title'));
    body.appendChild(title);

    body.appendChild(el('p', 'project-desc', pick(project, 'description')));

    if (Array.isArray(project.tech) && project.tech.length) {
      const tags = el('ul', 'tag-list');
      project.tech.forEach(function (tech) { tags.appendChild(el('li', null, tech)); });
      body.appendChild(tags);
    }

    /* --- Aktionen --- */
    if (isFilled(project.url) || isFilled(project.detailUrl)) {
      const actions = el('div', 'project-actions');

      if (isFilled(project.url)) {
        const link = el('a', 'btn btn-primary btn-sm', t('projectView'));
        link.href = project.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        // Screenreader: Ziel eindeutig benennen.
        link.setAttribute(
          'aria-label',
          t('projectView') + ': ' + pick(project, 'title') + ' (' + t('projectOpensNew') + ')'
        );
        actions.appendChild(link);
      }

      if (isFilled(project.detailUrl)) {
        const detail = el('a', 'btn btn-ghost btn-sm', t('projectDetails'));
        detail.href = project.detailUrl;
        if (/^https?:\/\//i.test(project.detailUrl)) {
          detail.target = '_blank';
          detail.rel = 'noopener noreferrer';
        }
        actions.appendChild(detail);
      }
      body.appendChild(actions);
    } else {
      // Kein toter Button, wenn noch keine URL hinterlegt ist.
      body.appendChild(el('p', 'project-hint', t('projectPendingHint')));
    }

    card.appendChild(body);
    return card;
  }

  function renderProjects() {
    const grid = doc.getElementById('projects-grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    grid.textContent = '';
    const fragment = doc.createDocumentFragment();
    PROJECTS.forEach(function (project) { fragment.appendChild(buildProjectCard(project)); });
    grid.appendChild(fragment);
  }

  /* ======================================================================
     9. KONTAKTFORMULAR
     ----------------------------------------------------------------------
     Diese Validierung ist reine Bequemlichkeit für den Besucher.
     Sie ersetzt KEINE serverseitige Prüfung — siehe README, Abschnitt
     "Kontaktformular aktivieren".
     ====================================================================== */

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function initContactForm() {
    const form = doc.getElementById('contact-form');
    if (!form) return;

    const status = doc.getElementById('form-status');
    const submit = doc.getElementById('form-submit');
    const notice = doc.getElementById('form-demo-notice');
    const limits = cfg.FORM_LIMITS || {};
    const endpointSet = isFilled(cfg.CONTACT_FORM_ENDPOINT);

    /* --------------------------------------------------------------
       ENTWICKLERHINWEIS
       Ohne konfigurierten Endpunkt wird bewusst NICHTS versendet.
       Ein Versand direkt aus dem Browser über SMTP oder mit einem
       API-Schlüssel im Frontend wäre unsicher: alles in diesem
       Repository ist öffentlich lesbar.
       Endpunkt in js/config.js unter CONTACT_FORM_ENDPOINT eintragen.
       -------------------------------------------------------------- */
    if (!endpointSet) {
      if (notice) notice.hidden = false;
      // eslint-disable-next-line no-console
      console.info(
        '[Kontaktformular] Demo-Modus aktiv: CONTACT_FORM_ENDPOINT ist in ' +
        'js/config.js nicht gesetzt. Es werden keine Daten versendet.'
      );
    }

    const t = function (key) {
      return typeof I18N !== 'undefined' ? I18N.t(key) : key;
    };

    function setError(field, message) {
      const box = doc.getElementById('err-' + field.dataset.errKey);
      if (message) {
        field.setAttribute('aria-invalid', 'true');
        if (box) { box.textContent = message; box.hidden = false; }
      } else {
        field.removeAttribute('aria-invalid');
        if (box) { box.textContent = ''; box.hidden = true; }
      }
      return !message;
    }

    /* Feldzuordnung: Element -> Prüfregel -> Fehlerbox-Kürzel */
    const fields = {
      name:    doc.getElementById('f-name'),
      email:   doc.getElementById('f-email'),
      company: doc.getElementById('f-company'),
      topic:   doc.getElementById('f-topic'),
      website: doc.getElementById('f-website'),
      message: doc.getElementById('f-message'),
      privacy: doc.getElementById('f-privacy')
    };
    Object.keys(fields).forEach(function (key) {
      if (fields[key]) fields[key].dataset.errKey = key;
    });

    function validateField(key) {
      const field = fields[key];
      if (!field) return true;
      const value = field.type === 'checkbox' ? field.checked : field.value.trim();

      switch (key) {
        case 'name':
          if (!value || value.length < 2) return setError(field, t('errName'));
          if (value.length > (limits.name || 100)) return setError(field, t('errTooLong'));
          return setError(field, null);

        case 'email':
          if (!value) return setError(field, t('errRequired'));
          if (value.length > (limits.email || 150) || !EMAIL_RE.test(value)) {
            return setError(field, t('errEmail'));
          }
          return setError(field, null);

        case 'company':
          if (value.length > (limits.company || 120)) return setError(field, t('errTooLong'));
          return setError(field, null);

        case 'topic':
          if (!value) return setError(field, t('errTopic'));
          return setError(field, null);

        case 'website':
          if (!value) return setError(field, null);          // optional
          if (value.length > (limits.website || 200)) return setError(field, t('errTooLong'));
          try {
            const url = new URL(value);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              return setError(field, t('errUrl'));
            }
          } catch (e) {
            return setError(field, t('errUrl'));
          }
          return setError(field, null);

        case 'message':
          if (!value || value.length < 10) return setError(field, t('errMessage'));
          if (value.length > (limits.message || 2000)) return setError(field, t('errTooLong'));
          return setError(field, null);

        case 'privacy':
          if (!value) return setError(field, t('errPrivacy'));
          return setError(field, null);

        default:
          return true;
      }
    }

    // Erst prüfen, wenn das Feld verlassen wurde — nicht bei jedem Tastendruck.
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      if (!field) return;
      field.addEventListener('blur', function () { validateField(key); });
      field.addEventListener('change', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(key);
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(key);
      });
    });

    /* Zeichenzähler für die Projektbeschreibung */
    const counter = doc.getElementById('message-counter');
    if (counter && fields.message) {
      const max = limits.message || 2000;
      const updateCounter = function () {
        const len = fields.message.value.length;
        counter.textContent = len + ' / ' + max;
        counter.classList.toggle('is-near', len > max * 0.9);
      };
      fields.message.addEventListener('input', updateCounter);
      updateCounter();
    }

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message || '';
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const order = ['name', 'email', 'company', 'topic', 'website', 'message', 'privacy'];
      let firstInvalid = null;
      order.forEach(function (key) {
        if (!validateField(key) && !firstInvalid) firstInvalid = fields[key];
      });

      if (firstInvalid) {
        setStatus(t('errSummary'), 'error');
        firstInvalid.focus();
        return;
      }

      // Honeypot: ausgefüllt = mit hoher Wahrscheinlichkeit ein Bot.
      // Wir brechen still ab und geben dieselbe neutrale Rückmeldung.
      const honeypot = doc.getElementById('website-url');
      if (honeypot && honeypot.value !== '') {
        setStatus(t('statusOk'), 'ok');
        form.reset();
        return;
      }

      if (!endpointSet) {
        setStatus(t('statusDemo'), 'ok');
        return;
      }

      const payload = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        company: fields.company ? fields.company.value.trim() : '',
        topic: fields.topic.value,
        existing_website: fields.website ? fields.website.value.trim() : '',
        budget: (doc.getElementById('f-budget') || {}).value || '',
        message: fields.message.value.trim(),
        lang: typeof I18N !== 'undefined' ? I18N.lang : 'de'
      };

      const originalLabel = submit ? submit.textContent : '';
      if (submit) { submit.disabled = true; submit.textContent = t('sending'); }
      setStatus(t('statusSending'), null);

      fetch(cfg.CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          setStatus(t('statusOk'), 'ok');
          form.reset();
          if (counter) counter.textContent = '0 / ' + (limits.message || 2000);
        })
        .catch(function () {
          // Bewusst keine technischen Details für den Besucher.
          setStatus(t('statusFail'), 'error');
        })
        .then(function () {
          if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
        });
    });
  }

  /* ======================================================================
     10. START
     ====================================================================== */

  function init() {
    initTheme();
    initLanguage();      // muss vor dem Rendern laufen (Sprache steht dann fest)
    applyBusinessData();
    applyLaunchState();
    renderContactDetails();
    renderSocial();
    renderProjects();
    initMobileNav();
    initHeader();
    initScrollSpy();
    initProgressiveStyling();
    initBackgroundArt();
    initReveal();
    initContactForm();

    // Bei Sprachwechsel die dynamisch erzeugten Teile neu aufbauen.
    doc.addEventListener('langchange', function () {
      renderContactDetails();
      renderProjects();
      applyLaunchState();
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
