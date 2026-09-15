<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'
import { useA11y } from '@/composables/useA11y'
import { watchActiveSection } from '@/composables/useReveal'

/** Колонтитул издания: тонкая строка с номером раздела, а не «шапка сайта».
 *  Появляется только после того, как мастхед уехал вверх — иначе она
 *  спорит с именем на первом экране. */

const { t, locale, setLocale } = useI18n()
const { a11y, togglePanel } = useA11y()

const shown = ref(false)
const active = ref('')
const menuOpen = ref(false)
const progress = ref(0)

let stopSections: (() => void) | null = null

function onScroll() {
  shown.value = window.scrollY > window.innerHeight * 0.62
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  stopSections = watchActiveSection(
    t.value.nav.items.map((i) => i.id),
    (id) => (active.value = id),
  )
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  stopSections?.()
})

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function go(id: string) {
  menuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Фамилия для колонтитула — из контента, чтобы в EN не осталась кириллица. */
function surname(): string {
  const parts = t.value.hero.name.split(' ')
  return parts[parts.length - 1]
}

/** Номер текущего раздела для колонтитула: «04 / 09». */
function activeIndex(): string {
  const i = t.value.nav.items.findIndex((x) => x.id === active.value)
  return String(i < 0 ? 1 : i + 1).padStart(2, '0')
}
</script>

<template>
  <header class="folio" :class="{ 'is-shown': shown }">
    <div class="folio__inner shell">
      <a class="folio__name" href="#top" @click.prevent="go('top')">
        {{ surname() }}
        <span class="folio__role">fullstack</span>
      </a>

      <p class="folio__section">
        <span class="folio__idx">{{ activeIndex() }}</span>
        <span class="folio__slash">/</span>
        <span class="folio__total">{{ String(t.nav.items.length).padStart(2, '0') }}</span>
        <span class="folio__sep">·</span>
        <span class="folio__cur">{{
          t.nav.items.find((x) => x.id === active)?.label ?? t.nav.items[0].label
        }}</span>
      </p>

      <div class="folio__tools">
        <div class="lang" role="group" :aria-label="t.ui.langLabel">
          <button
            v-for="code in (['ru', 'en'] as const)"
            :key="code"
            class="lang__btn"
            :class="{ 'is-active': locale === code }"
            :aria-pressed="locale === code"
            @click="setLocale(code)"
          >
            {{ code }}
          </button>
        </div>

        <button
          class="tool"
          :class="{ 'is-on': a11y.panelOpen }"
          :aria-label="t.ui.a11yLabel"
          :aria-expanded="a11y.panelOpen"
          :title="t.ui.a11yLabel"
          @click="togglePanel"
        >
          <AppIcon name="accessibility" :size="18" />
        </button>

        <button
          class="tool tool--menu"
          :aria-label="menuOpen ? t.ui.close : t.ui.menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
        </button>
      </div>
    </div>

    <div class="folio__progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
  </header>

  <!-- Оглавление вместо выпадающего меню: список разделов с номерами. -->
  <Transition name="toc">
    <div v-if="menuOpen" class="toc" @click.self="menuOpen = false">
      <nav class="toc__panel shell" :aria-label="t.ui.menu">
        <p class="label toc__label">{{ t.ui.contents }}</p>
        <ol class="toc__list">
          <li v-for="(item, i) in t.nav.items" :key="item.id">
            <a class="toc__item" :href="`#${item.id}`" @click.prevent="go(item.id)">
              <span class="toc__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="toc__text">{{ item.label }}</span>
              <span class="toc__dots" aria-hidden="true" />
            </a>
          </li>
        </ol>
      </nav>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.folio {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: var(--paper);
  border-bottom: var(--rule) solid var(--ink);
  transform: translateY(-101%);
  transition: transform var(--dur) var(--ease);

  &.is-shown {
    transform: none;
  }
}

.folio__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 2.9rem;
}

.folio__name {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 0.9375rem;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}

.folio__role {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

/* Номер раздела по центру полосы — как на странице книги. */
.folio__section {
  display: none;
  align-items: baseline;
  gap: 0.4rem;
  margin-inline: auto;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);

  @include up($bp-md) {
    display: flex;
  }
}

.folio__idx {
  color: var(--accent);
  font-weight: 500;
}

.folio__sep {
  opacity: 0.5;
  margin-inline: 0.15rem;
}

.folio__cur {
  color: var(--ink-2);
}

.folio__tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.lang {
  display: flex;
  gap: 0.1rem;
}

.lang__btn {
  padding: 0.2rem 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-3);
  border-bottom: var(--rule-bold) solid transparent;
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);

  &:hover {
    color: var(--ink);
  }

  &.is-active {
    color: var(--ink);
    border-bottom-color: var(--accent);
  }
}

.tool {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border: var(--rule) solid var(--line);
  color: var(--ink-2);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);

  &:hover,
  &.is-on {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }
}

:root[data-a11y-active='true'] .tool:not(.tool--menu) {
  border-color: var(--accent);
  color: var(--accent);
}

.folio__progress {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  transform-origin: 0 50%;
  transform: scaleX(0);
}

/* ---- Оглавление ---- */
.toc {
  position: fixed;
  inset: 0;
  z-index: 110;
  background: color-mix(in srgb, var(--ink) 55%, transparent);
  display: flex;
  align-items: flex-start;
}

.toc__panel {
  width: 100%;
  padding-top: clamp(2.5rem, 8vh, 5rem);
  padding-bottom: 2.5rem;
  background: var(--paper);
  border-bottom: var(--rule-bold) solid var(--ink);
}

.toc__label {
  padding-bottom: 0.6rem;
  border-bottom: var(--rule) solid var(--line);
  margin-bottom: 0.5rem;
}

.toc__item {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  padding: 0.75rem 0;
  border-bottom: var(--rule) solid var(--line-soft);

  &:hover {
    color: var(--accent);
  }
}

.toc__num {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent);
  flex: none;
}

.toc__text {
  font-family: var(--font-display);
  font-weight: 900;
  @include fluid(font-size, 24, 40);
  line-height: 1;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

/* Отточие до края полосы — типографская деталь оглавления. */
.toc__dots {
  flex: 1;
  height: 1px;
  margin-bottom: 0.35em;
  background-image: linear-gradient(90deg, var(--line) 0 2px, transparent 2px 6px);
  background-size: 6px 1px;
  background-repeat: repeat-x;
}

.toc-enter-active,
.toc-leave-active {
  transition: opacity var(--dur-fast) var(--ease);

  .toc__panel {
    transition: transform var(--dur) var(--ease);
  }
}
.toc-enter-from,
.toc-leave-to {
  opacity: 0;

  .toc__panel {
    transform: translateY(-2rem);
  }
}
</style>
