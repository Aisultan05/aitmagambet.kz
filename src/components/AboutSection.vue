<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

/** Журнальная полоса: буквица, серифный текст и маргиналии на внешнем поле.
 *  Раньше здесь стоял псевдотерминал — приём, который встречается
 *  в каждом втором сгенерированном портфолио. */

const { t } = useI18n()
</script>

<template>
  <section id="about" class="band">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">01</span>
        <span class="band__name">{{ t.about.kicker }}</span>
      </div>

      <div class="profile">
        <div class="profile__main">
          <h2 class="headline profile__title" v-reveal>{{ t.about.heading }}</h2>

          <div class="profile__text" v-reveal="80">
            <p class="serif profile__first">{{ t.about.paragraphs[0] }}</p>
            <p v-for="p in t.about.paragraphs.slice(1)" :key="p" class="serif profile__p">
              {{ p }}
            </p>
          </div>
        </div>

        <!-- Маргиналии: данные на внешнем поле, как сноски в книге -->
        <aside class="margin" v-reveal="140">
          <p class="label margin__label">{{ t.about.marginTitle }}</p>
          <dl class="margin__list">
            <div v-for="fact in t.about.facts" :key="fact.label" class="margin__row">
              <dt class="margin__key">{{ fact.label }}</dt>
              <dd class="margin__val">{{ fact.value }}</dd>
            </div>
          </dl>

          <p class="margin__note serif">{{ t.about.marginNote }}</p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);

  @include up($bp-lg) {
    /* Узкая правая колонка — поле для маргиналий. */
    grid-template-columns: minmax(0, 1fr) 15rem;
  }
}

.profile__title {
  max-width: 20ch;
  margin-bottom: clamp(1.5rem, 3.5vw, 2.25rem);
}

.profile__text {
  @include up($bp-md) {
    @include columns(2, 2.5rem);
  }
}

.profile__first {
  @include dropcap(3);
  color: var(--ink);
}

.profile__p {
  margin-top: 1rem;
}

/* ---- Маргиналии ---- */
.margin {
  @include up($bp-lg) {
    border-left: var(--rule) solid var(--line);
    padding-left: 1.5rem;
  }
}

.margin__label {
  padding-bottom: 0.5rem;
  border-bottom: var(--rule) solid var(--ink);
}

.margin__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: var(--rule) solid var(--line-soft);
}

.margin__key {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  flex: none;
}

.margin__val {
  font-size: 0.8125rem;
  text-align: right;
  color: var(--ink);
}

.margin__note {
  margin-top: 1.25rem;
  font-size: 0.9375rem;
  font-style: italic;
  color: var(--ink-3);
}
</style>
