<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'

/** Мастхед печатного издания: датлайн, имя во всю полосу, лид в серифе
 *  и реестр цифр под жирной линейкой. Ни печатающегося текста,
 *  ни свечения под курсором — здесь работает только типографика. */

const { t } = useI18n()

/** Имя разбито на строки вручную: автоперенос на таком кегле
 *  ломает ритм мастхеда. */
const nameLines = () => t.value.hero.name.split(' ')

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section id="top" class="mast">
    <div class="shell">
      <!-- Датлайн: как строка выпуска над названием газеты -->
      <div class="dateline">
        <span class="dateline__item">{{ t.hero.eyebrow }}</span>
        <span class="dateline__item dateline__item--mid">{{ t.hero.issue }}</span>
        <span class="dateline__item dateline__item--end">
          <span class="dot" aria-hidden="true" />
          {{ t.hero.availability }}
        </span>
      </div>

      <div class="mast__namebox">
        <h1 class="mast__name masthead-type">
          <span v-for="(line, i) in nameLines()" :key="line" class="mast__line" :style="{ '--i': i }">
            {{ line }}
          </span>
        </h1>
      </div>

      <p class="mast__roles">
        <span v-for="(role, i) in t.hero.roles" :key="role" class="mast__role">
          <span v-if="i > 0" class="mast__bullet" aria-hidden="true">·</span>{{ role }}
        </span>
      </p>

      <hr class="rule rule--bold mast__rule" />

      <!-- Полоса лида: слева заявление, справа абзац в серифе -->
      <div class="mast__body">
        <div class="mast__claim">
          <p class="headline--sm mast__claim-text">{{ t.hero.lead }}</p>
          <div class="mast__actions">
            <button class="btn btn--solid" @click="go('contact')">
              {{ t.hero.ctaPrimary }}
              <AppIcon name="arrow-right" :size="16" />
            </button>
            <button class="btn" @click="go('projects')">{{ t.hero.ctaSecondary }}</button>
          </div>
        </div>

        <p class="lead-serif mast__lead">{{ t.hero.tagline }}</p>
      </div>
    </div>

    <!-- Реестр цифр: годовой отчёт, а не «карточки статистики» -->
    <div class="ledger">
      <div class="shell ledger__inner">
        <div v-for="(m, i) in t.hero.metrics" :key="m.label" class="ledger__cell">
          <span class="ledger__idx label">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="figure ledger__value">{{ m.value }}</p>
          <p class="ledger__label">{{ m.label }}</p>
          <p v-if="m.hint" class="ledger__hint data">{{ m.hint }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.mast {
  padding-top: clamp(1.5rem, 5vh, 3rem);
}

/* ---- Датлайн ---- */
.dateline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.25rem;
  padding-bottom: 0.55rem;
  border-bottom: var(--rule) solid var(--ink);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.dateline__item--mid {
  color: var(--accent);
}

.dateline__item--end {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;

  @include up($bp-md) {
    margin-left: auto;
  }
}

.dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--ok);
  flex: none;
}

/* ---- Имя ---- */

/* Кегль имени считается от ширины полосы набора, а не от окна: полоса
   упирается в max-width 1180px, а vw продолжает расти — из-за этого
   на увеличенном шрифте «AITMAGAMBETULY» вылезало за край.
   cqw знает реальную ширину контейнера, поэтому запас держится всегда. */
.mast__namebox {
  container-type: inline-size;
}

.mast__namebox .mast__name {
  font-size: min(clamp(2.75rem, 2.75rem + 72 * ((100vw - 380px) / 900), 7.25rem), 9.6cqw);
}

.mast__name {
  display: flex;
  flex-direction: column;
  margin-top: clamp(0.75rem, 2vw, 1.5rem);
  /* Строки набраны вплотную, поэтому переносы внутри слова запрещены. */
  overflow-wrap: normal;
  hyphens: none;
}

.mast__line {
  display: block;
  animation: rise 0.85s var(--ease) backwards;
  animation-delay: calc(var(--i) * 90ms);
}

/* Вторая строка сдвинута вправо — асимметрия вместо центровки. */
.mast__line:nth-child(2) {
  align-self: flex-end;
  color: var(--accent);
}

.mast__roles {
  display: flex;
  flex-wrap: wrap;
  margin-top: clamp(0.75rem, 2vw, 1.25rem);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.mast__bullet {
  color: var(--accent);
  margin-inline: 0.5rem;
}

.mast__rule {
  margin-top: clamp(1.25rem, 3vw, 2rem);
}

/* ---- Полоса лида ---- */
.mast__body {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding-top: clamp(1.5rem, 3.5vw, 2.5rem);

  @include up($bp-lg) {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }
}

.mast__claim-text {
  max-width: 22ch;
}

.mast__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: clamp(1.25rem, 3vw, 2rem);
}

.mast__lead {
  max-width: 52ch;
  color: var(--ink-2);

  @include up($bp-lg) {
    padding-left: 2.25rem;
    border-left: var(--rule) solid var(--line);
  }
}

/* ---- Реестр цифр ---- */
.ledger {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
  border-top: var(--rule-bold) solid var(--ink);
  border-bottom: var(--rule) solid var(--ink);
  background: var(--paper-2);
}

.ledger__inner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @include up($bp-lg) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.ledger__cell {
  display: flex;
  flex-direction: column;
  padding: clamp(1rem, 2.5vw, 1.6rem) 0;

  /* Вертикальные волосяные линейки как в таблице отчёта.
     Правый край полосы линейку не получает. */
  @include up($bp-lg) {
    padding-inline: clamp(0.75rem, 2vw, 1.5rem);

    &:first-child {
      padding-left: 0;
    }
    &:not(:last-child) {
      border-right: var(--rule) solid var(--line);
    }
  }

  @include down($bp-lg) {
    &:nth-child(odd) {
      padding-right: 1rem;
      border-right: var(--rule) solid var(--line);
    }
    &:nth-child(even) {
      padding-left: 1rem;
    }
    &:nth-child(-n + 2) {
      border-bottom: var(--rule) solid var(--line);
    }
  }
}

.ledger__idx {
  display: block;
  font-size: 0.625rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

/* Кегль ниже общего .figure: длинное значение вроде «1 г 10 мес»
   должно переноситься внутри ячейки, а не выдавливать подпись. */
.ledger__value {
  @include fluid(font-size, 26, 42);
  color: var(--ink);
}

.ledger__label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.3;
  color: var(--ink-2);
}

.ledger__hint {
  margin-top: auto;
  padding-top: 0.3rem;
  font-size: 0.625rem;
  color: var(--ink-3);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(0.35em);
  }
}
</style>
