<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'
import { useA11y } from '@/composables/useA11y'

/** Разворот про доступность. Единственная секция, которая сама
 *  является демонстрацией: кнопка включает настоящий режим. */

const { t } = useI18n()
const { enableLowVision } = useA11y()
</script>

<template>
  <section id="accessibility" class="band a11ys">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">05</span>
        <span class="band__name">{{ t.a11y.kicker }}</span>
      </div>

      <h2 class="headline a11ys__title" v-reveal>{{ t.a11y.heading }}</h2>

      <div class="a11ys__body">
        <div class="a11ys__left" v-reveal="60">
          <p class="lead-serif a11ys__lead">{{ t.a11y.lead }}</p>
          <p v-for="p in t.a11y.body" :key="p" class="serif a11ys__p">{{ p }}</p>

          <button class="btn btn--solid a11ys__cta" @click="enableLowVision">
            <AppIcon name="accessibility" :size="17" />
            {{ t.a11y.tryIt }}
          </button>
        </div>

        <!-- Спецификация режима: таблица «параметр — что делает» -->
        <dl class="spec" v-reveal="120">
          <div v-for="(f, i) in t.a11y.features" :key="f.title" class="spec__row">
            <dt class="spec__key">
              <span class="spec__num">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ f.title }}
            </dt>
            <dd class="spec__val">{{ f.text }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.a11ys__title {
  max-width: 20ch;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
}

.a11ys__body {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  align-items: start;

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  }
}

.a11ys__lead {
  max-width: 40ch;
}

.a11ys__p {
  margin-top: 1rem;
  max-width: 52ch;
}

.a11ys__cta {
  margin-top: clamp(1.5rem, 3vw, 2rem);
}

/* ---- Спецификация ---- */
.spec {
  border-top: var(--rule-bold) solid var(--ink);
}

.spec__row {
  display: grid;
  gap: 0.25rem 1.5rem;
  padding: 0.85rem 0;
  border-bottom: var(--rule) solid var(--line);

  @include up($bp-sm) {
    grid-template-columns: 11rem minmax(0, 1fr);
    align-items: baseline;
  }
}

.spec__key {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
}

.spec__num {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--accent);
}

.spec__val {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink-2);
}
</style>
