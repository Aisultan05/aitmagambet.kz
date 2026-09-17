<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import ProjectModal from './ProjectModal.vue'
import { useI18n } from '@/composables/useI18n'
import type { Project } from '@/content/types'

/** Главная страница отвечает на один вопрос: что сделано и что это дало.
 *  Поэтому развёрнутый разворот только у флагманского кейса, остальные —
 *  строкой с результатом. Подробности лежат во вклейке, а не на полосе:
 *  список задач никого не убеждает, разница состояний убеждает. */

const { t } = useI18n()

const featured = computed<Project | undefined>(() => t.value.projects.items.find((p) => p.featured))
const rest = computed<Project[]>(() => t.value.projects.items.filter((p) => !p.featured))

const openProject = ref<Project | null>(null)
</script>

<template>
  <section id="projects" class="band">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">04</span>
        <span class="band__name">{{ t.projects.kicker }}</span>
      </div>

      <h2 class="headline proj__title" v-reveal>{{ t.projects.heading }}</h2>
      <p class="lead-serif proj__intro" v-reveal="60">{{ t.projects.intro }}</p>
    </div>

    <!-- Флагманский кейс: единственный, кто получает полный разворот -->
    <article v-if="featured" class="lead-case">
      <div class="shell lead-case__inner">
        <div class="lead-case__text" v-reveal>
          <p class="lead-case__meta">
            <span class="lead-case__num">01</span>
            <span class="lead-case__kicker">{{ featured.kicker }}</span>
            <span class="data lead-case__year">{{ featured.year }}</span>
          </p>

          <h3 class="headline--sm lead-case__name">{{ featured.title }}</h3>
          <p class="serif lead-case__summary">{{ featured.summary }}</p>

          <dl v-if="featured.delta" class="delta">
            <div class="delta__row delta__row--before">
              <dt class="delta__tag">
                <span class="delta__sign" aria-hidden="true">−</span>{{ t.projects.before }}
              </dt>
              <dd class="delta__text">{{ featured.delta.before }}</dd>
            </div>
            <div class="delta__row delta__row--after">
              <dt class="delta__tag">
                <span class="delta__sign" aria-hidden="true">+</span>{{ t.projects.after }}
              </dt>
              <dd class="delta__text">{{ featured.delta.after }}</dd>
            </div>
          </dl>

          <ul v-if="featured.metrics" class="figures">
            <li v-for="m in featured.metrics" :key="m.label" class="figures__item">
              <span class="figure figures__value">{{ m.value }}</span>
              <span class="figures__label">{{ m.label }}</span>
            </li>
          </ul>

          <div class="lead-case__actions">
            <button class="btn btn--sm" @click="openProject = featured">
              {{ t.projects.open }}
              <AppIcon name="arrow-right" :size="14" />
            </button>
            <a
              v-for="link in featured.links"
              :key="link.href"
              class="link lead-case__link"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.label }}
              <AppIcon name="external" :size="12" />
            </a>
          </div>
        </div>

        <div class="lead-case__dia" v-reveal="100">
          <figure v-if="featured.image" class="shot">
            <img :src="featured.image" :alt="featured.imageAlt ?? ''" loading="lazy" />
          </figure>
          <p v-if="featured.takeaway" class="lead-case__takeaway serif">{{ featured.takeaway }}</p>
        </div>
      </div>
    </article>

    <!-- Остальные: название и что это дало. Детали — во вклейке -->
    <div class="shell">
      <p class="label more__label">{{ t.projects.moreTitle }}</p>

      <ol class="more">
        <li v-for="(p, i) in rest" :key="p.id" class="more__row" v-reveal="i * 40">
          <button class="more__btn" @click="openProject = p">
            <span class="more__num">{{ String(i + 2).padStart(2, '0') }}</span>

            <span class="more__main">
              <span class="more__name title">{{ p.title }}</span>
              <span class="more__kicker">{{ p.kicker }}</span>
            </span>

            <span class="more__outcome">
              <span class="more__outcome-tag">+ {{ t.projects.outcome }}</span>
              <span class="more__outcome-text">{{ p.delta?.after ?? p.summary }}</span>
            </span>

            <span class="more__go" aria-hidden="true">
              <AppIcon name="arrow-right" :size="15" />
            </span>
          </button>
        </li>
      </ol>
    </div>

    <Teleport to="body">
      <ProjectModal v-if="openProject" :project="openProject" @close="openProject = null" />
    </Teleport>
  </section>
