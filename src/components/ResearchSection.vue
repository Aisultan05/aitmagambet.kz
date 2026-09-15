<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'

/** Регистр находок и работ по безопасности: нумерованные записи
 *  с моно-подписями, как в отчёте. Без «карточек с щитом». */

const { t } = useI18n()
</script>

<template>
  <section id="research" class="band band--tint">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">06</span>
        <span class="band__name">{{ t.research.kicker }}</span>
      </div>

      <div class="res__top">
        <h2 class="headline res__title" v-reveal>{{ t.research.heading }}</h2>
        <p class="lead-serif res__lead" v-reveal="60">{{ t.research.lead }}</p>
      </div>

      <ol class="entries">
        <li
          v-for="(item, i) in t.research.items"
          :key="item.title"
          class="entry"
          v-reveal="i * 50"
        >
          <component
            :is="item.href ? 'a' : 'div'"
            class="entry__inner"
            :class="{ 'is-link': item.href }"
            :href="item.href"
            :target="item.href ? '_blank' : undefined"
            :rel="item.href ? 'noopener noreferrer' : undefined"
          >
            <span class="entry__num">{{ String(i + 1).padStart(2, '0') }}</span>

            <span class="entry__tag">{{ item.tag }}</span>

            <span class="entry__main">
              <span class="entry__title title">
                {{ item.title }}
                <AppIcon v-if="item.href" name="external" :size="13" />
              </span>
              <span class="entry__meta data">{{ item.meta }}</span>
              <span class="entry__text serif">{{ item.text }}</span>
            </span>
          </component>
        </li>
      </ol>

      <p class="res__note" v-reveal>{{ t.research.disclaimer }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.res__top {
  display: grid;
  gap: 1.25rem 3rem;

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: end;
  }
}

.res__title {
  max-width: 16ch;
}

.res__lead {
  max-width: 50ch;
  color: var(--ink-2);
}

.entries {
  margin-top: clamp(2rem, 5vw, 3.25rem);
  border-top: var(--rule-bold) solid var(--ink);
}

.entry {
  border-bottom: var(--rule) solid var(--line);
}

.entry__inner {
  display: grid;
  gap: 0.5rem 1.5rem;
  padding: clamp(1rem, 2.5vw, 1.4rem) 0;
  transition: background-color var(--dur-fast) var(--ease);

  @include up($bp-md) {
    grid-template-columns: 2.5rem 9rem minmax(0, 1fr);
    align-items: baseline;
  }
}

.entry__inner:hover {
  background: var(--paper);
}

.entry__num {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent);
}

.entry__tag {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-bottom: 0.15rem;
  border-bottom: var(--rule) solid var(--line);
  justify-self: start;
}

.entry__title {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .icon {
    color: var(--ink-3);
  }
}

.entry__inner.is-link:hover .entry__title {
  color: var(--accent);

  .icon {
    color: var(--accent);
  }
}

.entry__meta {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

.entry__text {
  display: block;
  margin-top: 0.55rem;
  max-width: 68ch;
  font-size: 0.9375rem;
}

/* Оговорка набрана мелко и курсивом — как примечание внизу страницы. */
.res__note {
  margin-top: 1.25rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.875rem;
  color: var(--ink-3);
}
</style>
