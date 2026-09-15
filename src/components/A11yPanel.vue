<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'
import { useA11y, type Contrast } from '@/composables/useA11y'

const { t } = useI18n()
const { a11y, closePanel, reset } = useA11y()

const panel = ref<HTMLElement | null>(null)

const contrastOptions: { value: Contrast; label: string }[] = [
  { value: 'day', label: 'A' },
  { value: 'night', label: 'A' },
  { value: 'high', label: 'A' },
]

const fontSteps = [100, 115, 130, 140]
const spacingSteps = [0, 1, 2]

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePanel()
}

function onPointerDown(e: PointerEvent) {
  const target = e.target as Node
  if (panel.value?.contains(target)) return
  // Клик по кнопке в шапке обрабатывает она сама — иначе панель дважды переключится.
  if ((target as HTMLElement).closest?.('[aria-expanded]')) return
  closePanel()
}

watch(
  () => a11y.panelOpen,
  (open) => {
    if (!open) return
    // Фокус в панель: режимом должно быть можно управлять с клавиатуры.
    requestAnimationFrame(() => panel.value?.querySelector<HTMLElement>('button')?.focus())
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <Transition name="panel">
    <aside
      v-if="a11y.panelOpen"
      ref="panel"
      class="a11y"
      role="dialog"
      :aria-label="t.a11y.panelTitle"
    >
      <header class="a11y__head">
        <div>
          <h2 class="a11y__title">{{ t.a11y.panelTitle }}</h2>
          <p class="a11y__hint mono">{{ t.a11y.panelHint }}</p>
        </div>
        <button class="a11y__close" :aria-label="t.ui.close" @click="closePanel">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="a11y__row">
        <span class="a11y__label">{{ t.a11y.controls.contrast }}</span>
        <div class="seg" role="group" :aria-label="t.a11y.controls.contrast">
          <button
            v-for="opt in contrastOptions"
            :key="opt.value"
            class="seg__btn"
            :class="[`seg__btn--${opt.value}`, { 'is-active': a11y.contrast === opt.value }]"
            :aria-pressed="a11y.contrast === opt.value"
            :title="opt.value"
            @click="a11y.contrast = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="a11y__row">
        <span class="a11y__label">{{ t.a11y.controls.fontSize }}</span>
        <div class="seg" role="group" :aria-label="t.a11y.controls.fontSize">
          <button
            v-for="step in fontSteps"
            :key="step"
            class="seg__btn seg__btn--text"
            :class="{ 'is-active': a11y.fontScale === step }"
            :aria-pressed="a11y.fontScale === step"
            @click="a11y.fontScale = step"
          >
            {{ step }}%
          </button>
        </div>
      </div>

      <div class="a11y__row">
        <span class="a11y__label">{{ t.a11y.controls.spacing }}</span>
        <div class="seg" role="group" :aria-label="t.a11y.controls.spacing">
          <button
            v-for="step in spacingSteps"
            :key="step"
            class="seg__btn seg__btn--bars"
            :class="{ 'is-active': a11y.spacing === step }"
            :aria-pressed="a11y.spacing === step"
            :aria-label="`${t.a11y.controls.spacing} ${step + 1}`"
            @click="a11y.spacing = step"
          >
            <!-- Полоски только рисуют вариант интервала; клик обрабатывает
                 сама кнопка, иначе он не работает ни с клавиатуры,
                 ни по отступам кнопки. -->
            <span
              v-for="n in 3"
              :key="n"
              class="bars__line"
              :style="{ marginBlock: `${step}px` }"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div class="a11y__row">
        <span class="a11y__label">{{ t.a11y.controls.motion }}</span>
        <button
          class="toggle"
          :class="{ 'is-on': a11y.motion }"
          role="switch"
          :aria-checked="a11y.motion"
          @click="a11y.motion = !a11y.motion"
        >
          <span class="toggle__knob" />
          <span class="toggle__text mono">{{
            a11y.motion ? t.a11y.controls.on : t.a11y.controls.off
          }}</span>
        </button>
      </div>

      <div class="a11y__row">
        <span class="a11y__label">{{ t.a11y.controls.images }}</span>
        <button
          class="toggle"
          :class="{ 'is-on': a11y.images }"
          role="switch"
          :aria-checked="a11y.images"
          @click="a11y.images = !a11y.images"
        >
          <span class="toggle__knob" />
          <span class="toggle__text mono">{{
            a11y.images ? t.a11y.controls.on : t.a11y.controls.off
          }}</span>
        </button>
      </div>

      <button class="a11y__reset" @click="reset">{{ t.a11y.controls.reset }}</button>
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
/* Панель — приложенный к странице листок настроек: прямые углы,
   волосяные линейки, моно-подписи. */
.a11y {
  position: fixed;
  z-index: 130;
  top: 3.1rem;
  right: var(--gutter);
  width: min(19.5rem, calc(100vw - 2 * var(--gutter)));
  padding: 1rem;
  background: var(--paper);
  border: var(--rule) solid var(--ink);
  border-top: 4px solid var(--accent);
  box-shadow: 6px 6px 0 color-mix(in srgb, var(--ink) 12%, transparent);
}

.a11y__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.7rem;
  margin-bottom: 0.3rem;
  border-bottom: var(--rule-bold) solid var(--ink);
}

.a11y__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 0.875rem;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  margin: 0;
}

