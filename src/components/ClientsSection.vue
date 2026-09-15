<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

/** Титры: плотный типографский список в колонках.
 *  Бегущая строка убрана — она читается как реклама, а не как список. */

const { t } = useI18n()
</script>

<template>
  <section id="clients" class="band">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">07</span>
        <span class="band__name">{{ t.clients.kicker }}</span>
      </div>

      <div class="cl__top">
        <h2 class="headline cl__title" v-reveal>{{ t.clients.heading }}</h2>
        <p class="serif cl__note" v-reveal="60">{{ t.clients.note }}</p>
      </div>

      <ul class="credits" v-reveal>
        <li v-for="(name, i) in t.clients.items" :key="name" class="credit">
          <span class="credit__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="credit__name">{{ name }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cl__top {
  display: grid;
  gap: 1.25rem 3rem;

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: end;
  }
}

.cl__title {
  max-width: 16ch;
}

.cl__note {
  max-width: 52ch;
}

.credits {
  margin-top: clamp(2rem, 5vw, 3.25rem);
  border-top: var(--rule-bold) solid var(--ink);
}

.credit {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  padding: 0.6rem 0;
  border-bottom: var(--rule) solid var(--line-soft);
  transition: color var(--dur-fast) var(--ease);

  &:hover {
    color: var(--accent);
  }
}

.credit__num {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--ink-3);
  flex: none;
}

/* Имена набраны крупно и плотно — сам список работает как плашка доверия. */
.credit__name {
  font-family: var(--font-display);
  font-weight: 700;
  @include fluid(font-size, 15, 21);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* На широкой полосе список идёт в две колонки, как титры. */
@include up($bp-md) {
  .credits {
    column-count: 2;
    column-gap: 3rem;
  }
  .credit {
    break-inside: avoid;
  }
}

@include up($bp-xl) {
  .credits {
    column-count: 3;
  }
}
</style>
