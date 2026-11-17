/* Zweisprachigkeit: Deutsch steht im HTML, Englisch in EN. */
const I18N = (function () {
  'use strict';

  const EN = {
    'meta.title': 'Saveroq Studio — Engineering & Operations',
    'meta.description': 'Saveroq Studio develops, operates and maintains the technical systems, data pipelines and digital products behind Saveroq.',
    'a11y.skip': 'Skip to content',
    'a11y.mainNav': 'Main navigation',
    'a11y.mobileNav': 'Mobile navigation',
    'a11y.footerNav': 'Footer navigation',
    'a11y.langGroup': 'Choose language',
    'a11y.theme': 'Switch colour scheme',
    'a11y.menu': 'Open menu',
    'a11y.focus': 'Technical focus areas',
    'a11y.productFacts': 'Saveroq features',
    'nav.saveroq': 'Saveroq',
    'nav.systems': 'Systems',
    'nav.projects': 'Projects',
    'nav.operations': 'Operations',
    'nav.contact': 'Contact',
    'hero.eyebrow': 'Engineering & Operations for Saveroq',
    'hero.title': 'The technical unit behind Saveroq.',
    'hero.sub': 'We develop and operate the infrastructure, data pipelines and digital products behind Saveroq — from structured product data to ongoing technical operations.',
    'hero.cta1': 'Go to Saveroq',
    'hero.cta2': 'Explore the technology',
    'hero.trust1': 'Software Engineering',
    'hero.trust2': 'Data Pipelines',
    'hero.trust3': 'Infrastructure',
    'hero.trust4': 'Operations',
    'saveroq.kicker': 'Main product',
    'saveroq.title': 'Saveroq makes product and price data comparable.',
    'saveroq.lead': 'Saveroq combines structured product data, merchant feeds, price histories and search into a transparent basis for decisions. The studio develops and operates the technical systems behind it.',
    'saveroq.cta': 'Open Saveroq',
    'saveroq.fact1.title': 'Product data',
    'saveroq.fact1.text': 'Structured attributes and reliable product matching',
    'saveroq.fact2.title': 'Merchant feeds',
    'saveroq.fact2.text': 'Import, validation and ongoing updates',
    'saveroq.fact3.title': 'Price history',
    'saveroq.fact3.text': 'Historical development instead of an isolated snapshot',
    'saveroq.fact4.title': 'Search readiness',
    'saveroq.fact4.text': 'Data for conventional search and AI-assisted discovery',
    'systems.kicker': 'Engineering',
    'systems.title': 'Systems behind the products',
    'systems.lead': 'The work spans data imports and backend logic through deployment and observability. These areas are parts of Saveroq’s own systems, not externally offered services.',
    'systems.software.tag': 'Build',
    'systems.software.title': 'Software Engineering',
    'systems.software.text': 'Web applications, APIs and backend components for Saveroq products.',
    'systems.data.tag': 'Data',
    'systems.data.title': 'Product Data & Pipelines',
    'systems.data.text': 'Importing, normalising, storing and updating structured product and price data.',
    'systems.infra.tag': 'Run',
    'systems.infra.title': 'Infrastructure',
    'systems.infra.text': 'Linux and Docker environments, domains, access paths and reproducible deployments.',
    'systems.ops.tag': 'Maintain',
    'systems.ops.title': 'Automation & Operations',
    'systems.ops.text': 'Automated processes, health checks, backups, monitoring and ongoing maintenance.',
    'projects.kicker': 'Products & internal projects',
    'projects.title': 'Own products, platforms and experiments',
    'projects.lead': 'A selection of systems we develop and operate ourselves. Each entry is clearly classified as an own product, platform project or experiment.',
    'operations.kicker': 'Operations',
    'operations.title': 'Built also means operated.',
    'operations.lead': 'Own products need reliable routines after the first deployment. Operations are therefore part of product work — with documented processes and without publishing internal infrastructure details.',
    'operations.monitor.title': 'Production Monitoring',
    'operations.monitor.text': 'Observe availability and service health.',
    'operations.feeds.title': 'Automated Feed Imports',
    'operations.feeds.text': 'Run data imports on schedule and make failures visible.',
    'operations.backups.title': 'Database Backups',
    'operations.backups.text': 'Maintain backups and recovery paths.',
    'operations.health.title': 'Health Checks',
    'operations.health.text': 'Check critical components automatically.',
    'operations.deploy.title': 'Deployment',
    'operations.deploy.text': 'Roll out and verify changes reproducibly.',
    'operations.security.title': 'Security Controls',
    'operations.security.text': 'Limit access, separate secrets and keep dependencies current.',
    'technology.kicker': 'Technology',
    'technology.title': 'Technologies used across Saveroq systems',
    'technology.lead': 'Tools are selected for the task. They support the products; they are not the product promise.',
    'technology.backend': 'Backend & Data',
    'technology.infrastructure': 'Infrastructure',
    'technology.delivery': 'Delivery & Operations',
    'about.kicker': 'About',
    'about.title': 'Development and operations in one place',
    'about.text': 'Saveroq Studio looks after development and technical operations for Saveroq products. The focus is on durable systems: processing data, developing features, keeping deployments reproducible and safeguarding ongoing operations.',
    'contact.kicker': 'Contact',
    'contact.title': 'Contact Saveroq',
    'contact.lead': 'Girly Boldt is the first point of contact for merchants, partnerships, technical notes or general questions.',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.company': 'Organisation',
    'form.optional': '(optional)',
    'form.topic': 'Subject',
    'form.topic.placeholder': 'Please select',
    'form.topic.o1': 'Merchant or product data',
    'form.topic.o2': 'Search / AI readiness',
    'form.topic.o3': 'Technical note',
    'form.topic.o4': 'Partnership',
    'form.topic.o5': 'General question',
    'form.website': 'Relevant URL',
    'form.message': 'Message',
    'form.message.hint': 'Please describe your enquiry briefly and clearly.',
    'form.privacy': 'I have read the privacy information about the processing of my details.',
    'form.privacyLink': 'Privacy information',
    'form.submit': 'Send message',
    'footer.desc': 'Engineering & Operations for Saveroq products.',
    'footer.navTitle': 'Navigation',
    'footer.contactTitle': 'Contact',
    'footer.legalTitle': 'Legal',
    'footer.imprint': 'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.appsPrivacy': 'Apps privacy',
    'legal.back': 'Back to the homepage',
    'imprint.title': 'Imprint',
    'imprint.meta': 'Imprint — Saveroq Studio',
    'imprint.intro': 'Legal information as required by section 5 of the German Digital Services Act (DDG).',
    'imprint.h1': 'Provider',
    'imprint.h2': 'Contact',
    'imprint.h5': 'Responsible for the content',
    'imprint.country': 'Germany',
    'imprint.email': 'Email:',
    'imprint.form': 'Contact form:',
    'imprint.formLink': 'Send a message',
    'imprint.person': 'Contact person:',
    'imprint.tradeName': 'Trading name:',
    'imprint.soleTrader': 'Sole proprietorship. There is no managing board in the sense of a limited company.',
    'imprint.contactCustomer': 'General enquiries',
    'imprint.contactLegal': 'Legal and formal enquiries',
    'privacy.title': 'Privacy notice',
    'privacy.meta': 'Privacy notice — Saveroq Studio',
    'privacy.intro': 'How personal data is handled on this website.',
    'privacy.h1': 'Controller',
    'privacy.controllerContact': 'For data protection enquiries and to exercise your rights, please contact:',
    'privacy.h2': 'Hosting',
    'privacy.hostingText': 'The website runs on our own server and is delivered through the Cloudflare content delivery network (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA). Cloudflare processes technical connection data including the IP address to deliver and protect the page. The legal basis is the legitimate interest in secure and efficient operation under Art. 6(1)(f) GDPR.',
    'privacy.h4': 'Contact form',
    'privacy.contactText': 'The contact form processes your name, email address, selected subject and message. Organisation and a relevant URL are processed only if you fill in these optional fields. The selected language version is also transmitted.',
    'privacy.contactPurpose': 'Processing serves solely to handle and answer your enquiry. The details are not used for advertising without a corresponding legal basis or consent. The legal basis is Art. 6(1)(b) GDPR for pre-contractual steps, otherwise Art. 6(1)(f) GDPR.',
    'privacy.contactTransport': 'Transmission is encrypted via HTTPS. The details are validated on our server and delivered through the SMTP relay of Brevo (Sendinblue GmbH) over an encrypted connection. They are not stored permanently in a database.',
    'privacy.contactIp': 'To protect against automated bulk requests, your IP address is held briefly in memory to limit the number of requests. It is not logged in clear text, only in a shortened form that cannot be traced back. The value is discarded once the time window has passed.',
    'privacy.contactRetention': 'Your enquiry is deleted as soon as storing it is no longer necessary to deal with it. This does not apply where statutory retention obligations exist or further storage is otherwise required.',
    'privacy.h5': 'Cookies and local storage',
    'privacy.storageText': 'This website sets no tracking or advertising cookies. Your chosen language and colour scheme are stored locally in your browser so the site remembers them. This data stays on your device and can be deleted in your browser settings.',
    'privacy.h6': 'External services',
    'privacy.externalText': 'No external fonts, analytics or advertising services are loaded. The page loads only its own files.',
    'privacy.h8': 'Linked projects',
    'privacy.linksText': 'The projects section links to external websites. Their operators are solely responsible for those sites and any data processing there. Nothing is requested until you actively click a link.',
    'privacy.h7': 'Your rights',
    'privacy.rightsText': 'You have the right to information, rectification, erasure, restriction of processing, data portability and objection, as well as the right to lodge a complaint with a supervisory authority. The competent authority is the Bavarian Data Protection Authority (BayLDA), Promenade 18, 91522 Ansbach, Germany.'
  };

  const UI = {
    de: {
      projectView: 'Projekt ansehen', projectDetails: 'Details',
      projectPending: 'Projekt folgt', projectPendingHint: 'Dieses Projekt wird in Kürze ergänzt.',
      projectOpensNew: 'öffnet in einem neuen Tab', labelEmail: 'E-Mail',
      labelPerson: 'Ansprechpartnerin', labelLegal: 'Recht & Datenschutz',
      vatHeading: 'Umsatzsteuer / Wirtschafts-Identifikationsnummer',
      vatLabel: 'Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:',
      economicIdLabel: 'Wirtschafts-Identifikationsnummer gemäß § 139c AO:',
      labelPhone: 'Telefon', labelLocation: 'Standort',
      contactViaForm: 'Alternativ über das Kontaktformular',
      menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
      errRequired: 'Bitte füllen Sie dieses Feld aus.',
      errName: 'Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).',
      errEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      errTopic: 'Bitte wählen Sie ein Anliegen aus.',
      errMessage: 'Bitte beschreiben Sie Ihr Anliegen (mindestens 10 Zeichen).',
      errUrl: 'Bitte geben Sie eine gültige Adresse an, z. B. https://beispiel.de',
      errPrivacy: 'Bitte bestätigen Sie die Kenntnisnahme der Datenschutzhinweise.',
      errTooLong: 'Der Text ist zu lang.', errSummary: 'Bitte prüfen Sie die markierten Felder.',
      statusSending: 'Wird gesendet …',
      statusOk: 'Vielen Dank. Ihre Nachricht ist eingegangen – wir melden uns.',
      statusFail: 'Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut.',
      statusRateLimited: 'Es wurden zu viele Nachrichten in kurzer Zeit gesendet. Bitte versuchen Sie es in einigen Minuten erneut.',
      statusUnavailable: 'Der Versand ist derzeit nicht möglich. Bitte schreiben Sie direkt per E-Mail.',
      statusNetwork: 'Die Verbindung wurde unterbrochen. Ihre Eingaben bleiben erhalten.',
      errServerField: 'Bitte prüfen Sie diese Angabe.', sending: 'Senden …'
    },
    en: {
      projectView: 'View project', projectDetails: 'Details',
      projectPending: 'Project pending', projectPendingHint: 'This project will be added shortly.',
      projectOpensNew: 'opens in a new tab', labelEmail: 'Email',
      labelPerson: 'Contact person', labelLegal: 'Legal & data protection',
      vatHeading: 'VAT / economic identification number',
      vatLabel: 'VAT identification number under section 27a of the German VAT Act:',
      economicIdLabel: 'Economic identification number pursuant to § 139c AO:',
      labelPhone: 'Phone', labelLocation: 'Location',
      contactViaForm: 'Alternatively use the contact form',
      menuOpen: 'Open menu', menuClose: 'Close menu',
      errRequired: 'Please fill this in.',
      errName: 'Please enter your name (at least 2 characters).',
      errEmail: 'Please enter a valid email address.',
      errTopic: 'Please choose a subject.',
      errMessage: 'Please describe your enquiry (at least 10 characters).',
      errUrl: 'Please enter a valid address, e.g. https://example.com',
      errPrivacy: 'Please confirm that you have read the privacy information.',
      errTooLong: 'This text is too long.', errSummary: 'Please check the highlighted fields.',
      statusSending: 'Sending …',
      statusOk: 'Thank you. Your message has arrived — we will be in touch.',
      statusFail: 'That did not work. Please try again later.',
      statusRateLimited: 'Too many messages in a short time. Please try again in a few minutes.',
      statusUnavailable: 'Sending is not possible right now. Please email us directly.',
      statusNetwork: 'The connection dropped. Your input has been kept.',
      errServerField: 'Please check this entry.', sending: 'Sending …'
    }
  };

  const SUPPORTED = ['de', 'en'];
  const STORAGE_KEY = 'site-lang';
  const originalText = new WeakMap();
  const originalAttr = new WeakMap();
  let current = 'de';

  function safeStorage(action, key, value) {
    try {
      if (action === 'get') return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* Storage may be unavailable. */ }
    return null;
  }

  function detect() {
    const stored = safeStorage('get', STORAGE_KEY);
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (let i = 0; i < langs.length; i++) {
      const base = String(langs[i]).toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(base) !== -1) return base;
    }
    const fallback = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.DEFAULT_LANG) || 'de';
    return SUPPORTED.indexOf(fallback) !== -1 ? fallback : 'de';
  }

  function applyTo(root, lang) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (element) {
      const key = element.getAttribute('data-i18n');
      if (!originalText.has(element)) originalText.set(element, element.textContent);
      if (lang === 'de') element.textContent = originalText.get(element);
      else if (Object.prototype.hasOwnProperty.call(EN, key)) element.textContent = EN[key];
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (element) {
      const pairs = element.getAttribute('data-i18n-attr').split(',');
      if (!originalAttr.has(element)) {
        const stored = {};
        pairs.forEach(function (pair) { const attr = pair.split(':')[0].trim(); stored[attr] = element.getAttribute(attr); });
        originalAttr.set(element, stored);
      }
      pairs.forEach(function (pair) {
        const parts = pair.split(':'); const attr = parts[0].trim(); const key = (parts[1] || '').trim();
        if (lang === 'de') {
          const value = originalAttr.get(element)[attr];
          if (value !== null && value !== undefined) element.setAttribute(attr, value);
        } else if (Object.prototype.hasOwnProperty.call(EN, key)) element.setAttribute(attr, EN[key]);
      });
    });
  }

  function apply(lang) {
    current = SUPPORTED.indexOf(lang) !== -1 ? lang : 'de';
    document.documentElement.setAttribute('lang', current);
    applyTo(document, current);
    const titleKey = document.body.getAttribute('data-title-key');
    const descKey = document.body.getAttribute('data-desc-key');
    if (titleKey) {
      if (!document.body.dataset.titleDe) document.body.dataset.titleDe = document.title;
      document.title = current === 'en' && EN[titleKey] ? EN[titleKey] : document.body.dataset.titleDe;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && descKey) {
      if (!metaDesc.dataset.de) metaDesc.dataset.de = metaDesc.getAttribute('content') || '';
      metaDesc.setAttribute('content', current === 'en' && EN[descKey] ? EN[descKey] : metaDesc.dataset.de);
    }
    document.querySelectorAll('.lang-btn').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.lang === current)); });
    safeStorage('set', STORAGE_KEY, current);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  return {
    detect: detect, apply: apply, applyTo: applyTo,
    get lang() { return current; },
    t: function (key) {
      const dict = UI[current] || UI.de;
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    }
  };
})();
