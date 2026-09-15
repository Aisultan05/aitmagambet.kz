import type { Directive } from 'vue'

/** v-reveal — появление блока при попадании в вьюпорт.
 *  Один общий IntersectionObserver на всю страницу вместо одного на элемент. */

let observer: IntersectionObserver | null = null

function ensureObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  )
  return observer
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    // При отключённой анимации показываем сразу — нечего «проявлять».
    if (document.documentElement.dataset.motion === 'off') {
      el.classList.add('is-revealed')
      return
    }
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)

    const io = ensureObserver()
    if (io) io.observe(el)
    else el.classList.add('is-revealed')
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

/** Отслеживание активной секции для подсветки в навигации. */
export function watchActiveSection(ids: string[], onChange: (id: string) => void): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {}

  const visible = new Map<string, number>()

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
      }
      let best = ''
      let bestRatio = 0
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) {
          best = id
          bestRatio = ratio
        }
      }
      if (best) onChange(best)
    },
    { threshold: [0, 0.15, 0.35, 0.6], rootMargin: '-15% 0px -45% 0px' },
  )

  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  }
  return () => io.disconnect()
}
