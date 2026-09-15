import { computed, ref, watch } from 'vue'
import type { Content } from '@/content/types'
import { ru } from '@/content/ru'
import { en } from '@/content/en'

export type Locale = 'ru' | 'en'

const dictionaries: Record<Locale, Content> = { ru, en }
const STORAGE_KEY = 'aa.locale'

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ru' || saved === 'en') return saved
  } catch {
    /* приватный режим — читаем язык браузера */
  }
  const browser = navigator.language?.toLowerCase() ?? ''
  // Русский — язык по умолчанию для KZ/RU/UA-аудитории, английский — для всех остальных.
  return browser.startsWith('en') ? 'en' : 'ru'
}

const locale = ref<Locale>(detectLocale())

watch(
  locale,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* не критично: язык просто не запомнится */
    }
    document.documentElement.lang = value
    const c = dictionaries[value]
    document.title = c.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', c.meta.description)
  },
  { immediate: true },
)

export function useI18n() {
  return {
    locale,
    t: computed(() => dictionaries[locale.value]),
    setLocale: (value: Locale) => {
      locale.value = value
    },
    toggleLocale: () => {
      locale.value = locale.value === 'ru' ? 'en' : 'ru'
    },
  }
}
