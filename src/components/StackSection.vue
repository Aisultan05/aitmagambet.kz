<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

/** Карта плотности вместо чипов: кегль слова = уровень владения.
 *  Три полосы с моно-подписью на внешнем поле, чтобы размер был
 *  дополнением к явной подписи, а не единственным способом её прочесть. */

const { t } = useI18n()
</script>

<template>
  <section id="stack" class="band band--tint">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">02</span>
        <span class="band__name">{{ t.stack.kicker }}</span>
      </div>

      <h2 class="headline stack__title" v-reveal>{{ t.stack.heading }}</h2>
      <p class="lead-serif stack__intro" v-reveal="60">{{ t.stack.intro }}</p>

      <div class="map">
        <section
          v-for="(group, i) in t.stack.groups"
          :key="group.id"
          class="tier"
          :class="`tier--${group.id}`"
          v-reveal="i * 80"
        >
          <div class="tier__side">
            <h3 class="tier__label">{{ group.title }}</h3>
            <p class="tier__note">{{ group.note }}</p>
          </div>

          <ul class="tier__terms">
            <li v-for="item in group.items" :key="item" class="term">{{ item }}</li>
          </ul>
        </section>

        <!-- Отрицательное заявление — такая же часть спецификации -->
        <section class="tier tier--none" v-reveal>
          <div class="tier__side">
            <h3 class="tier__label">{{ t.stack.honesty.title }}</h3>
            <p class="tier__note">{{ t.stack.honesty.text }}</p>
          </div>

          <ul class="tier__terms">
            <li v-for="item in t.stack.honesty.items" :key="item" class="term term--struck">
              {{ item }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stack__title {
  max-width: 18ch;
}

.stack__intro {
  max-width: 60ch;
  margin-top: 1.25rem;
  color: var(--ink-2);
}

.map {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  border-top: var(--rule) solid var(--ink);
}

.tier {
  display: grid;
  gap: 0.75rem 2rem;
  padding: clamp(1.25rem, 3vw, 2rem) 0;
  border-bottom: var(--rule) solid var(--line);

  @include up($bp-md) {
    grid-template-columns: 11rem minmax(0, 1fr);
  }
}

.tier__label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.tier__note {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--ink-3);
}

.tier__terms {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15em 0.7em;
}

.term {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  line-height: 1.12;
  transition: color var(--dur-fast) var(--ease);
  cursor: default;

  &:hover {
    color: var(--accent);
  }
}

/* Кегль по уровню: то, что в продакшене каждый день, читается первым. */
.tier--daily .term {
  @include fluid(font-size, 19, 31);
  font-weight: 700;
  color: var(--ink);
}

.tier--confident .term {
  @include fluid(font-size, 15, 19);
  font-weight: 500;
  color: var(--ink-2);
}

.tier--tools .term {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--ink-3);
}

.tier--none {
  border-bottom: 0;

  .term--struck {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--ink-3);
    text-decoration: line-through;
    text-decoration-color: var(--danger);
    text-decoration-thickness: 1px;

    &:hover {
      color: var(--ink-3);
    }
  }

  .tier__label {
    color: var(--ink-3);
  }
}
</style>
