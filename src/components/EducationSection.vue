<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section id="education" class="band band--tint">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">08</span>
        <span class="band__name">{{ t.education.kicker }}</span>
      </div>

      <h2 class="headline edu__title" v-reveal>{{ t.education.heading }}</h2>

      <div class="edu">
        <ol class="degrees" v-reveal="60">
          <li v-for="item in t.education.items" :key="item.title" class="degree">
            <p class="degree__period label">{{ item.period }}</p>
            <h3 class="title degree__name">{{ item.title }}</h3>
            <p class="degree__place">{{ item.place }}</p>
            <p class="serif degree__detail">{{ item.detail }}</p>
          </li>

          <li class="degree degree--cert">
            <p class="degree__period label">{{ t.education.certTitle }}</p>
            <p class="degree__cert">{{ t.education.cert }}</p>
          </li>
        </ol>

        <!-- Языки: полосы набора вместо процентных индикаторов -->
        <aside class="langs" v-reveal="120">
          <p class="label langs__label">{{ t.education.langTitle }}</p>
          <dl class="langs__list">
            <div v-for="lang in t.education.languages" :key="lang.name" class="lang">
              <dt class="lang__name">{{ lang.name }}</dt>
              <dd class="lang__level data">{{ lang.level }}</dd>
              <dd
                class="lang__bar"
                role="meter"
                :aria-valuenow="lang.value"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`${lang.name}: ${lang.level}`"
              >
                <span class="lang__fill" :style="{ '--v': `${lang.value}%` }" />
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.edu__title {
  max-width: 18ch;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
}

.edu {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  align-items: start;

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  }
}

.degrees {
  border-top: var(--rule-bold) solid var(--ink);
}

.degree {
  padding: clamp(1rem, 2.5vw, 1.4rem) 0;
  border-bottom: var(--rule) solid var(--line);
}

.degree__period {
  color: var(--accent);
}

.degree__name {
  margin-top: 0.5rem;
  max-width: 40ch;
}

.degree__place {
  margin-top: 0.3rem;
  font-size: 0.875rem;
  color: var(--ink-2);
}

.degree__detail {
  margin-top: 0.6rem;
  max-width: 58ch;
  font-size: 0.9375rem;
}

.degree--cert {
  border-bottom: 0;
}

.degree__cert {
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ink-2);
}

/* ---- Языки ---- */
.langs {
  @include up($bp-lg) {
    border-left: var(--rule) solid var(--line);
    padding-left: 1.75rem;
  }
}

.langs__label {
  padding-bottom: 0.5rem;
  border-bottom: var(--rule) solid var(--ink);
}

.lang {
  padding: 0.85rem 0;
  border-bottom: var(--rule) solid var(--line-soft);
}

.lang__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
}

.lang__level {
  margin-top: 0.15rem;
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}

/* Плоская линейка вместо градиентного прогресс-бара. */
.lang__bar {
  margin-top: 0.5rem;
  height: 3px;
  background: var(--line);
}

.lang__fill {
  display: block;
  width: var(--v);
  height: 100%;
  background: var(--accent);
  transform-origin: 0 50%;
  animation: draw 0.9s var(--ease) backwards;
}

@keyframes draw {
  from {
    transform: scaleX(0);
  }
}
</style>
