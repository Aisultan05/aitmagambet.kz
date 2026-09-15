<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'

/** Чертёж системы вместо скриншота.
 *
 *  Макет браузера с серыми полосками показывает, что сайт «выглядит как сайт».
 *  Схема показывает, что именно было построено: где ядро, куда идут данные,
 *  что происходит на релизе. Для инженерного портфолио второе честнее.
 *
 *  Как появятся реальные скриншоты — prop `image` подставит их вместо схемы. */

const props = defineProps<{ variant: string; image?: string; alt?: string }>()

const { locale, t } = useI18n()

/** Когда есть скриншот, показываем сначала его — «как выглядит», —
 *  а схему оставляем вторым видом: она объясняет, как устроено.
 *  Одно не заменяет другое, поэтому слот не выбирает за читателя. */
const view = ref<'photo' | 'scheme'>('photo')
const showPhoto = computed(() => Boolean(props.image) && view.value === 'photo')

/** Подписи живут здесь, а не в content/: они привязаны к геометрии чертежа
 *  (длина строки влияет на то, влезает ли она в свой блок), и менять их
 *  без правки координат нельзя. Имена продуктов не переводятся. */
const dict = {
  ru: {
    core: 'БИТРИКС · ЯДРО',
    catalog: 'каталог',
    filter: 'ФИЛЬТР',
    objects: '1 250+ объектов',
    canonical: 'КАНОНИЧЕСКИЕ URL',
    indexable: 'ИНДЕКСИРУЕМЫЕ',
    release: 'релиз',
    webhook: 'ВЕБХУК',
    pullDeploy: 'pull-deploy, без ручных выкладок',

    a11yLayer: 'СЛОЙ ДОСТУПНОСТИ',
    contrast: 'КОНТРАСТ',
    size: 'КЕГЕЛЬ',
    spacing: 'ИНТЕРВАЛ',
    focus: 'ФОКУС',
    themes: '3 темы',
    upTo: 'до 140%',
    steps: '3 шага',
    portal: 'существующий портал · многоязычный',
    cssVars: 'CSS-переменные на корне — работают и для того, что отрисуется позже',

    beforeMenu: 'до: меню объявлено в каждом модуле',
    afterMenu: 'после: один источник структуры',
    globalMenu: 'ГЛОБАЛЬНОЕ МЕНЮ',
    deals: 'СДЕЛКИ',
    clients: 'КЛИЕНТЫ',
    reports: 'ОТЧЁТЫ',
    admin: 'АДМИН',
    sameTree: 'Vue-клиент читает то же дерево',

    news: 'НОВОСТИ',
    analytics: 'АНАЛИТИКА',
    oneTemplate: 'RU / EN — один шаблон',
    preview: 'превью документа в браузере',
    card: 'карточка материала · заголовок, дата, язык',
    cardShort: 'карточка материала',
    headerNav: 'адаптивная навигация в шапке',

    markup: 'ВЁРСТКА',
    pages: '10+ страниц · переиспользуемые шапка и футер',
    carousel: 'карусель',
    gallery: 'галерея',
    svgMap: 'SVG-карта',
    popup: 'pop-up',
    burger: 'burger',
    layouts: 'desktop · tablet · mobile — три раскладки на каждой',

    serverLogic: 'СЕРВЕРНАЯ ЛОГИКА',
    clientPart: 'КЛИЕНТСКАЯ ЧАСТЬ',
    myZone: 'моя зона',
    sharedZone: 'общая зона',
    contract: 'общий контракт: структура данных и маршруты',
    twoDevs: 'двое разработчиков, тимлида над задачей нет',
  },
  en: {
    core: 'BITRIX · CORE',
    catalog: 'catalog',
    filter: 'FILTER',
    objects: '1,250+ listings',
    canonical: 'CANONICAL URLS',
    indexable: 'INDEXABLE',
    release: 'release',
    webhook: 'WEBHOOK',
    pullDeploy: 'pull-deploy, no manual uploads',

    a11yLayer: 'ACCESSIBILITY LAYER',
    contrast: 'CONTRAST',
    size: 'FONT SIZE',
    spacing: 'SPACING',
    focus: 'FOCUS',
    themes: '3 themes',
    upTo: 'up to 140%',
    steps: '3 steps',
    portal: 'existing portal · multilingual',
    cssVars: 'CSS variables on the root — they cover content rendered later too',

    beforeMenu: 'before: menu declared in every module',
    afterMenu: 'after: one source of structure',
    globalMenu: 'GLOBAL MENU',
    deals: 'DEALS',
    clients: 'CLIENTS',
    reports: 'REPORTS',
    admin: 'ADMIN',
    sameTree: 'the Vue client reads the same tree',

    news: 'NEWS',
    analytics: 'ANALYTICS',
    oneTemplate: 'RU / EN — one template',
    preview: 'document preview in the browser',
    card: 'article card · title, date, language',
    cardShort: 'article card',
    headerNav: 'responsive header navigation',

    markup: 'MARKUP',
    pages: '10+ pages · reusable header and footer',
    carousel: 'carousel',
    gallery: 'gallery',
    svgMap: 'SVG map',
    popup: 'pop-up',
    burger: 'burger',
    layouts: 'desktop · tablet · mobile — three layouts each',

    serverLogic: 'SERVER LOGIC',
    clientPart: 'CLIENT SIDE',
    myZone: 'my area',
    sharedZone: 'shared area',
    contract: 'shared contract: data structures and routes',
    twoDevs: 'two developers, no tech lead over the task',
  },
} as const

