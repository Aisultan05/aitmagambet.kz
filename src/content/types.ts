/** Единая типизированная схема контента. Оба языка обязаны её реализовать —
 *  так забытый перевод падает на этапе `vue-tsc`, а не в проде. */

export interface NavItem {
  id: string
  label: string
}

export interface Metric {
  value: string
  label: string
  hint?: string
}

export interface StackGroup {
  id: string
  title: string
  note: string
  items: string[]
}

export interface Job {
  company: string
  role: string
  period: string
  location: string
  site?: string
  summary: string
  bullets: string[]
  highlight?: string
  clients?: string[]
  current?: boolean
}

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  title: string
  kicker: string
  year: string
  role: string
  featured?: boolean
  summary: string
  /** Блоки «что сделал» — заголовок + пункты, чтобы кейс не был плоским списком. */
  blocks: { title: string; items: string[] }[]
  metrics?: Metric[]
  stack: string[]
  links?: ProjectLink[]
  /** Скриншот, когда появится: подставится вместо схематичного макета. */
  image?: string
  imageAlt?: string
  /** Почему кейс интересен — субъективный вывод, отдельным акцентом. */
  takeaway?: string
  /** Состояние до и после работы: главный измеримый смысл кейса. */
  delta?: { before: string; after: string }
}

export interface ResearchItem {
  title: string
  meta: string
  text: string
  tag: string
  href?: string
}

export interface EducationItem {
  title: string
  place: string
  period: string
  detail: string
}

export interface LanguageItem {
  name: string
  level: string
  /** 0..100 — только для визуализации полосы. */
  value: number
}

export interface ContactChannel {
  id: string
  label: string
  value: string
  href: string
  icon: string
}

export interface Content {
  meta: { title: string; description: string; lang: string }
  nav: { items: NavItem[]; cta: string }
  hero: {
    eyebrow: string
    /** Строка выпуска в датлайне мастхеда. */
    issue: string
    name: string
    roles: string[]
    lead: string
    tagline: string
    ctaPrimary: string
    ctaSecondary: string
    metrics: Metric[]
    availability: string
  }
  about: {
    heading: string
    kicker: string
    paragraphs: string[]
    facts: { label: string; value: string }[]
    /** Заголовок и приписка на внешнем поле (маргиналии). */
    marginTitle: string
    marginNote: string
  }
  stack: {
    heading: string
    kicker: string
    intro: string
    groups: StackGroup[]
    honesty: { title: string; text: string; items: string[] }
  }
  experience: {
    heading: string
    kicker: string
    total: string
    jobs: Job[]
    clientsNote: string
    expand: string
    collapse: string
    now: string
    colPeriod: string
    colPlace: string
    colWhat: string
  }
  projects: {
    heading: string
    kicker: string
    intro: string
    all: string
    items: Project[]
    open: string
    close: string
    liveSite: string
    moreTitle: string
    outcome: string
    before: string
    after: string
    viewPhoto: string
    viewScheme: string
  }
  a11y: {
    heading: string
    kicker: string
    lead: string
    body: string[]
    tryIt: string
    features: { title: string; text: string }[]
    panelTitle: string
    panelHint: string
    controls: {
      contrast: string
      fontSize: string
      spacing: string
      motion: string
      images: string
      reset: string
      on: string
      off: string
    }
  }
  research: {
    heading: string
    kicker: string
    lead: string
    items: ResearchItem[]
    disclaimer: string
  }
  clients: { heading: string; kicker: string; note: string; items: string[] }
  education: {
    heading: string
    kicker: string
    items: EducationItem[]
    certTitle: string
    cert: string
    langTitle: string
    languages: LanguageItem[]
  }
  contact: {
    heading: string
    kicker: string
    lead: string
    channels: ContactChannel[]
    phoneNote: string
    process: { title: string; steps: { title: string; text: string }[] }
    form: {
      title: string
      subtitle: string
      name: string
      namePlaceholder: string
      contactField: string
      contactPlaceholder: string
      contactHint: string
      topic: string
      topics: string[]
      message: string
      messagePlaceholder: string
      submit: string
      sending: string
      consent: string
      directLink: string
      ok: { title: string; text: string; again: string }
      errors: {
        name: string
        contact: string
        message: string
        generic: string
        rate: string
        network: string
        notConfigured: string
      }
    }
  }
  footer: { built: string; source: string; rights: string; backToTop: string; setIn: string }
  ui: {
    langLabel: string
    a11yLabel: string
    menu: string
    close: string
    skipToContent: string
    contents: string
  }
}
