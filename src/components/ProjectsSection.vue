<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import SystemDiagram from './SystemDiagram.vue'
import ProjectModal from './ProjectModal.vue'
import { useI18n } from '@/composables/useI18n'
import type { Project } from '@/content/types'

/** Кейсы как развороты, а не сетка карточек: чертёж системы, текст
 *  и главное — дельта «было → стало». Ценность работы измеряется
 *  разницей состояний, поэтому она стоит в самом кейсе, а не в модалке. */

const { t } = useI18n()
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

    <div class="spreads">
      <article
        v-for="(p, i) in t.projects.items"
        :key="p.id"
        class="spread"
        :class="{ 'spread--flip': i % 2 === 1, 'spread--lead': p.featured }"
      >
        <div class="shell spread__inner">
          <div class="spread__text" v-reveal>
            <p class="spread__meta">
              <span class="spread__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="spread__kicker">{{ p.kicker }}</span>
              <span class="spread__year data">{{ p.year }}</span>
            </p>

            <h3 class="headline--sm spread__name">{{ p.title }}</h3>
            <p class="spread__role data">{{ p.role }}</p>
            <p class="serif spread__summary">{{ p.summary }}</p>

            <!-- Дельта: два состояния через диффовые маркеры -->
            <dl v-if="p.delta" class="delta">
              <div class="delta__row delta__row--before">
                <dt class="delta__tag">
                  <span class="delta__sign" aria-hidden="true">−</span>{{ t.projects.before }}
                </dt>
                <dd class="delta__text">{{ p.delta.before }}</dd>
              </div>
              <div class="delta__row delta__row--after">
                <dt class="delta__tag">
                  <span class="delta__sign" aria-hidden="true">+</span>{{ t.projects.after }}
                </dt>
                <dd class="delta__text">{{ p.delta.after }}</dd>
              </div>
            </dl>

            <ul v-if="p.metrics" class="figures">
              <li v-for="m in p.metrics" :key="m.label" class="figures__item">
                <span class="figure figures__value">{{ m.value }}</span>
                <span class="figures__label">{{ m.label }}</span>
              </li>
            </ul>

            <p class="spread__stack data">
              <span v-for="(sTech, si) in p.stack" :key="sTech">
                <span v-if="si > 0" aria-hidden="true"> / </span>{{ sTech }}
              </span>
            </p>

            <div class="spread__actions">
              <button class="btn btn--sm" @click="openProject = p">
                {{ t.projects.open }}
                <AppIcon name="arrow-right" :size="14" />
              </button>
              <a
                v-for="link in p.links"
                :key="link.href"
                class="link spread__link"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ link.label }}
                <AppIcon name="external" :size="12" />
              </a>
            </div>
          </div>

          <div class="spread__dia" v-reveal="100">
            <SystemDiagram :variant="p.id" :image="p.image" :alt="p.imageAlt" />
            <p v-if="p.takeaway" class="spread__takeaway serif">{{ p.takeaway }}</p>
          </div>
        </div>
      </article>
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

.spreads {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  border-top: var(--rule) solid var(--ink);
}

.spread {
  border-bottom: var(--rule) solid var(--line);
  padding-block: clamp(1.75rem, 4vw, 3rem);
}

/* Ведущий кейс на подложке — единственное визуальное выделение. */
.spread--lead {
  background: var(--paper-2);
  border-bottom-color: var(--ink);
}

.spread__inner {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.02fr);
  }
}

/* Чётные развороты переворачиваются — страница не превращается
   в монотонный список одинаковых блоков. */
.spread--flip .spread__inner {
  @include up($bp-lg) {
    .spread__text {
      order: 2;
    }
    .spread__dia {
      order: 1;
    }
  }
}

.spread__meta {
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

.spread__num {
  color: var(--accent);
  font-weight: 500;
}

.spread__kicker {
  color: var(--ink-3);
  margin-right: auto;
}

.spread__year {
  font-size: 0.6875rem;
  color: var(--ink-3);
}

.spread__name {
  margin-top: 0.9rem;
}

.spread__role {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--ink-3);
}

.spread__summary {
  margin-top: 1rem;
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

.delta__sign {
  font-weight: 500;
}

.delta__row--before {
  .delta__tag {
    color: var(--ink-3);
  }
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
  }
}

.delta__text {
  font-size: 0.9375rem;
  line-height: 1.45;
}

/* ---- Цифры кейса ---- */
.figures {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2.25rem;
  margin-top: 1.5rem;
}

.figures__value {
  display: block;
  @include fluid(font-size, 26, 38);
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

.spread__stack {
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  border-top: var(--rule) solid var(--line);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

.spread__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;
}

.spread__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Вывод под чертежом — курсивная выноска, как подпись к иллюстрации. */
.spread__takeaway {
  margin-top: 0.9rem;
  padding-left: 0.9rem;
  border-left: var(--rule-bold) solid var(--accent);
  font-style: italic;
  font-size: 0.9375rem;
  color: var(--ink-2);
}
</style>
