import { reactive, watch } from 'vue'

/** Режим доступности — тот же набор настроек, что я делал для госпортала:
 *  контраст, масштаб шрифта, интервалы, отключение анимации и изображений.
 *  Всё держится на CSS-переменных и data-атрибутах <html>, поэтому работает
 *  и для контента, который отрисуется позже. */

export type Contrast = 'day' | 'night' | 'high'

export interface A11yState {
  /** Панель открыта. Не сохраняем — это состояние интерфейса, а не настройка. */
  panelOpen: boolean
  contrast: Contrast
  /** Масштаб шрифта в процентах: 100 / 115 / 130 / 140. */
  fontScale: number
  /** 0 — обычные интервалы, 1 — увеличенные, 2 — максимальные. */
  spacing: number
  motion: boolean
  images: boolean
}

const STORAGE_KEY = 'aa.a11y'

const defaults: A11yState = {
  panelOpen: false,
  contrast: 'day',
  fontScale: 100,
  spacing: 0,
  motion: true,
  images: true,
}

function load(): A11yState {
  const prefersReduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  const state: A11yState = { ...defaults, motion: !prefersReduced }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return state
    const saved = JSON.parse(raw) as Partial<A11yState>
    if (saved.contrast === 'day' || saved.contrast === 'night' || saved.contrast === 'high') {
      state.contrast = saved.contrast
    }
    if (typeof saved.fontScale === 'number') {
      state.fontScale = Math.min(140, Math.max(100, saved.fontScale))
    }
    if (typeof saved.spacing === 'number') state.spacing = Math.min(2, Math.max(0, saved.spacing))
    if (typeof saved.motion === 'boolean') state.motion = saved.motion
    if (typeof saved.images === 'boolean') state.images = saved.images
  } catch {
    /* повреждённый или недоступный localStorage — работаем на значениях по умолчанию */
  }
  return state
}

const state = reactive<A11yState>(load())

function apply() {
  const root = document.documentElement
  root.dataset.contrast = state.contrast
  root.dataset.spacing = String(state.spacing)
  root.dataset.motion = state.motion ? 'on' : 'off'
  root.dataset.images = state.images ? 'on' : 'off'
  root.style.setProperty('--font-scale', String(state.fontScale / 100))
  // Атрибутом, а не только переменной: media-запрос не умеет читать
  // custom property, а шапке нужно схлопнуться в бургер на крупном шрифте.
  root.dataset.fontscale = String(state.fontScale)
  // Признак «режим отличается от дефолта» — по нему подсвечиваем кнопку в шапке.
  root.dataset.a11yActive = String(
    state.contrast !== 'day' ||
      state.fontScale !== 100 ||
      state.spacing !== 0 ||
      !state.motion ||
      !state.images,
  )
}

watch(
  state,
  () => {
    apply()
    try {
      const { panelOpen: _panelOpen, ...persisted } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      /* не критично: настройки просто не переживут перезагрузку */
    }
  },
  { deep: true, immediate: true },
)

export function useA11y() {
  return {
    a11y: state,
    isActive: () => document.documentElement.dataset.a11yActive === 'true',
    togglePanel: () => {
      state.panelOpen = !state.panelOpen
    },
    openPanel: () => {
      state.panelOpen = true
    },
    closePanel: () => {
      state.panelOpen = false
    },
    /** Быстрое включение «как для слабовидящего» — одной кнопкой из секции о доступности. */
    enableLowVision: () => {
      state.contrast = 'high'
      state.fontScale = 130
      state.spacing = 1
      state.motion = false
      state.panelOpen = true
    },
    reset: () => {
      state.contrast = defaults.contrast
      state.fontScale = defaults.fontScale
      state.spacing = defaults.spacing
      state.motion = defaults.motion
      state.images = defaults.images
    },
  }
}
