/* ==========================================================================
   i18n.js — Zweisprachigkeit (Deutsch / Englisch)
   --------------------------------------------------------------------------
   FUNKTIONSWEISE — bitte einmal lesen, bevor Texte geändert werden:

     * DEUTSCH steht direkt im HTML.
       Das ist die Standardsprache, sie funktioniert ohne JavaScript und
       wird von Suchmaschinen gelesen.
       -> Deutsche Texte werden IM HTML geändert, nicht hier.

     * ENGLISCH steht in dieser Datei (Objekt `EN` weiter unten).
       Beim Umschalten merkt sich das Skript den deutschen Originaltext und
       stellt ihn beim Zurückschalten wieder her.
       -> Englische Texte werden HIER geändert.

     * Der Schlüssel ist das `data-i18n`-Attribut im HTML.
       Beispiel:  <h3 data-i18n="services.web.title">Websites</h3>
                  EN['services.web.title'] = 'Websites'

     * Fehlt ein Schlüssel hier, bleibt einfach der deutsche Text stehen.
       Es gibt also keine leeren Stellen, wenn etwas vergessen wurde.

   Texte, die erst von JavaScript erzeugt werden (Projektkarten,
   Fehlermeldungen im Formular, Kontaktangaben), stehen im Objekt `UI`
   ganz unten — dort in BEIDEN Sprachen.
   ========================================================================== */

