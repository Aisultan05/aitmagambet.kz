<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'

/** Реестр мест работы: печатная таблица с волосяными линейками.
 *  Строка раскрывается на месте — вместо таймлайна с точками и свечением. */

const { t } = useI18n()
const open = ref<Set<number>>(new Set([0]))

function toggle(i: number) {
  const next = new Set(open.value)
  next.has(i) ? next.delete(i) : next.add(i)
  open.value = next
}
</script>

<template>
  <section id="experience" class="band">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">03</span>
        <span class="band__name">{{ t.experience.kicker }}</span>
        <span class="data band__aside">{{ t.experience.total }}</span>
      </div>

      <h2 class="headline exp__title" v-reveal>{{ t.experience.heading }}</h2>

      <div class="register">
        <!-- Заголовок реестра: виден только на широкой полосе -->
        <div class="register__head" aria-hidden="true">
          <span class="label">{{ t.experience.colPeriod }}</span>
          <span class="label">{{ t.experience.colPlace }}</span>
          <span class="label">{{ t.experience.colWhat }}</span>
        </div>

        <article
          v-for="(job, i) in t.experience.jobs"
          :key="job.company"
          class="row"
          :class="{ 'is-open': open.has(i), 'is-current': job.current }"
          v-reveal="i * 50"
        >
          <div class="row__grid">
            <p class="row__period data">
              {{ job.period }}
              <span v-if="job.current" class="row__now">{{ t.experience.now }}</span>
            </p>

            <div class="row__place">
              <h3 class="title row__company">{{ job.company }}</h3>
              <p class="row__role">{{ job.role }}</p>
              <p class="row__loc data">
                {{ job.location }}
                <a
                  v-if="job.site"
                  class="link row__site"
                  :href="`https://${job.site}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ job.site }}</a
                >
              </p>
            </div>

            <div class="row__what">
              <p class="serif row__summary">{{ job.summary }}</p>
              <p v-if="job.highlight" class="row__highlight">
                <span class="marker">{{ job.highlight }}</span>
              </p>

              <button
                class="row__toggle"
                :aria-expanded="open.has(i)"
                :aria-controls="`job-${i}`"
                @click="toggle(i)"
              >
                <span>{{ open.has(i) ? t.experience.collapse : t.experience.expand }}</span>
                <AppIcon :name="open.has(i) ? 'close' : 'plus'" :size="13" />
              </button>

              <div :id="`job-${i}`" class="row__details" :hidden="!open.has(i)">
                <ol class="tasks">
                  <li v-for="(b, bi) in job.bullets" :key="b" class="task">
                    <span class="task__num data">{{ String(bi + 1).padStart(2, '0') }}</span>
                    <span class="task__text">{{ b }}</span>
                  </li>
                </ol>

                <div v-if="job.clients" class="clients">
                  <p class="label clients__label">{{ t.experience.clientsNote }}</p>
                  <p class="clients__list data">
                    <span v-for="(c, ci) in job.clients" :key="c">
                      <span v-if="ci > 0" class="clients__sep" aria-hidden="true"> · </span>{{ c }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.band__aside {
  font-size: 0.6875rem;
  color: var(--ink-3);
  text-align: right;
}

.exp__title {
  max-width: 18ch;
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
}

.register {
  border-top: var(--rule-bold) solid var(--ink);
}

.register__head {
  display: none;
  gap: 2rem;
  padding: 0.55rem 0;
  border-bottom: var(--rule) solid var(--line);

  @include up($bp-lg) {
    display: grid;
    grid-template-columns: 12rem 16rem minmax(0, 1fr);
  }
}

.row {
  border-bottom: var(--rule) solid var(--line);
  transition: background-color var(--dur-fast) var(--ease);

  &:hover {
    background: var(--paper-2);
  }

  &.is-open {
    background: var(--paper-2);
  }
}

.row__grid {
  display: grid;
  gap: 0.6rem 2rem;
  padding: clamp(1rem, 2.5vw, 1.5rem) 0;

  @include up($bp-lg) {
    grid-template-columns: 12rem 16rem minmax(0, 1fr);
  }
}

/* Текущее место помечено вермильонной линейкой на левом поле. */
.row.is-current .row__grid {
  box-shadow: inset 3px 0 0 var(--accent);
  padding-left: 0.9rem;

  @include up($bp-lg) {
    padding-left: 1rem;
    margin-left: -1rem;
  }
}

.row__period {
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.row__now {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.05rem 0.35rem;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.5625rem;
  letter-spacing: 0.1em;
}

.row__role {
  margin-top: 0.2rem;
  font-size: 0.875rem;
  color: var(--ink-2);
}

.row__loc {
  margin-top: 0.25rem;
  font-size: 0.6875rem;
  color: var(--ink-3);
}

.row__site {
  margin-left: 0.5rem;
}

.row__summary {
  max-width: 58ch;
  font-size: 1rem;
}

.row__highlight {
  margin-top: 0.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.row__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.9rem;
  padding-bottom: 1px;
  border-bottom: var(--rule) solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);

  &:hover {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }
}

.row__details {
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: var(--rule) solid var(--line);
}

.tasks {
  display: grid;
  gap: 0.55rem;
  max-width: 66ch;
}

.task {
  display: flex;
  gap: 0.7rem;
  font-size: 0.9375rem;
  color: var(--ink-2);
}

.task__num {
  flex: none;
  font-size: 0.625rem;
  color: var(--accent);
  padding-top: 0.35em;
}

.clients {
  margin-top: 1.35rem;
  padding-top: 0.9rem;
  border-top: var(--rule) solid var(--line-soft);
}

.clients__label {
  margin-bottom: 0.4rem;
}

/* Клиенты — сплошной набор через интерпункт, как строка титров. */
.clients__list {
  font-size: 0.75rem;
  line-height: 1.7;
  color: var(--ink-2);
}

.clients__sep {
  color: var(--accent);
}
</style>
