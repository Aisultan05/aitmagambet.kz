<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'
import type { Project } from '@/content/types'

/** Полный разбор кейса. Открывается поверх страницы как вклейка:
 *  бумажный лист с жирной линейкой сверху, без скруглений и блюра. */

const props = defineProps<{ project: Project }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const dialog = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab' || !dialog.value) return

  // Ловушка фокуса: из вклейки нельзя уйти табом на страницу под ней.
  const focusable = dialog.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
  )
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  lastFocused = document.activeElement as HTMLElement
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
  requestAnimationFrame(() => dialog.value?.querySelector<HTMLElement>('button')?.focus())
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
  lastFocused?.focus()
})
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <article ref="dialog" class="sheet" role="dialog" aria-modal="true" :aria-label="props.project.title">
      <header class="sheet__head">
        <div class="sheet__headtext">
          <p class="label sheet__kicker">{{ props.project.kicker }}</p>
          <h2 class="headline--sm sheet__title">{{ props.project.title }}</h2>
          <p class="data sheet__role">{{ props.project.year }} · {{ props.project.role }}</p>
        </div>
        <button class="sheet__close" :aria-label="t.projects.close" @click="emit('close')">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="sheet__body">
        <p class="lead-serif sheet__summary">{{ props.project.summary }}</p>

        <dl v-if="props.project.delta" class="sdelta">
          <div class="sdelta__row">
            <dt class="sdelta__tag">− {{ t.projects.before }}</dt>
            <dd class="sdelta__text">{{ props.project.delta.before }}</dd>
          </div>
          <div class="sdelta__row sdelta__row--after">
            <dt class="sdelta__tag">+ {{ t.projects.after }}</dt>
            <dd class="sdelta__text">{{ props.project.delta.after }}</dd>
          </div>
        </dl>

        <div class="sheet__blocks">
          <section v-for="(block, bi) in props.project.blocks" :key="block.title" class="sblock">
            <h3 class="sblock__title">
              <span class="sblock__num">{{ String(bi + 1).padStart(2, '0') }}</span>
              {{ block.title }}
            </h3>
            <ul class="sblock__items">
              <li v-for="item in block.items" :key="item" class="sblock__item">{{ item }}</li>
            </ul>
          </section>
        </div>

        <blockquote v-if="props.project.takeaway" class="sheet__quote">
          {{ props.project.takeaway }}
        </blockquote>

        <footer class="sheet__foot">
          <p class="data sheet__stack">
            <span v-for="(techName, si) in props.project.stack" :key="techName">
              <span v-if="si > 0" aria-hidden="true"> / </span>{{ techName }}
            </span>
          </p>
          <a
            v-for="link in props.project.links"
            :key="link.href"
            class="btn btn--sm"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
            <AppIcon name="external" :size="13" />
          </a>
        </footer>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: color-mix(in srgb, var(--ink) 62%, transparent);

  @include up($bp-md) {
    align-items: center;
    padding: 2rem 1.5rem;
  }
}

.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 50rem;
  max-height: 92vh;
  background: var(--paper);
  border-top: 4px solid var(--accent);
  animation: sheet-in 0.3s var(--ease);

  @include up($bp-md) {
    max-height: 88vh;
    border: var(--rule) solid var(--ink);
    border-top: 4px solid var(--accent);
  }
}

.sheet__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem var(--gutter) 1rem;
  border-bottom: var(--rule-bold) solid var(--ink);

  @include up($bp-md) {
    padding-inline: 2rem;
  }
}

.sheet__kicker {
  color: var(--accent);
}

.sheet__title {
  margin-top: 0.55rem;
}

.sheet__role {
  margin-top: 0.35rem;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.sheet__close {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: var(--rule) solid var(--line);
  color: var(--ink-2);

  &:hover {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }
}

.sheet__body {
  overflow-y: auto;
  padding: 1.5rem var(--gutter) 2rem;
  -webkit-overflow-scrolling: touch;

  @include up($bp-md) {
    padding-inline: 2rem;
  }
}

.sheet__summary {
  max-width: 58ch;
  color: var(--ink-2);
}

.sdelta {
  margin-top: 1.5rem;
  border-top: var(--rule) solid var(--line);
}

.sdelta__row {
  display: grid;
  gap: 0.2rem 1rem;
  padding: 0.75rem 0;
  border-bottom: var(--rule) solid var(--line-soft);

  @include up($bp-sm) {
    grid-template-columns: 6.5rem minmax(0, 1fr);
  }
}

.sdelta__tag {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.sdelta__text {
  font-size: 0.9375rem;
  color: var(--ink-3);
}

.sdelta__row--after {
  .sdelta__tag {
    color: var(--accent);
  }
  .sdelta__text {
    color: var(--ink);
  }
}

.sheet__blocks {
  margin-top: 2rem;

  @include up($bp-md) {
    @include columns(2, 2.25rem);
  }
}

.sblock {
  break-inside: avoid;
  margin-bottom: 1.6rem;
}

.sblock__title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding-bottom: 0.45rem;
  margin-bottom: 0.7rem;
  border-bottom: var(--rule) solid var(--ink);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
}

.sblock__num {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--accent);
}

.sblock__items {
  display: grid;
  gap: 0.5rem;
}

/* Пункты через висячий интерпункт — печатный список, не галочки. */
.sblock__item {
  position: relative;
  padding-left: 0.9rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink-2);

  &::before {
    content: '·';
    position: absolute;
    left: 0.15rem;
    color: var(--accent);
    font-weight: 700;
  }
}

.sheet__quote {
  margin-top: 1rem;
  padding: 1rem 0 1rem 1.1rem;
  border-top: var(--rule) solid var(--line);
  border-left: 4px solid var(--accent);
  font-family: var(--font-serif);
  font-style: italic;
  @include fluid(font-size, 16, 19);
  line-height: 1.45;
  color: var(--ink);
}

.sheet__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 1.75rem;
  padding-top: 1rem;
  border-top: var(--rule-bold) solid var(--ink);
}

.sheet__stack {
  flex: 1;
  min-width: 12rem;
  font-size: 0.6875rem;
  color: var(--ink-3);
}

@keyframes sheet-in {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
}
</style>