.a11y__hint {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  color: var(--ink-3);
  margin: 0.2rem 0 0;
}

.a11y__close {
  color: var(--ink-2);

  &:hover {
    color: var(--accent);
  }
}

.a11y__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: var(--rule) solid var(--line-soft);
}

.a11y__label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.seg {
  display: flex;
  border: var(--rule) solid var(--line);
}

.seg__btn {
  display: grid;
  place-items: center;
  min-width: 1.9rem;
  height: 1.6rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--ink-3);
  border-right: var(--rule) solid var(--line);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);

  &:last-child {
    border-right: 0;
  }

  &:hover {
    color: var(--ink);
  }

  &.is-active {
    background: var(--ink);
    color: var(--paper);
  }
}

/* Кнопки контраста показывают саму схему, а не подпись. */
.seg__btn--day {
  background: #f1eee7;
  color: #16150f;
}
.seg__btn--night {
  background: #14130f;
  color: #ece7db;
}
.seg__btn--high {
  background: #000;
  color: #ffe000;
}
.seg__btn--day.is-active,
.seg__btn--night.is-active,
.seg__btn--high.is-active {
  outline: var(--rule-bold) solid var(--accent);
  outline-offset: -3px;
}

.seg__btn--text {
  min-width: 2.6rem;
  font-size: 0.625rem;
}

.seg__btn--bars {
  flex-direction: column;
  justify-content: center;
  gap: 0;
  min-width: 2.1rem;
  height: 1.75rem;
}

.bars__line {
  display: block;
  width: 0.9rem;
  height: 1px;
  background: currentColor;
}

.seg__btn--bars:not(.is-active) .bars__line {
  background: var(--ink-3);
}

/* Тумблер — прямоугольный, печатный. */
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0.5rem 0.15rem 0.15rem;
  border: var(--rule) solid var(--line);
}

.toggle__knob {
  position: relative;
  width: 1.9rem;
  height: 1rem;
  background: var(--line);
  transition: background-color var(--dur-fast) var(--ease);

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(1rem - 4px);
    height: calc(1rem - 4px);
    background: var(--paper);
    transition: transform var(--dur-fast) var(--ease);
  }
}

.toggle.is-on .toggle__knob {
  background: var(--accent);

  &::after {
    transform: translateX(0.9rem);
  }
}

.toggle__text {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  min-width: 1.9rem;
}

.a11y__reset {
  width: 100%;
  margin-top: 0.8rem;
  padding: 0.55rem;
  border: var(--rule-bold) solid var(--ink);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);

  &:hover {
    background: var(--ink);
    color: var(--paper);
  }
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
