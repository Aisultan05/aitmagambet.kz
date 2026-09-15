import type { Content } from './types'

export const en: Content = {
  meta: {
    title: 'Aisultan Aitmagambetuly — Fullstack Web Developer, PHP & Vue',
    description:
      'Fullstack developer based in Astana. PHP, Laravel, 1C-Bitrix, Vue 3, TypeScript. Production projects, SEO, CI/CD. MSc student in Information Security, research on automated vulnerability discovery in CMS.',
    lang: 'en',
  },

  nav: {
    items: [
      { id: 'about', label: 'About' },
      { id: 'stack', label: 'Stack' },
      { id: 'experience', label: 'Experience' },
      { id: 'projects', label: 'Projects' },
      { id: 'accessibility', label: 'Accessibility' },
      { id: 'research', label: 'Security' },
      { id: 'clients', label: 'Clients' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact' },
    ],
    cta: 'Get in touch',
  },

  hero: {
    eyebrow: 'Astana, Kazakhstan · UTC+5',
    issue: 'No. 01 · 2026 edition',
    name: 'Aisultan Aitmagambetuly',
    roles: [
      'Fullstack Web Developer',
      'PHP · Laravel · 1C-Bitrix',
      'Vue 3 · TypeScript',
      'CI/CD & production deploys',
      'AppSec code review',
    ],
    lead: 'I build websites that survive production.',
    tagline:
      'Almost two years owning web projects end to end: structure and markup, server-side logic, SEO and automated deployment. Currently building svoydom.kz, a real-estate marketplace. In parallel — an MSc in Information Security and research on automated vulnerability discovery in CMS.',
    ctaPrimary: 'Start a conversation',
    ctaSecondary: 'See the work',
    metrics: [
      { value: '1 yr 10 mo', label: 'commercial experience', hint: 'as of September 2026' },
      { value: '1,250+', label: 'listings in one catalog', hint: 'svoydom.kz, faceted filter' },
      { value: '13', label: 'state-owned clients', hint: 'websites and user portals' },
      { value: '5', label: 'CMS platforms in production', hint: 'Bitrix, WordPress, October, MODX, Joomla' },
    ],
    availability: 'Open to offers — on-site, hybrid or remote',
  },

  about: {
    kicker: 'About',
    heading: 'I take over someone else’s system and get it working',
    paragraphs: [
      'I am a fullstack developer from Astana. I work with PHP (Laravel, 1C-Bitrix) and Vue 3 + TypeScript, and I own production deploys and CI/CD.',
      'What interests me is not writing code from a blank file — it is digging into an existing system and getting it into working shape, then making sure a release stops being a manual operation.',
      'Security is a separate track: I am doing an MSc in Information Security at ENU, run AppSec code reviews at work, and research automated vulnerability discovery in CMS.',
    ],
    facts: [
      { label: 'Based in', value: 'Astana, Kazakhstan' },
      { label: 'Timezone', value: 'UTC+5' },
      { label: 'Format', value: 'On-site · hybrid · remote' },
      { label: 'Outside Astana', value: 'Remote only' },
      { label: 'Languages', value: 'Kazakh · Russian · English' },
      { label: 'Studying', value: 'MSc InfoSec, ENU' },
    ],
    marginTitle: 'In the margin',
    marginNote:
      'The CV is on hh.ru, the code is on GitHub. This page carries what a CV cannot: how I actually take a system apart.',
  },

  stack: {
    kicker: 'Stack',
    heading: 'Technologies, rated honestly',
    intro:
      'Giving everything the same five stars tells you nothing. Three groups instead: what I touch in production every day, what I use less often, and the tooling around development.',
    groups: [
      {
        id: 'daily',
        title: 'In production every day',
        note: 'My main tools — I own the outcome end to end',
        items: [
          'PHP 8, OOP',
          '1C-Bitrix: components, infoblocks, modules',
          'Bitrix D7, event handlers',
          'Multisite, core updates',
          'Laravel',
          'Vue 3 (Composition API)',
          'Vuex',
          'TypeScript',
          'JavaScript ES6+',
          'HTML5 · CSS3 · SCSS',
          'Flexbox · Grid · BEM',
          'MySQL',
          'Git · GitLab CI/CD',
          'Automated deployment',
          'REST API · webhooks',
          'System-to-system integrations',
          'Responsive & cross-browser markup',
          'Accessibility (a11y)',
        ],
      },
      {
        id: 'confident',
        title: 'Confident, but less often',
        note: 'Used on real client work, not side projects',
        items: [
          'WordPress: themes, plugins, optimisation',
          'WooCommerce',
          'jQuery (legacy and inside Bitrix)',
          'Twig · Blade',
          'Bootstrap',
          'Docker',
          'Node.js',
          'October CMS',
          'MODX',
          'Joomla',
          'PostgreSQL',
          'React (basics)',
        ],
      },
      {
        id: 'tools',
        title: 'Tooling & infrastructure',
        note: 'Around the code: design files, deployment, server',
        items: [
          'Figma (build from designs)',
          'Ansible (pull-deploy)',
          'nginx: configs, SSL, multisite',
          'GitLab Runner',
          'Deployment webhooks',
          'Debugging with restricted SSH access',
        ],
      },
    ],
    honesty: {
      title: 'What I do not claim',
      text: 'No commercial experience with these — so I do not list them as skills. If a project needs one, I will tell you straight how long ramp-up takes.',
      items: ['Symfony', 'Yii', 'Redis', 'RabbitMQ', 'ElasticSearch', 'Next.js', 'Python'],
    },
  },

  experience: {
    kicker: 'Experience',
    heading: 'Where I have worked and on what',
    total: 'Total commercial experience — 1 year 10 months',
    clientsNote: 'Worked on websites and user portals for:',
    expand: 'Expand',
    collapse: 'Collapse',
    now: 'now',
    colPeriod: 'Period',
    colPlace: 'Place and role',
    colWhat: 'What I did',
    jobs: [
      {
        company: 'Capital Network',
        role: 'Frontend Developer',
        period: 'February 2026 — present',
        location: 'Astana',
        current: true,
        summary: 'Systems integration and business-process automation.',
        highlight: 'Built the new svoydom.kz from scratch',
        bullets: [
          'Built the new svoydom.kz from scratch — markup, catalog filter, SEO system, multisite',
          'Maintain and extend bfmereke, ecp.kz, damumall.kz',
          'Production deploys, GitLab CI/CD, automated deployment via Ansible',
          'AppSec code review — reviewing code for vulnerabilities',
        ],
      },
      {
        company: 'KazInSys',
        role: 'Fullstack Developer',
        period: 'September 2025 — February 2026',
        location: 'Kazakhstan',
        summary:
          'Laravel + 1C-Bitrix development for government portals and the quasi-public sector.',
        highlight: 'Accessibility mode for a government portal',
        bullets: [
          'Low-vision accessibility mode for a government portal — the strongest case of this period',
          'Complex updatable page builder and navigation elements in PHP (Bitrix) and Vue',
          'Full rebuild of markup and functionality on key pages',
          'New components and features inside Bitrix CMS',
          'Improved registration, authentication and site search',
          'Cross-browser support, responsiveness, multilingual versions',
        ],
        clients: [
          'National Bank of Kazakhstan',
          'Baiterek National Managing Holding',
          'Kazakhstan Housing Company',
          'KazakhExport',
          'KAZAKH INVEST',
          'KEGOC',
          'Industrial Development Fund',
          'Qazaq Investment Corporation',
          'KazAgroFinance',
          'Agrarian Credit Corporation',
          'Astana Development Centre',
          'National Centre of Expertise',
          'Mediabase (KazTube)',
        ],
      },
      {
        company: 'BenchMark Consulting',
        role: 'Fullstack Developer',
        period: 'June 2025 — August 2025',
        location: 'Astana',
        site: 'bmconsult.kz',
        summary: 'Full cycle: from server-side logic to client interfaces.',
        highlight: 'Global navigation architecture for the in-house CMS “BMS Sales”',
        bullets: [
          'Delivered rgurpo.agartu.kz together with one other developer',
          'Designed and shipped the global navigation architecture for the in-house CMS “BMS Sales”',
          'Scaled the service on Vue.js',
          'WordPress work: theme customisation, plugin development, performance optimisation',
          'Refactoring and targeted improvements to existing systems',
        ],
      },
      {
        company: 'LegalEn',
        role: 'Fullstack Developer',
        period: 'March 2025 — June 2025',
        location: 'Astana',
        summary: 'A neural-network-based web app automating legal procedures.',
        bullets: [
          'Application user interface',
          'Interactivity and component states',
          'Responsive behaviour for mobile and tablet',
        ],
      },
      {
        company: 'Dmitry Pavlenko Web Studio',
        role: 'Frontend Developer',
        period: 'April 2025 — May 2025',
        location: 'Astana',
        site: 'pavlenko.kz',
        summary: 'Website for ELKE COMPANY — a multi-page project built from Figma designs.',
        bullets: [
          'Built a multi-page website from Figma designs (10+ pages)',
          'Responsive and cross-browser: desktop, tablet, mobile',
          'Carousels, gallery, SVG map, pop-ups, burger menu',
          'Animation and interaction: hover states, scroll reveals, smooth transitions',
          'Reusable header and footer templates',
          'Prepared the project for MODX CMS',
        ],
      },
      {
        company: 'ABC Design',
        role: 'Frontend Developer (internships)',
        period: 'June — August 2024 · March — May 2025',
        location: 'Astana',
        site: 'abc-design.kz',
        summary: 'October CMS, markup, database work, CMS setup and content population.',
        bullets: [
          'Markup and template integration in October CMS',
          'Database and content-structure work',
          'CMS setup and configuration for client needs',
          'Projects: snggroup.kz, acbgroup.kz, coffeestore.uz, hard.abcsup.kz',
        ],
      },
    ],
  },

  projects: {
    kicker: 'Projects',
    heading: 'Case studies, not task lists',
    intro:
      'The projects where the engineering shows: a filter over 1,250+ listings, SEO as an architecture problem, an accessibility mode for a government portal, and work inside a hand-rolled CRM.',
    all: 'All',
    open: 'Open case',
    close: 'Close',
    liveSite: 'Live site',
    moreTitle: 'Other cases',
    outcome: 'Outcome',
    before: 'Before',
    after: 'After',
    viewPhoto: 'Site',
    viewScheme: 'Scheme',
    items: [
      {
        id: 'svoydom',
        image: '/shots/svoydom.jpg',
        imageAlt: 'svoydom.kz home page: new-build catalog and developer offers',
        delta: {
          before: 'Bugs in production and not a single commit in history — there was no version control at all, releases were manual SSH uploads. The catalog filter gave search engines no pages.',
          after: 'A competitive product: a catalog of 1,250+ listings, every filter combination an indexable page, releases through GitLab CI instead of manual uploads.',
        },
        title: 'svoydom.kz',
        kicker: 'A “supermarket” for real estate',
        year: '2026',
        role: 'Fullstack · current version of the site is mine',
        featured: true,
        summary:
          'A marketplace for new-build housing in Astana and Almaty. I inherited the site as it was: bugs in production, no change history, manual uploads. I brought it to a competitive level and took releases off manual control.',
        metrics: [
          { value: '1,250+', label: 'listings in the catalog' },
          { value: 'GitLab CI', label: 'instead of SSH uploads' },
          { value: '2', label: 'sites on one core' },
        ],
        blocks: [
          {
            title: 'What I inherited',
            items: [
              'Bugs in production',
              'No version control — no change history and no way to roll back',
              'Releases uploaded to production by hand over SSH',
              'The catalog was closed to search engines',
            ],
          },
          {
            title: 'Frontend and catalog',
            items: [
              'Markup and project structure from scratch',
              'Wiring the frontend to 1C-Bitrix',
              'Apartment and complex catalog with a complex multi-parameter filter — over 1,250 listings',
              'Lead forms with CRM integration',
            ],
          },
          {
            title: 'SEO as an engineering problem',
            items: [
              'Canonical URLs for every filter combination',
              'Server-rendered meta tags on the Bitrix side',
              'Dynamic URL updates on the Vue side — without losing filter state',
              'Result: every filter combination became an indexable page. The site had no such traffic channel before',
            ],
          },
          {
            title: 'Multisite svd.kz',
            items: [
              'A second site on the same Bitrix core (s2 schema)',
              'Short links and REST API',
              'WhatsApp handler',
              'PDF module',
              'Form-to-CRM integration',
            ],
          },
          {
            title: 'Infrastructure and deployment',
            items: [
              'GitLab CI/CD with automated deployment — pull-deploy via Ansible and a webhook (with my colleague Vitaliy)',
              'Debugging nginx and SSL configuration for the multisite with restricted SSH access',
              'HTML block for the SvoyApp download page, compatible with Bitrix24',
              'Account-deletion page meeting App Store and Google Play requirements',
            ],
          },
          {
            title: 'Security',
            items: [
              'Security audit of the SvoyShop bonus system',
              'Findings handed to the team; technical details not published',
            ],
          },
        ],
        stack: ['1C-Bitrix', 'PHP 8', 'Vue 3', 'TypeScript', 'MySQL', 'GitLab CI/CD', 'Ansible', 'nginx'],
        links: [{ label: 'svoydom.kz', href: 'https://svoydom.kz' }],
        takeaway:
          'The project arrived without a single commit in its history. A release is now a push, and the filter stopped being a dead end for crawlers.',
      },
      {
        id: 'a11y',
        delta: {
          before: 'The portal had no low-vision version. Increasing the font size broke the layout of key pages.',
          after: 'The accessibility mode works in every language version, and the layout holds up to 140% font size.',
        },
        title: 'Accessibility mode',
        kicker: 'Low-vision version of a government portal · KazInSys',
        year: '2025—2026',
        role: 'Fullstack · owned the whole mode',
        summary:
          'A low-vision version of a government portal. One of those cases where code changes whether people can use a public service at all, rather than adding another feature to a backlog.',
        blocks: [
          {
            title: 'What the mode covered',
            items: [
              'Contrast themes and font scaling that do not break the layout',
              'Line-height and letter-spacing controls',
              'Turning off images and decorative animation',
              'Persisting the chosen settings across pages',
              'Keyboard operation and a correct focus order',
            ],
          },
          {
            title: 'The engineering difficulty',
            items: [
              'The mode had to fit an existing portal, not a greenfield project',
              'Key pages were rebuilt so they hold up under increased font size',
              'The portal has multilingual versions — the mode works in all of them',
            ],
          },
        ],
        stack: ['1C-Bitrix', 'PHP', 'Vue', 'SCSS', 'a11y', 'ARIA'],
        takeaway:
          'This site has an accessibility mode too — the button in the header. What I built for a government portal, I keep on my own site.',
      },
      {
        id: 'bms',
        delta: {
          before: 'Navigation was declared separately in each module; adding a section meant touching several places.',
          after: 'One menu structure, read by both the server and the Vue client.',
        },
        title: 'BMS Sales',
        kicker: 'In-house CRM · BenchMark Consulting',
        year: '2025',
        role: 'Fullstack · navigation architecture',
        summary:
          'A hand-rolled CRM with no off-the-shelf parts. I designed and shipped the global navigation architecture, extended functionality and scaled the service on Vue.js.',
        blocks: [
          {
            title: 'What I did',
            items: [
              'Designed the global navigation architecture — one structure instead of scattered menus',
              'Shipped it into the existing codebase without downtime',
              'Scaled the client side on Vue.js',
              'Extended functionality against business requirements',
            ],
          },
          {
            title: 'Why this experience matters',
            items: [
              'Working inside a hand-rolled system rather than a boxed CMS',
              'No ready answers in documentation — only reading the code',
              'Decisions had to be ones the next developer could maintain',
            ],
          },
        ],
        stack: ['PHP', 'Vue.js', 'MySQL', 'legacy code'],
        takeaway: 'Reading someone else’s code mattered more here than writing my own.',
      },
      {
        id: 'ecp',
        image: '/shots/ecp.jpg',
        imageAlt: 'ecp.kz home page: news and analytics sections',
        delta: {
          before: 'There were no news or analytics sections, and documents had to be downloaded as files.',
          after: 'Bilingual RU/EN sections and document previews rendered right in the browser.',
        },
        title: 'ecp.kz',
        kicker: 'News and analytics · October CMS',
        year: '2026',
        role: 'Fullstack · sections and integrations',
        summary:
          'News and Analytics sections with bilingual RU/EN content, RainLab.Blog integration, document previews rendered with PDF.js, and responsive header navigation.',
        blocks: [
          {
            title: 'What I did',
            items: [
              'News and Analytics sections with bilingual RU/EN content',
              'RainLab.Blog integration into the existing structure',
              'Document preview rendering via PDF.js',
              'Responsive header navigation',
            ],
          },
        ],
        stack: ['October CMS', 'PHP', 'Twig', 'PDF.js', 'SCSS'],
        links: [{ label: 'ecp.kz', href: 'https://ecp.kz' }],
      },
      {
        id: 'elke',
        image: '/shots/elke.jpg',
        imageAlt: 'elkecompany.kz home page: multi-page site built from Figma designs',
        delta: {
          before: 'A Figma design covering 10+ pages, with a requirement to ship on MODX.',
          after: 'Responsive cross-browser markup with reusable header and footer, ready for integration.',
        },
        title: 'ELKE COMPANY',
        kicker: 'Multi-page site from Figma · Pavlenko Studio',
        year: '2025',
        role: 'Frontend · markup and interaction',
        summary:
          'A 10+ page site built from Figma designs: full responsiveness, cross-browser support and interactive elements, prepared for MODX CMS.',
        blocks: [
          {
            title: 'What I did',
            items: [
              'Built 10+ pages from Figma designs',
              'Responsive for desktop, tablet, mobile, plus cross-browser support',
              'Carousels, gallery, interactive SVG map, pop-ups, burger menu',
              'Animation: hover states, scroll reveals, smooth transitions',
              'Reusable header and footer templates',
              'Structure prepared for MODX integration',
            ],
          },
        ],
        stack: ['HTML5', 'SCSS', 'JavaScript', 'SVG', 'Figma', 'MODX'],
        links: [{ label: 'elkecompany.kz', href: 'https://elkecompany.kz' }],
      },
      {
        id: 'rgurpo',
        image: '/shots/rgurpo.jpg',
        imageAlt: 'rgurpo.agartu.kz home page',
        delta: {
          before: 'The project had to be delivered by two developers, with no tech lead over the task.',
          after: 'Server logic and client split along a data contract — the two areas of ownership never collided.',
        },
        title: 'rgurpo.agartu.kz',
        kicker: 'Full cycle, two developers · BenchMark Consulting',
        year: '2025',
        role: 'Fullstack',
        summary:
          'Delivered by two developers: server-side logic and the client side were entirely on us.',
        blocks: [
          {
            title: 'What I did',
            items: [
              'Server-side logic and data handling',
              'Client side and markup',
              'Splitting ownership with a colleague, with no tech lead over the task',
            ],
          },
        ],
        stack: ['PHP', 'MySQL', 'JavaScript', 'SCSS'],
        links: [{ label: 'rgurpo.agartu.kz', href: 'https://rgurpo.agartu.kz' }],
      },
    ],
  },

  a11y: {
    kicker: 'Accessibility',
    heading: 'Accessibility mode — a real case of mine, not a checkbox',
    lead:
      'I built the low-vision version of a government portal. So this site has one too.',
    body: [
      'Accessibility usually arrives last: contrast picked by eye, focus lost, an increased font size breaking the grid. Fixing that on a live portal with multilingual versions is a distinct piece of engineering.',
      'The header button turns on a real mode: contrast, font size, spacing, animation and images. Settings persist between visits.',
    ],
    tryIt: 'Turn on accessibility mode',
    features: [
      { title: 'Contrast themes', text: 'Dark, light and high-contrast — without losing readability' },
      { title: 'Font scaling', text: 'Up to 140% — a rem-based layout holds together' },
      { title: 'Spacing', text: 'Line-height and letter-spacing — for dyslexia and low vision' },
      { title: 'No animation', text: 'Respects prefers-reduced-motion and a manual switch' },
      { title: 'No images', text: 'Text-only mode — faster and free of visual noise' },
      { title: 'Keyboard', text: 'Full Tab navigation, visible focus, skip link' },
    ],
    panelTitle: 'Accessibility settings',
    panelHint: 'Saved in this browser',
    controls: {
      contrast: 'Contrast',
      fontSize: 'Font size',
      spacing: 'Spacing',
      motion: 'Animation',
      images: 'Images',
      reset: 'Reset all',
      on: 'On',
      off: 'Off',
    },
  },

  research: {
    kicker: 'Security',
    heading: 'The second track — finding vulnerabilities in CMS',
    lead:
      'An MSc in Information Security, AppSec code review at work, and research on automated vulnerability discovery in CMS.',
    items: [
      {
        tag: 'Research',
        title: 'Automated vulnerability discovery in CMS',
        meta: 'Two academic papers · MSc at ENU',
        text: 'Work on approaches to automatically detecting vulnerabilities in popular CMS: catching classes of defects reproducibly rather than individual CVEs.',
      },
      {
        tag: 'Open source',
        title: 'wordpress-cve-benchmark',
        meta: 'github.com/Aisultan05',
        text: 'A suite for reproducible verification of known WordPress vulnerabilities — a baseline for comparing scanners and static analysers.',
        href: 'https://github.com/Aisultan05',
      },
      {
        tag: 'AppSec',
        title: 'Security code review',
        meta: 'Capital Network · since 2026',
        text: 'Pre-release code review: injections, authorisation and access rights, user-input handling, data leaking through API responses.',
      },
      {
        tag: 'Practice',
        title: 'Bonus-system audit',
        meta: 'SvoyShop · 2026',
        text: 'Ran an audit and confirmed several issues in authorisation logic and personal-data handling. Findings were handed to the team; technical details are not published.',
      },
      {
        tag: 'Certificate',
        title: 'CCNAv7',
        meta: 'Switching, Routing and Wireless Essentials · Network Security · 2024',
        text: 'Networking fundamentals: switching, routing, wireless and network security.',
      },
    ],
    disclaimer:
      'I write about findings in other people’s systems without technical detail, and only with the owner’s agreement.',
  },

  clients: {
    kicker: 'Clients',
    heading: 'Organisations whose websites I wrote code for',
    note: 'I worked on websites and user portals for these organisations as part of the KazInSys, BenchMark Consulting and Capital Network teams.',
    items: [
      'National Bank of Kazakhstan',
      'Baiterek NMH',
      'KEGOC',
      'KazakhExport',
      'KazAgroFinance',
      'Kazakhstan Housing Company',
      'KAZAKH INVEST',
      'Industrial Development Fund',
      'Qazaq Investment Corporation',
      'Agrarian Credit Corporation',
      'National Centre of Expertise',
      'Astana Development Centre',
      'Mediabase (KazTube)',
    ],
  },

  education: {
    kicker: 'Education',
    heading: 'Studying security, working in development',
    items: [
      {
        title: 'MSc — Information Security Systems',
        place: 'L. N. Gumilyov Eurasian National University',
        period: 'Graduating 2027',
        detail:
          'Faculty of Information Technology. Research topic — automated vulnerability discovery in CMS.',
      },
      {
        title: 'BSc — Cyber Security',
        place: 'Astana IT University',
        period: 'Graduated 2025',
        detail: 'Qualified as software developer, with cyber security as the main specialisation.',
      },
    ],
    certTitle: 'Certificate',
    cert: 'CCNAv7 — Switching, Routing and Wireless Essentials · Network Security (2024)',
    langTitle: 'Languages',
    languages: [
      { name: 'Қазақша', level: 'Native', value: 100 },
      { name: 'Русский', level: 'C2', value: 95 },
      { name: 'English', level: 'B1 — fluent in writing', value: 55 },
    ],
  },

  contact: {
    kicker: 'Contact',
    heading: 'Message me — I answer on Telegram',
    lead:
      'The form below sends your message straight to my Telegram. No mail queue — I see it immediately.',
    channels: [
      {
        id: 'email',
        label: 'Email',
        value: 'a.aytmaganbet@bk.ru',
        href: 'mailto:a.aytmaganbet@bk.ru',
        icon: 'mail',
      },
      { id: 'telegram', label: 'Telegram', value: '@EXlvl', href: 'https://t.me/EXlvl', icon: 'telegram' },
      { id: 'github', label: 'GitHub', value: 'Aisultan05', href: 'https://github.com/Aisultan05', icon: 'github' },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: 'aisultan-aitmagambetuly',
        href: 'https://linkedin.com/in/aisultan-aitmagambetuly-9342a2310',
        icon: 'linkedin',
      },
    ],
    phoneNote: 'Phone number on request.',
    process: {
      title: 'What happens next',
      steps: [
        {
          title: 'Your message lands in my Telegram',
          text: 'Not in an inbox I open once a day — straight into the messenger.',
        },
        {
          title: 'I reply within a day',
          text: 'Usually sooner. If it is urgent, say so in the first line.',
        },
        {
          title: 'Then it is your call',
          text: 'A call, a test task, repository access, or just a rough estimate.',
        },
      ],
    },
    form: {
      title: 'Message via Telegram',
      subtitle: 'Arrives in seconds',
      name: 'Your name',
      namePlaceholder: 'Name and company',
      contactField: 'How to reach you',
      contactPlaceholder: '+7 700 000-00-00 or email',
      contactHint: 'A phone number or an email — whichever suits you',
      topic: 'Topic',
      topics: ['Job opening', 'Freelance project', 'Consulting', 'Security audit', 'Something else'],
      message: 'Message',
      messagePlaceholder: 'Briefly: the task, the timeline, the stack',
      submit: 'Send',
      sending: 'Sending…',
      consent: 'By submitting this form you agree that I may use the contact details you gave to reply.',
      directLink: 'Or message me directly on Telegram',
      ok: {
        title: 'Message sent',
        text: 'It is already in my Telegram. I reply within a day, usually sooner.',
        again: 'Send another',
      },
      errors: {
        name: 'Tell me what to call you',
        contact: 'I need a phone number or an email to reply',
        message: 'A couple of sentences about the task is enough',
        generic: 'Sending failed. Try again, or email me instead.',
        rate: 'Too many messages in a row. Give it a minute.',
        network: 'No connection to the server. Check your internet, or email me.',
        notConfigured: 'The form is not connected yet. Email or Telegram works.',
      },
    },
  },

  footer: {
    setIn: 'Set in',
    built: 'Built with Vue 3 + TypeScript + Vite. The form runs on PHP and the Telegram Bot API.',
    source: 'Source code',
    rights: 'Aisultan Aitmagambetuly',
    backToTop: 'Back to top',
  },

  ui: {
    langLabel: 'Language',
    a11yLabel: 'Accessibility',
    menu: 'Contents',
    close: 'Close',
    skipToContent: 'Skip to content',
    contents: 'Contents',
  },
}