const L = computed(() => dict[locale.value])
</script>

<template>
  <figure class="dia">
    <img v-if="showPhoto" :src="props.image" :alt="props.alt ?? ''" loading="lazy" />

    <!-- svoydom.kz: одно ядро, два сайта, SEO-цепочка и автодеплой -->
    <svg
      v-else-if="props.variant === 'svoydom'"
      class="js-illustration"
      viewBox="0 0 420 290"
      role="img"
      :aria-label="props.alt ?? 'Bitrix core, two sites, SEO chain and automated deployment'"
    >
      <g class="wire">
        <path d="M96 46h44M96 46v78h44M184 46h40M268 46h38M330 60v22M330 82h-96M234 82v18" />
        <path d="M84 214h20M148 214h20M212 214h40M296 214h40" />
      </g>

      <g class="box">
        <rect x="12" y="30" width="84" height="32" />
        <rect x="140" y="30" width="44" height="32" />
        <rect x="140" y="108" width="44" height="32" />
        <rect x="224" y="30" width="44" height="32" />
        <rect x="306" y="30" width="48" height="32" />
      </g>

      <g class="lbl">
        <text x="54" y="50">{{ L.core }}</text>
        <text x="162" y="50">s1</text>
        <text x="162" y="128">s2</text>
        <text x="246" y="50">VUE 3</text>
        <text x="330" y="50">{{ L.filter }}</text>
      </g>

      <g class="cap">
        <text x="162" y="74">svoydom.kz</text>
        <text x="162" y="152">svd.kz</text>
        <text x="246" y="74">{{ L.catalog }}</text>
        <text x="330" y="26">{{ L.objects }}</text>
      </g>

      <!-- Акцент: SEO-цепочка, ради которой всё и делалось -->
      <g class="hot">
        <rect x="186" y="100" width="96" height="30" />
        <rect x="186" y="146" width="96" height="30" />
        <path d="M234 130v16" />
      </g>
      <g class="lbl lbl--hot">
        <text x="234" y="119">{{ L.canonical }}</text>
        <text x="234" y="165">{{ L.indexable }}</text>
      </g>

      <line class="sep" x1="12" y1="192" x2="408" y2="192" />
      <text class="cap cap--left" x="12" y="186">{{ L.release }}</text>

      <g class="box box--thin">
        <rect x="12" y="200" width="72" height="28" />
        <rect x="104" y="200" width="44" height="28" />
        <rect x="168" y="200" width="44" height="28" />
        <rect x="252" y="200" width="44" height="28" />
        <rect x="336" y="200" width="72" height="28" />
      </g>
      <g class="lbl lbl--sm">
        <text x="48" y="218">GITLAB CI</text>
        <text x="126" y="218">{{ L.webhook }}</text>
        <text x="190" y="218">ANSIBLE</text>
        <text x="274" y="218">NGINX</text>
        <text x="372" y="218">SSL · MULTISITE</text>
      </g>
      <text class="cap cap--left" x="12" y="252">{{ L.pullDeploy }}</text>
    </svg>

    <!-- Режим доступности: слой настроек над существующим порталом -->
    <svg
      v-else-if="props.variant === 'a11y'"
      class="js-illustration"
      viewBox="0 0 420 290"
      role="img"
      :aria-label="props.alt ?? 'An accessibility layer over an existing portal'"
    >
      <g class="box box--thin">
        <rect x="12" y="150" width="396" height="126" />
      </g>
      <text class="cap cap--left" x="20" y="170">{{ L.portal }}</text>
      <g class="wire">
        <path d="M28 186h180M28 200h150M28 214h174M28 228h120M28 242h160" />
      </g>

      <g class="hot">
        <rect x="12" y="18" width="396" height="104" />
      </g>
      <text class="lbl lbl--hot" x="210" y="40">{{ L.a11yLayer }}</text>

      <g class="box">
        <rect x="30" y="54" width="80" height="52" />
        <rect x="126" y="54" width="80" height="52" />
        <rect x="222" y="54" width="80" height="52" />
        <rect x="318" y="54" width="72" height="52" />
      </g>
      <g class="lbl lbl--sm">
        <text x="70" y="76">{{ L.contrast }}</text>
        <text x="166" y="76">{{ L.size }}</text>
        <text x="262" y="76">{{ L.spacing }}</text>
        <text x="354" y="76">{{ L.focus }}</text>
      </g>
      <g class="cap">
        <text x="70" y="94">{{ L.themes }}</text>
        <text x="166" y="94">{{ L.upTo }}</text>
        <text x="262" y="94">{{ L.steps }}</text>
        <text x="354" y="94">Tab</text>
      </g>

      <g class="wire wire--hot">
        <path d="M70 106v30M166 106v30M262 106v30M354 106v30" />
      </g>
      <text class="cap cap--left" x="12" y="146">{{ L.cssVars }}</text>
    </svg>

    <!-- BMS Sales: единая структура вместо разрозненной навигации -->
    <svg
      v-else-if="props.variant === 'bms'"
      class="js-illustration"
      viewBox="0 0 420 290"
      role="img"
      :aria-label="props.alt ?? 'One navigation tree instead of scattered menus'"
    >
      <text class="cap cap--left" x="12" y="24">{{ L.beforeMenu }}</text>
      <g class="box box--dashed">
        <rect x="12" y="34" width="76" height="26" />
        <rect x="100" y="34" width="76" height="26" />
        <rect x="188" y="34" width="76" height="26" />
        <rect x="276" y="34" width="76" height="26" />
      </g>
      <g class="wire wire--dashed">
        <path d="M50 60v14M138 60v22M226 60v14M314 60v22" />
      </g>

      <line class="sep" x1="12" y1="96" x2="408" y2="96" />

      <text class="cap cap--left" x="12" y="120">{{ L.afterMenu }}</text>
      <g class="hot">
        <rect x="140" y="130" width="140" height="30" />
      </g>
      <text class="lbl lbl--hot" x="210" y="149">{{ L.globalMenu }}</text>

      <g class="wire">
        <path d="M210 160v18M60 178h300M60 178v16M170 178v16M280 178v16M370 178v16" />
        <path d="M60 226v14M40 240h40M170 226v14M150 240h40M280 226v14M260 240h40" />
      </g>

      <g class="box">
        <rect x="24" y="194" width="72" height="32" />
        <rect x="134" y="194" width="72" height="32" />
        <rect x="244" y="194" width="72" height="32" />
        <rect x="340" y="194" width="60" height="32" />
      </g>
      <g class="lbl lbl--sm">
        <text x="60" y="214">{{ L.deals }}</text>
        <text x="170" y="214">{{ L.clients }}</text>
        <text x="280" y="214">{{ L.reports }}</text>
        <text x="370" y="214">{{ L.admin }}</text>
      </g>
      <g class="box box--thin">
        <rect x="24" y="240" width="32" height="18" />
        <rect x="64" y="240" width="32" height="18" />
        <rect x="134" y="240" width="32" height="18" />
        <rect x="174" y="240" width="32" height="18" />
        <rect x="244" y="240" width="32" height="18" />
        <rect x="284" y="240" width="32" height="18" />
      </g>
      <text class="cap cap--left" x="12" y="278">{{ L.sameTree }}</text>
    </svg>

    <!-- ecp.kz: двуязычный контент и превью документов -->
    <svg
      v-else-if="props.variant === 'ecp'"
      class="js-illustration"
      viewBox="0 0 420 290"
      role="img"
      :aria-label="props.alt ?? 'October CMS, bilingual content and PDF previews'"
    >
      <g class="box">
        <rect x="12" y="40" width="96" height="34" />
        <rect x="156" y="26" width="108" height="30" />
        <rect x="156" y="72" width="108" height="30" />
        <rect x="312" y="40" width="96" height="34" />
      </g>
      <g class="wire">
        <path d="M108 57h48M108 57v-16h48M108 57v30h48M264 41h48v16M264 87h48v-16" />
      </g>
      <g class="lbl">
        <text x="60" y="60">OCTOBER CMS</text>
        <text x="210" y="45">{{ L.news }}</text>
        <text x="210" y="91">{{ L.analytics }}</text>
        <text x="360" y="60">RAINLAB.BLOG</text>
      </g>
      <g class="cap">
        <text x="210" y="18">{{ L.oneTemplate }}</text>
      </g>

      <line class="sep" x1="12" y1="130" x2="408" y2="130" />

      <g class="hot">
        <rect x="12" y="146" width="130" height="118" />
      </g>
      <text class="lbl lbl--hot" x="77" y="166">PDF.JS</text>
      <g class="wire wire--hot">
        <path d="M32 186h90M32 200h70M32 214h84M32 228h56" />
        <path d="M42 250l16-18 14 16 12-12 16 14" />
      </g>
      <text class="cap" x="77" y="278">{{ L.preview }}</text>

      <g class="box box--thin">
        <rect x="158" y="146" width="250" height="34" />
        <rect x="158" y="190" width="250" height="34" />
        <rect x="158" y="234" width="250" height="30" />
      </g>
      <g class="cap cap--left">
        <text x="170" y="167">{{ L.card }}</text>
        <text x="170" y="211">{{ L.cardShort }}</text>
        <text x="170" y="253">{{ L.headerNav }}</text>
      </g>
    </svg>

    <!-- ELKE: страницы из макета Figma, готовые под MODX -->
    <svg
      v-else-if="props.variant === 'elke'"
      class="js-illustration"
      viewBox="0 0 420 290"
      role="img"
      :aria-label="props.alt ?? '10+ pages from Figma, prepared for MODX'"
    >
      <g class="box box--thin">
        <rect x="12" y="26" width="92" height="30" />
        <rect x="316" y="26" width="92" height="30" />
      </g>
      <g class="lbl lbl--sm">
        <text x="58" y="45">FIGMA</text>
        <text x="362" y="45">MODX</text>
      </g>
      <g class="wire">
        <path d="M104 41h60M256 41h60" />
      </g>
      <g class="hot">
        <rect x="164" y="26" width="92" height="30" />
      </g>
      <text class="lbl lbl--hot" x="210" y="45">{{ L.markup }}</text>

      <line class="sep" x1="12" y1="78" x2="408" y2="78" />
      <text class="cap cap--left" x="12" y="98">{{ L.pages }}</text>

      <g class="box box--thin">
        <rect x="12" y="110" width="74" height="52" />
        <rect x="98" y="110" width="74" height="52" />
        <rect x="184" y="110" width="74" height="52" />
        <rect x="270" y="110" width="74" height="52" />
        <rect x="356" y="110" width="52" height="52" />
        <rect x="12" y="176" width="74" height="52" />
        <rect x="98" y="176" width="74" height="52" />
        <rect x="184" y="176" width="74" height="52" />
        <rect x="270" y="176" width="74" height="52" />
        <rect x="356" y="176" width="52" height="52" />
      </g>
      <g class="wire">
        <path d="M12 122h74M98 122h74M184 122h74M270 122h74M356 122h52" />
        <path d="M12 188h74M98 188h74M184 188h74M270 188h74M356 188h52" />
      </g>
      <g class="cap cap--left cap--tiny">
        <text x="16" y="156">{{ L.carousel }}</text>
        <text x="102" y="156">{{ L.gallery }}</text>
        <text x="188" y="156">{{ L.svgMap }}</text>
        <text x="274" y="156">{{ L.popup }}</text>
        <text x="360" y="156">{{ L.burger }}</text>
      </g>
      <text class="cap cap--left" x="12" y="252">{{ L.layouts }}</text>
    </svg>

    <!-- rgurpo: разделение зон ответственности на двоих -->
    <svg
      v-else
      class="js-illustration"
      viewBox="0 0 420 290"
      role="img"
      :aria-label="props.alt ?? 'Server and client work split between two developers'"
    >
      <g class="hot">
        <rect x="12" y="34" width="190" height="104" />
      </g>
      <text class="lbl lbl--hot" x="107" y="54">{{ L.serverLogic }}</text>
      <g class="wire wire--hot">
        <path d="M32 76h150M32 92h120M32 108h140M32 124h96" />
      </g>
      <text class="cap" x="107" y="152">{{ L.myZone }}</text>

      <g class="box">
        <rect x="218" y="34" width="190" height="104" />
      </g>
      <text class="lbl" x="313" y="54">{{ L.clientPart }}</text>
      <g class="wire">
        <path d="M238 76h150M238 92h110M238 108h150M238 124h84" />
      </g>
      <text class="cap" x="313" y="152">{{ L.sharedZone }}</text>

      <line class="sep" x1="12" y1="176" x2="408" y2="176" />

      <g class="box box--thin">
        <rect x="12" y="192" width="396" height="34" />
      </g>
      <text class="cap cap--left" x="24" y="213">{{ L.contract }}</text>

      <g class="wire">
        <path d="M107 226v18M313 226v18M107 244h206" />
      </g>
      <text class="cap cap--left" x="12" y="272">{{ L.twoDevs }}</text>
    </svg>

    <!-- Подпись к иллюстрации с переключателем вида -->
    <figcaption v-if="props.image" class="dia__cap">
      <button
        v-for="opt in (['photo', 'scheme'] as const)"
        :key="opt"
        class="dia__view"
        :class="{ 'is-active': view === opt }"
        :aria-pressed="view === opt"
        @click="view = opt"
      >
        {{ opt === 'photo' ? t.projects.viewPhoto : t.projects.viewScheme }}
      </button>
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.dia {
  margin: 0;
  border: var(--rule) solid var(--ink);
  background: var(--paper-3);
}