</template>

<style scoped lang="scss">
.proj__title {
  max-width: 16ch;
}

.proj__intro {
  max-width: 58ch;
  margin-top: 1.25rem;
  color: var(--ink-2);
}

/* ---- Флагманский кейс ---- */
.lead-case {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  padding-block: clamp(1.75rem, 4vw, 3rem);
  background: var(--paper-2);
  border-block: var(--rule) solid var(--ink);
}

.lead-case__inner {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.02fr);
  }
}

.lead-case__meta {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: var(--rule) solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lead-case__num {
  color: var(--accent);
  font-weight: 500;
}

.lead-case__kicker {
  color: var(--ink-3);
  margin-right: auto;
}

.lead-case__year {
  font-size: 0.6875rem;
  color: var(--ink-3);
}

.lead-case__name {
  margin-top: 0.9rem;
}

.lead-case__summary {
  margin-top: 0.85rem;
  max-width: 52ch;
}

/* ---- Дельта ---- */
.delta {
  margin-top: 1.5rem;
  border-top: var(--rule) solid var(--line);
}

.delta__row {
  display: grid;
  gap: 0.2rem 1rem;
  padding: 0.8rem 0;
  border-bottom: var(--rule) solid var(--line-soft);

  @include up($bp-sm) {
    grid-template-columns: 6.5rem minmax(0, 1fr);
  }
}

.delta__tag {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.delta__row--before {
  .delta__tag,
  .delta__text {
    color: var(--ink-3);
  }
}

.delta__row--after {
  .delta__tag {
    color: var(--accent);
  }
  .delta__text {
    color: var(--ink);
    font-weight: 500;
  }
}

.delta__text {
  font-size: 0.9375rem;
  line-height: 1.45;
}

/* ---- Цифры ---- */
.figures {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 2.25rem;
  margin-top: 1.5rem;
}

.figures__value {
  display: block;
  @include fluid(font-size, 24, 34);
  color: var(--ink);
}

.figures__label {
  display: block;
  margin-top: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.lead-case__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.lead-case__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Скриншот в рамке — как иллюстрация в печати, без скруглений и теней. */
.shot {
  margin: 0;
  border: var(--rule) solid var(--ink);
  background: var(--paper-3);

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.lead-case__takeaway {
  margin-top: 0.9rem;
  padding-left: 0.9rem;
  border-left: var(--rule-bold) solid var(--accent);
  font-style: italic;
  font-size: 0.9375rem;
  color: var(--ink-2);
}

/* ---- Остальные кейсы ---- */
.more__label {
  margin-top: clamp(2rem, 4vw, 2.75rem);
  padding-bottom: 0.5rem;
  border-bottom: var(--rule-bold) solid var(--ink);
}

.more__row {
  border-bottom: var(--rule) solid var(--line);
}

/* Вся строка — одна кнопка: цель клика должна совпадать с тем,
   что читается как кликабельное. */
.more__btn {
  display: grid;
  gap: 0.5rem 1.5rem;
  width: 100%;
  padding: clamp(0.9rem, 2vw, 1.25rem) 0;
  text-align: left;
  transition: background-color var(--dur-fast) var(--ease);

  @include up($bp-lg) {
    grid-template-columns: 2.25rem minmax(0, 15rem) minmax(0, 1fr) 1.5rem;
    align-items: baseline;
  }

  &:hover {
    background: var(--paper-2);

    .more__go {
      color: var(--accent);
      transform: translateX(3px);
    }
  }
}

.more__num {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent);
}

.more__name {
  display: block;
}

.more__kicker {
  display: block;
  margin-top: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.more__outcome-tag {
  display: block;
  margin-bottom: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.more__outcome-text {
  display: block;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: var(--ink);
}

.more__go {
  justify-self: end;
  color: var(--ink-3);
  transition: color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);

  @include down($bp-lg) {
    display: none;
  }
}
</style>