const I18N = (function () {
  'use strict';

  /* ======================================================================
     ENGLISCHE ÜBERSETZUNGEN
     ====================================================================== */
  const EN = {
    /* --- Seitenkopf / Metadaten --------------------------------------- */
    'meta.title': 'Saveroq Studio — websites & digital systems',
    'meta.description':
      'Saveroq Studio builds websites, small web applications and digital systems for small businesses — from a first landing page to APIs, databases, hosting, ongoing technical support and virtual assistance.',

    /* --- Barrierefreiheit --------------------------------------------- */
    'a11y.skip': 'Skip to content',
    'a11y.mainNav': 'Main navigation',
    'a11y.mobileNav': 'Mobile navigation',
    'a11y.footerNav': 'Footer navigation',
    'a11y.langGroup': 'Choose language',
    'a11y.theme': 'Switch colour scheme',
    'a11y.menu': 'Open menu',
    'a11y.trust': 'How we work',

    /* --- Navigation ---------------------------------------------------- */
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.support': 'Support',
    'nav.assist': 'Assistance',
    'nav.projects': 'Projects',
    'nav.process': 'Process',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',

    /* --- Hero ---------------------------------------------------------- */
    'hero.eyebrow': 'A small team. One direct contact.',
    'hero.title': 'Websites and digital solutions that actually work.',
    'hero.sub':
      'Websites, digital systems and ongoing support for small businesses — ' +
      'from a first landing page through web applications, APIs, databases ' +
      'and hosting to technical maintenance. If you want, we handle the ' +
      'office admin behind it too.',
    'hero.cta1': 'Request a project',
    'hero.cta2': 'See our work',
    'hero.trust1': 'Responsive by default',
    'hero.trust2': 'Optimised for performance',
    'hero.trust3': 'Individually developed',
    'hero.trust4': 'One direct contact',

    /* --- Leistungen ---------------------------------------------------- */
    'services.kicker': 'Services',
    'services.title': 'What we build',
    'services.lead':
      'Three areas that work together. What makes sense for you is something ' +
      'we clarify up front — not everything fits every project.',

    'services.web.title': 'Websites & landing pages',
    'services.web.text':
      'The core of our work: sites that load fast, work on every device and ' +
      'can still be maintained later on.',
    'services.web.i1': 'Custom company websites',
    'services.web.i2': 'Landing pages and product pages',
    'services.web.i3': 'Portfolios and project pages',
    'services.web.i4': 'Modernising existing websites',
    'services.web.i5': 'Embedding images, video and other media',
    'services.web.i6': 'Contact forms and newsletter integration',
    'services.web.i7': 'Maps and location integration',
    'services.web.i8': 'Linking social media profiles',
    'services.web.i9': 'Technical SEO fundamentals',
    'services.web.i10': 'Performance optimisation',
    'services.web.note':
      'Note: we lay the technical SEO groundwork. We do not run ongoing SEO ' +
      'or advertising campaigns.',

    'services.func.title': 'Web applications & custom functionality',
    'services.func.text':
      'When a plain website is not enough: smaller SaaS and web applications, ' +
      'plus functionality that fits your workflow rather than the other way ' +
      'round.',
    'services.func.i1': 'Login, account and sign-in areas',
    'services.func.i2': 'User management and roles',
    'services.func.i3': 'Smaller databases',
    'services.func.i4': 'Custom APIs',
    'services.func.i5': 'Connecting external APIs',
    'services.func.i6': 'Dashboards and reporting',
    'services.func.i7': 'Small internal tools',
    'services.func.i8': 'Forms and workflows',
    'services.func.i9': 'Data processing and automation',
    'services.func.note':
      'Scope and technical architecture are reviewed per project. Large ' +
      'enterprise systems are explicitly not part of this.',

    'services.ai.tag': 'Custom work',
    'services.ai.title': 'AI & automation',
    'services.ai.text':
      'AI-assisted support, built on your own FAQs, documentation or ' +
      'internal information.',
    'services.ai.i1': 'Chat assistant on your website',
    'services.ai.i2': 'FAQ assistant',
    'services.ai.i3': 'Pre-sorting incoming enquiries',
    'services.ai.i4': 'Internal knowledge assistants',
    'services.ai.i5': 'AI integrations via APIs',
    'services.ai.note':
      'We always quote these individually — depending on data volume, ' +
      'requirements, model and API costs, and infrastructure. An assistant ' +
      'supports your support team; it does not replace it.',

    /* --- Wartung & Support --------------------------------------------- */
    'support.kicker': 'Maintenance & technical support',
    'support.title': 'Ongoing support with a clear scope',
    'support.lead':
      'Someone stays reachable after handover. We define scope and ' +
      'responsibilities in writing beforehand, so it is clear what we cover ' +
      'and what we do not.',

    'support.site.title': 'Website maintenance',
    'support.site.i1': 'Updating text and images',
    'support.site.i2': 'Smaller design changes',
    'support.site.i3': 'Adding new content',
    'support.site.i4': 'Technical updates',
    'support.site.i5': 'Fixing errors',

    'support.acc.title': 'Account & system upkeep',
    'support.acc.i1': 'Creating and maintaining user accounts',
    'support.acc.i2': 'Adjusting permissions',
    'support.acc.i3': 'Smaller administrative tasks',
    'support.acc.i4': 'Technical configuration',

    'support.db.title': 'Database maintenance',
    'support.db.i1': 'Smaller database work',
    'support.db.i2': 'Setting up and checking backups',
    'support.db.i3': 'Data clean-up',
    'support.db.i4': 'Simple migrations',
    'support.db.i5': 'Monitoring',

    'support.srv.title': 'Server maintenance',
    'support.srv.i1': 'Basic Linux server maintenance',
    'support.srv.i2': 'Applying updates',
    'support.srv.i3': 'Setting up hosting, supporting deployment',
    'support.srv.i4': 'Service checks, backups, basic monitoring',
    'support.srv.i5': 'Smaller Docker environments',
    'support.srv.note':
      'We do not offer round-the-clock managed hosting. Response times are ' +
      'agreed individually.',

    'support.mail.title': 'Email & DNS',
    'support.mail.i1': 'Setting up business email',
    'support.mail.i2': 'DNS configuration',
    'support.mail.i3': 'Forwarding and mailboxes',
    'support.mail.i4': 'Support with SPF, DKIM and DMARC',
    'support.mail.i5': 'Technical troubleshooting',

    'support.social.title': 'Social media support',
    'support.social.i1': 'Technical setup and linking',
    'support.social.i2': 'Embedding content on the website',
    'support.social.i3': 'Profile and link structure',
    'support.social.i4': 'Publishing prepared content',
    'support.social.i5': 'Smaller help with content',
    'support.social.note':
      'This is technical support, not marketing management. We do not ' +
      'promise reach or growth figures.',

    /* --- Virtuelle Assistenz -------------------------------------------- */
    'assist.kicker': 'Virtual assistance',
    'assist.title': 'The office work that piles up',
    'assist.lead':
      'Recurring admin takes time but rarely justifies hiring someone. That is ' +
      'what this area is for — looked after by Girly Boldt.',

    'assist.comm.title': 'Correspondence & scheduling',
    'assist.comm.i1': 'Reviewing and pre-sorting the inbox',
    'assist.comm.i2': 'Answering recurring enquiries',
    'assist.comm.i3': 'Arranging appointments, keeping the calendar current',
    'assist.comm.i4': 'Following up on open items',
    'assist.comm.i5': 'Pre-qualifying enquiries and passing them on',

    'assist.data.title': 'Data & documents',
    'assist.data.i1': 'Entering and maintaining data',
    'assist.data.i2': 'Keeping lists and spreadsheets up to date',
    'assist.data.i3': 'Preparing documents and templates',
    'assist.data.i4': 'Sorting and filing receipts',
    'assist.data.i5': 'Research on clearly defined questions',

    'assist.flow.title': 'Routines & ongoing tasks',
    'assist.flow.i1': 'Taking over recurring tasks',
    'assist.flow.i2': 'Coordinating orders and appointments',
    'assist.flow.i3': 'Preparing and publishing content',
    'assist.flow.i4': 'Putting together simple reports',
    'assist.flow.i5': 'Structuring handovers and filing',

    'assist.note':
      'Scope, access rights and confidentiality are agreed in writing ' +
      'beforehand. Bookkeeping, tax and legal advice are explicitly not ' +
      'included — those require the relevant licence.',

    /* --- Projekte ------------------------------------------------------ */
    'projects.kicker': 'Projects',
    'projects.title': 'Selected work',
    'projects.lead':
      'A small selection rather than a long list. The third entry is not a ' +
      'client project — it evidences the technical grounding behind the work.',

    /* --- Ablauf -------------------------------------------------------- */
    'process.kicker': 'Process',
    'process.title': 'Four steps to a result',
    'process.s1.title': 'Enquiry',
    'process.s1.text':
      'You describe your plans in a few bullet points. No obligation.',
    'process.s2.title': 'Clarification',
    'process.s2.text':
      'We work out the scope, the technical requirements and any open questions.',
    'process.s3.title': 'Quote & build',
    'process.s3.text':
      'Once the scope is clear you receive a quote. Then we build it.',
    'process.s4.title': 'Handover & support',
    'process.s4.text':
      'We hand the project over on completion. Ongoing support is optional.',

    /* --- Kalkulation --------------------------------------------------- */
    'pricing.kicker': 'Pricing',
    'pricing.title': 'Individual project quotes',
    'pricing.text':
      'Every project has different requirements, so we quote by scope, ' +
      'functionality and technical effort. Enquiries are free and ' +
      'non-binding.',
    'pricing.cta1': 'Describe your project',
    'pricing.cta2': 'Send a short enquiry',
    'pricing.note': 'The second option suits smaller maintenance or change requests.',
    'pricing.needTitle': 'Helpful for a quote',
    'pricing.n1': 'Type of project',
    'pricing.n2': 'Functionality you need',
    'pricing.n3': 'Existing website, if there is one',
    'pricing.n4': 'Rough scope',
    'pricing.n5': 'Any special requirements',
    'pricing.n6': 'Preferred timeframe',

    /* --- Kontakt ------------------------------------------------------- */
    'contact.kicker': 'Contact',
    'contact.title': 'Tell us briefly about your project',
    'contact.text':
      'A few bullet points are enough to start. We will come back with ' +
      'questions or a first assessment.',

    /* --- Formular ------------------------------------------------------ */
    'form.name': 'Name',
    'form.email': 'Email',
    'form.company': 'Company',
    'form.optional': '(optional)',
    'form.topic': 'What do you need?',
    'form.topic.placeholder': 'Please choose',
    'form.topic.o1': 'A new website',
    'form.topic.o2': 'Rework an existing website',
    'form.topic.o3': 'Custom web functionality',
    'form.topic.o4': 'Database / API',
    'form.topic.o5': 'AI customer support',
    'form.topic.o6': 'Website maintenance',
    'form.topic.o7': 'Server / technical support',
    'form.topic.o8': 'Email / DNS',
    'form.topic.o9': 'Social media support',
    'form.topic.o11': 'Virtual assistance / office admin',
    'form.topic.o10': 'Something else',
    'form.website': 'Existing website',
    'form.budget': 'Budget range',
    'form.budget.o1': 'Not decided yet',
    'form.budget.o2': 'Small project',
    'form.budget.o3': 'Medium project',
    'form.budget.o4': 'Larger custom project',
    'form.message': 'Project description',
    'form.message.hint': 'A few bullet points are enough for a first enquiry.',
    'form.privacy':
      'I have read the privacy notice and consent to my details being ' +
      'processed in order to handle my enquiry.',
    'form.privacyLink': 'Privacy notice',
    'form.submit': 'Send enquiry',

    /* --- Footer -------------------------------------------------------- */
    'footer.desc':
      'Websites, digital systems and ongoing support for small businesses.',
    'footer.navTitle': 'Navigation',
    'footer.contactTitle': 'Contact',
    'footer.legalTitle': 'Legal',
    'footer.imprint': 'Imprint',
    'footer.privacy': 'Privacy',

    /* --- Rechtliche Seiten --------------------------------------------- */
    'legal.back': 'Back to the homepage',

    'imprint.title': 'Imprint',
    'imprint.meta': 'Imprint — Saveroq Studio',
    'imprint.intro':
      'Legal information as required by section 5 of the German Digital ' +
      'Services Act (DDG).',
    'imprint.todo':
      'Two details are still missing, both tied to the business registration: ' +
      'the final trading name and the tax or VAT identification number. The ' +
      'wording should be checked by a qualified professional before the site ' +
      'is used commercially.',
    'imprint.h1': 'Provider',
    'imprint.h2': 'Contact',
    'imprint.h3': 'VAT / economic identification number',
    'imprint.h5': 'Responsible for the content',
    'imprint.h6': 'Dispute resolution',
    'imprint.country': 'Germany',
    'imprint.email': 'Email:',
    'imprint.form': 'Contact form:',
    'imprint.formLink': 'Send an enquiry',
    'imprint.person': 'Contact person:',
    'imprint.vatNote':
      'This section is only completed where a VAT identification number under ' +
      'section 27a of the German VAT Act or an economic identification number ' +
      'exists.',
    'imprint.contentNote':
      'This detail is only required where journalistic or editorial content ' +
      'within the meaning of section 18(2) MStV is offered.',
    'imprint.disputeText':
      'The European Commission provides a platform for online dispute ' +
      'resolution. We are neither obliged nor willing to take part in dispute ' +
      'resolution proceedings before a consumer arbitration board.',

    'privacy.title': 'Privacy notice',
    'privacy.meta': 'Privacy notice — Saveroq Studio',
    'privacy.intro': 'How personal data is handled on this website.',
    'privacy.todo':
      'The controller is filled in. Still open are the contact form details, ' +
      'which depend on the submission endpoint, and the final hosting ' +
      'location. The whole text should be reviewed by a qualified ' +
      'professional before the site is used commercially.',
    'privacy.h1': 'Controller',
    'privacy.h2': 'Hosting',
    'privacy.hostingText':
      'This website is served via GitHub Pages, a service of GitHub, Inc. ' +
      '(88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). When you ' +
      'visit, the provider processes technical connection data including your ' +
      'IP address in order to deliver the page at all. The legal basis is the ' +
      'legitimate interest in secure and efficient operation under Art. 6(1)(f) ' +
      'GDPR.',
    'privacy.hostingTodo':
      'If hosting moves to another provider, this statement has to be replaced. ' +
      'GitHub gives no commitment on server log retention that we can verify; ' +
      'this has to be clarified before commercial use.',
    'privacy.h4': 'Contact form',
    'privacy.contactText':
      'The contact form processes the following details: name, email ' +
      'address, the selected topic, your message and — if you fill them in — ' +
      'company, existing website and budget range. The chosen language ' +
      'version is transmitted as well.',
    'privacy.contactPurpose':
      'The sole purpose is handling and answering your enquiry. The details ' +
      'are not used for advertising and not passed to third parties for ' +
      'advertising purposes. The legal basis is Art. 6(1)(b) GDPR for ' +
      'pre-contractual steps, otherwise Art. 6(1)(f) GDPR.',
    'privacy.contactTransport':
      'Transmission is encrypted via HTTPS. The details are validated on our ' +
      'server and then delivered to our mailbox by email over an encrypted ' +
      'SMTP connection. They are not stored permanently in a database.',
    'privacy.contactIp':
      'To protect against automated bulk requests, your IP address is held ' +
      'briefly in memory to limit the number of requests. It is not logged ' +
      'in clear text, only in a shortened form that cannot be traced back. ' +
      'The value is discarded once the time window has passed.',
    'privacy.contactRetention':
      'Your enquiry stays in our mailbox until it has been dealt with and no ' +
      'statutory retention obligations remain. It is then deleted.',
    'privacy.contactTodo':
      'A concrete retention period is deliberately not stated here. It ' +
      'depends on whether the enquiry becomes a business transaction and ' +
      'commercial or tax retention obligations therefore apply. This has to ' +
      'be decided and entered before commercial operation.',
    'privacy.h5': 'Cookies and local storage',
    'privacy.storageText':
      'This website sets no tracking or advertising cookies. Your chosen ' +
      'language and colour scheme are stored locally in your browser ' +
      '(localStorage) so the site remembers them on your next visit. This data ' +
      'stays on your device and is not transmitted. You can delete it at any ' +
      'time through your browser settings.',
    'privacy.h6': 'External services',
    'privacy.externalText':
      'No external fonts, analytics or advertising services are loaded. The ' +
      'page loads only its own files. If that changes, each service has to be ' +
      'listed here.',
    'privacy.h8': 'Linked projects',
    'privacy.linksText':
      'The projects section links to external websites. Their operators are ' +
      'solely responsible for those sites and any data processing there. ' +
      'Nothing is requested until you actively click a link — no content from ' +
      'those sites is preloaded.',
    'privacy.h7': 'Your rights',
    'privacy.rightsText':
      'You have the right to information, rectification, erasure, restriction ' +
      'of processing, data portability and objection, as well as the right to ' +
      'lodge a complaint with a supervisory authority. The competent authority ' +
      'for us is the Bavarian Data Protection Authority (BayLDA), Promenade 18, ' +
      '91522 Ansbach, Germany.'
  };

  /* ======================================================================
     TEXTE, DIE JAVASCRIPT ERZEUGT — hier in BEIDEN Sprachen
     ====================================================================== */
  const UI = {
    de: {
      projectView:        'Projekt ansehen',
      projectDetails:     'Details',
      projectPending:     'Projekt wird ergänzt',
      projectPendingHint: 'Dieses Projekt wird in Kürze ergänzt.',
      projectOpensNew:    'öffnet in neuem Tab',
      labelEmail:         'E-Mail',
      labelPerson:        'Ansprechpartnerin',
      vatLabel:           'Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:',
      labelPhone:         'Telefon',
      labelLocation:      'Standort',
      contactViaForm:     'Am schnellsten über das Formular',
      menuOpen:           'Menü öffnen',
      menuClose:          'Menü schließen',
      errRequired:        'Bitte ausfüllen.',
      errName:            'Bitte geben Sie Ihren Namen an (mindestens 2 Zeichen).',
      errEmail:           'Bitte geben Sie eine gültige E-Mail-Adresse an.',
      errTopic:           'Bitte wählen Sie einen Punkt aus.',
      errMessage:         'Bitte beschreiben Sie Ihr Anliegen (mindestens 10 Zeichen).',
      errUrl:             'Bitte geben Sie eine gültige Adresse an, z. B. https://beispiel.de',
      errPrivacy:         'Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.',
      errTooLong:         'Der Text ist zu lang.',
      errSummary:         'Bitte prüfen Sie die markierten Felder.',
      statusSending:      'Wird gesendet …',
      statusOk:           'Vielen Dank. Ihre Anfrage ist eingegangen – wir melden uns.',
      statusFail:         'Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut.',
      statusRateLimited:  'Es wurden zu viele Anfragen in kurzer Zeit gesendet. Bitte versuchen Sie es in einigen Minuten erneut.',
      statusUnavailable:  'Der Versand ist derzeit nicht möglich. Bitte schreiben Sie uns in der Zwischenzeit direkt per E-Mail.',
      statusNetwork:      'Die Verbindung ist unterbrochen. Ihre Eingaben bleiben erhalten — bitte erneut senden.',
      errServerField:     'Bitte prüfen Sie diese Angabe.',
      sending:            'Senden …'
    },
    en: {
      projectView:        'View project',
      projectDetails:     'Details',
      projectPending:     'Project pending',
      projectPendingHint: 'This project will be added shortly.',
      projectOpensNew:    'opens in a new tab',
      labelEmail:         'Email',
      labelPerson:        'Contact person',
      vatLabel:           'VAT identification number under section 27a of the German VAT Act:',
      labelPhone:         'Phone',
      labelLocation:      'Location',
      contactViaForm:     'The form is the quickest way to reach us',
      menuOpen:           'Open menu',
      menuClose:          'Close menu',
      errRequired:        'Please fill this in.',
      errName:            'Please enter your name (at least 2 characters).',
      errEmail:           'Please enter a valid email address.',
      errTopic:           'Please choose an option.',
      errMessage:         'Please describe your enquiry (at least 10 characters).',
      errUrl:             'Please enter a valid address, e.g. https://example.com',
      errPrivacy:         'Please consent to your details being processed.',
      errTooLong:         'This text is too long.',
      errSummary:         'Please check the highlighted fields.',
      statusSending:      'Sending …',
      statusOk:           'Thank you. Your enquiry has arrived — we will be in touch.',
      statusFail:         'That did not work. Please try again later.',
      statusRateLimited:  'Too many requests in a short time. Please try again in a few minutes.',
      statusUnavailable:  'Sending is not possible right now. Please email us directly in the meantime.',
      statusNetwork:      'The connection dropped. Your input has been kept — please send again.',
      errServerField:     'Please check this entry.',
      sending:            'Sending …'
    }
  };

  /* ======================================================================
     LOGIK — ab hier ist normalerweise nichts anzupassen.
     ====================================================================== */

  const SUPPORTED = ['de', 'en'];
  const STORAGE_KEY = 'site-lang';

  // Merkt sich die deutschen Originaltexte, damit sie beim Zurückschalten
  // exakt wiederhergestellt werden können.
  const originalText = new WeakMap();
  const originalAttr = new WeakMap();

  let current = 'de';

  function safeStorage(action, key, value) {
    // localStorage kann blockiert sein (Privatmodus, strenge Einstellungen).
    try {
      if (action === 'get') return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* bewusst ignoriert */ }
    return null;
  }

  function detect() {
    const stored = safeStorage('get', STORAGE_KEY);
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;

    const langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ''];

    for (let i = 0; i < langs.length; i++) {
      const base = String(langs[i]).toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(base) !== -1) return base;
    }
    const fallback = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.DEFAULT_LANG) || 'de';
    return SUPPORTED.indexOf(fallback) !== -1 ? fallback : 'de';
  }

  function applyTo(root, lang) {
    const scope = root || document;

    // 1. Textinhalte
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (!originalText.has(el)) originalText.set(el, el.textContent);

      if (lang === 'de') {
        el.textContent = originalText.get(el);
      } else if (Object.prototype.hasOwnProperty.call(EN, key)) {
        // textContent statt innerHTML: kein HTML aus Daten, kein XSS-Risiko.
        el.textContent = EN[key];
      }
    });

    // 2. Attribute, Format:  data-i18n-attr="aria-label:a11y.menu,title:foo.bar"
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      const pairs = el.getAttribute('data-i18n-attr').split(',');

      if (!originalAttr.has(el)) {
        const store = {};
        pairs.forEach(function (pair) {
          const attr = pair.split(':')[0].trim();
          store[attr] = el.getAttribute(attr);
        });
        originalAttr.set(el, store);
      }

      pairs.forEach(function (pair) {
        const parts = pair.split(':');
        const attr = parts[0].trim();
        const key = (parts[1] || '').trim();
        if (lang === 'de') {
          const orig = originalAttr.get(el)[attr];
          if (orig !== null && orig !== undefined) el.setAttribute(attr, orig);
        } else if (Object.prototype.hasOwnProperty.call(EN, key)) {
          el.setAttribute(attr, EN[key]);
        }
      });
    });
  }

  function apply(lang) {
    current = SUPPORTED.indexOf(lang) !== -1 ? lang : 'de';

    document.documentElement.setAttribute('lang', current);
    applyTo(document, current);

    // Titel und Meta-Description mitziehen (Schlüssel liegen auf <body>).
    const titleKey = document.body.getAttribute('data-title-key');
    const descKey = document.body.getAttribute('data-desc-key');

    if (titleKey) {
      if (!document.body.dataset.titleDe) document.body.dataset.titleDe = document.title;
      document.title = (current === 'en' && EN[titleKey])
        ? EN[titleKey]
        : document.body.dataset.titleDe;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && descKey) {
      if (!metaDesc.dataset.de) metaDesc.dataset.de = metaDesc.getAttribute('content') || '';
      metaDesc.setAttribute(
        'content',
        current === 'en' && EN[descKey] ? EN[descKey] : metaDesc.dataset.de
      );
    }

    // Umschalter-Zustand
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === current));
    });

    safeStorage('set', STORAGE_KEY, current);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  return {
    detect: detect,
    apply: apply,
    applyTo: applyTo,
    get lang() { return current; },
    // Übersetzung für JS-generierte Texte
    t: function (key) {
      const dict = UI[current] || UI.de;
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    }
  };
})();