/* Строка под кадром: печатная подпись к иллюстрации, она же переключатель. */
.dia__cap {
  display: flex;
  border-top: var(--rule) solid var(--ink);
}

.dia__view {
  flex: 1;
  padding: 0.4rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);

  & + & {
    border-left: var(--rule) solid var(--line);
  }

  &:hover {
    color: var(--ink);
  }

  &.is-active {
    background: var(--ink);
    color: var(--paper);
  }
}

svg,
img {
  display: block;
  width: 100%;
  height: auto;
}

/* Единая палитра чертежа: тонкие линии ink, акцент только на главном. */
svg {
  font-family: var(--font-mono);

  .box rect {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.2;
  }

  .box--thin rect {
    stroke: var(--line);
    stroke-width: 1;
  }

  .box--dashed rect {
    stroke: var(--ink-3);
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }

  .hot rect {
    fill: var(--accent-soft);
    stroke: var(--accent);
    stroke-width: 1.4;
  }

  .hot path {
    stroke: var(--accent);
    stroke-width: 1.2;
    fill: none;
  }

  .wire path {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1;
    opacity: 0.55;
  }

  .wire--hot path {
    stroke: var(--accent);
    opacity: 0.75;
  }

  .wire--dashed path {
    stroke-dasharray: 3 3;
    opacity: 0.45;
  }

  .sep {
    stroke: var(--line);
    stroke-width: 1;
  }

  .lbl text,
  text.lbl {
    fill: var(--ink);
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-anchor: middle;
  }

  .lbl--sm text,
  text.lbl--sm {
    font-size: 7px;
    letter-spacing: 0.03em;
  }

  .lbl--hot text,
  text.lbl--hot {
    fill: var(--accent);
  }

  .cap text,
  text.cap {
    fill: var(--ink-3);
    font-size: 7.5px;
    letter-spacing: 0.02em;
    text-anchor: middle;
  }

  .cap--left text,
  text.cap--left {
    text-anchor: start;
  }

  .cap--tiny text,
  text.cap--tiny {
    font-size: 6.5px;
  }
}

/* В высоком контрасте полупрозрачные линии сливаются с фоном. */
:root[data-contrast='high'] svg {
  .wire path {
    opacity: 1;
  }
  .box--thin rect {
    stroke: var(--ink);
  }
}
</style>
