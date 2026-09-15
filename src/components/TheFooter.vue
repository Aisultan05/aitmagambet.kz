<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'

/** Колофон: в печати это выходные данные — кем набрано, чем собрано.
 *  Для инженерного портфолио честная строка «на чём сделано» уместнее
 *  ряда иконок соцсетей. */

const { t } = useI18n()
const year = new Date().getFullYear()

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="colophon">
    <div class="shell">
      <hr class="rule rule--bold" />

      <div class="colophon__grid">
        <div class="colophon__brand">
          <p class="colophon__name masthead-type">{{ t.footer.rights }}</p>
          <p class="colophon__built data">{{ t.footer.built }}</p>
        </div>

        <dl class="colophon__meta">
          <div class="colophon__row">
            <dt class="colophon__key">{{ t.footer.setIn }}</dt>
            <dd class="colophon__val">Golos Text · Spectral · IBM Plex Mono</dd>
          </div>
          <div v-for="ch in t.contact.channels" :key="ch.id" class="colophon__row">
            <dt class="colophon__key">{{ ch.label }}</dt>
            <dd class="colophon__val">
              <a
                class="link"
                :href="ch.href"
                :target="ch.id === 'email' ? undefined : '_blank'"
                :rel="ch.id === 'email' ? undefined : 'noopener noreferrer'"
                >{{ ch.value }}</a
              >
            </dd>
          </div>
        </dl>
      </div>

      <div class="colophon__foot">
        <p class="data">© {{ year }} · Астана</p>
        <button class="colophon__top" @click="toTop">
          {{ t.footer.backToTop }}
          <AppIcon name="arrow-up" :size="14" />
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.colophon {
  padding-bottom: 2rem;
  background: var(--paper);
}

.colophon__grid {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding-top: clamp(1.5rem, 4vw, 2.5rem);

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  }
}

/* Имя ещё раз крупно — закрывающая рифма к мастхеду. */
.colophon__name {
  @include fluid(font-size, 32, 62, $cap-vw: 10);
  line-height: 0.9;
}

.colophon__built {
  margin-top: 0.9rem;
  max-width: 34ch;
  font-size: 0.6875rem;
  color: var(--ink-3);
}

.colophon__meta {
  @include up($bp-lg) {
    border-left: var(--rule) solid var(--line);
    padding-left: 1.75rem;
  }
}

.colophon__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.45rem 0;
  border-bottom: var(--rule) solid var(--line-soft);
}

.colophon__key {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  flex: none;
}

.colophon__val {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-align: right;
  color: var(--ink-2);
}

.colophon__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  padding-top: 0.75rem;
  border-top: var(--rule) solid var(--ink);
}

.colophon__top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);

  &:hover {
    color: var(--accent);
  }
}
</style>
