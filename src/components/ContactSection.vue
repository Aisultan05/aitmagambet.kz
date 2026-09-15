<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/composables/useI18n'
import { sendMessage } from '@/api/contact'

/** Бланк заявки: поля на подчёркиваниях, подписи в моно, печатная кнопка.
 *  Уходит мне в Telegram через Bot API — токен остаётся на сервере. */

const { t } = useI18n()

type Status = 'idle' | 'sending' | 'sent'

const form = reactive({ name: '', contact: '', topic: '', message: '' })
const errors = reactive<Record<string, string>>({})
const status = ref<Status>('idle')
const serverError = ref('')

/** Момент открытия формы — по нему считаем, не бот ли отправил её мгновенно. */
let openedAt = Date.now()

const topics = computed(() => t.value.contact.form.topics)

function validate(): boolean {
  const e = t.value.contact.form.errors
  for (const key of Object.keys(errors)) delete errors[key]

  if (form.name.trim().length < 2) errors.name = e.name
  const contact = form.contact.trim()
  const digits = contact.replace(/\D+/g, '')
  const isPhone = digits.length >= 10 && digits.length <= 15
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)
  if (!isPhone && !isEmail) errors.contact = e.contact
  if (form.message.trim().length < 10) errors.message = e.message

  return Object.keys(errors).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) {
    // Фокус на первое проблемное поле — иначе на мобильном ошибку не видно.
    const first = Object.keys(errors)[0]
    document.getElementById(`f-${first}`)?.focus()
    return
  }

  status.value = 'sending'

  const result = await sendMessage(
    {
      name: form.name.trim(),
      contact: form.contact.trim(),
      topic: form.topic || topics.value[0],
      message: form.message.trim(),
    },
    Math.round((Date.now() - openedAt) / 1000),
  )

  if (result.ok) {
    status.value = 'sent'
    return
  }

  status.value = 'idle'
  const e = t.value.contact.form.errors
  serverError.value =
    result.kind === 'rate'
      ? e.rate
      : result.kind === 'config'
        ? e.notConfigured
        : result.kind === 'network'
          ? e.network
          : e.generic

  if (result.fields) {
    // Сервер валидирует те же поля независимо от клиента.
    for (const [field, code] of Object.entries(result.fields)) {
      if (field in e && code) errors[field] = e[field as keyof typeof e]
    }
  }
}

function reset() {
  form.name = ''
  form.contact = ''
  form.topic = ''
  form.message = ''
  serverError.value = ''
  status.value = 'idle'
  openedAt = Date.now()
}

onMounted(() => {
  openedAt = Date.now()
  form.topic = topics.value[0]
})
</script>

<template>
  <section id="contact" class="band">
    <div class="shell">
      <div class="band__head">
        <span class="band__num">09</span>
        <span class="band__name">{{ t.contact.kicker }}</span>
      </div>

      <div class="ct">
        <div class="ct__left">
          <h2 class="headline ct__title" v-reveal>{{ t.contact.heading }}</h2>
          <p class="lead-serif ct__lead" v-reveal="60">{{ t.contact.lead }}</p>

          <dl class="chan" v-reveal="90">
            <div v-for="ch in t.contact.channels" :key="ch.id" class="chan__row">
              <dt class="chan__key">{{ ch.label }}</dt>
              <dd class="chan__val">
                <a
                  class="link"
                  :href="ch.href"
                  :target="ch.id === 'email' ? undefined : '_blank'"
                  :rel="ch.id === 'email' ? undefined : 'noopener noreferrer'"
                >
                  {{ ch.value }}
                </a>
              </dd>
            </div>
            <div class="chan__row chan__row--note">
              <dt class="chan__key">tel</dt>
              <dd class="chan__val chan__val--muted">{{ t.contact.phoneNote }}</dd>
            </div>
          </dl>

          <ol class="steps" v-reveal="120">
            <li class="steps__title label">{{ t.contact.process.title }}</li>
            <li v-for="(step, i) in t.contact.process.steps" :key="step.title" class="step">
              <span class="step__num">{{ i + 1 }}</span>
              <span class="step__body">
                <span class="step__head">{{ step.title }}</span>
                <span class="step__text">{{ step.text }}</span>
              </span>
            </li>
          </ol>
        </div>

        <!-- Бланк -->
        <div class="blank" v-reveal="60">
          <div class="blank__head">
            <p class="blank__title">{{ t.contact.form.title }}</p>
            <p class="blank__sub label">{{ t.contact.form.subtitle }}</p>
          </div>

          <div v-if="status === 'sent'" class="done">
            <p class="done__stamp">{{ t.contact.form.ok.title }}</p>
            <p class="serif done__text">{{ t.contact.form.ok.text }}</p>
              <button class="btn btn--sm" @click="reset">{{ t.contact.form.ok.again }}</button>
          </div>

          <form v-else class="form" novalidate @submit.prevent="submit">
            <div class="fld">
              <label class="fld__label" for="f-name">{{ t.contact.form.name }}</label>
              <input
                id="f-name"
                v-model="form.name"
                class="fld__input"
                :class="{ 'has-error': errors.name }"
                type="text"
                name="name"
                autocomplete="name"
                :placeholder="t.contact.form.namePlaceholder"
                :aria-invalid="Boolean(errors.name)"
                :aria-describedby="errors.name ? 'e-name' : undefined"
              />
              <p v-if="errors.name" id="e-name" class="fld__err">{{ errors.name }}</p>
            </div>

            <div class="fld">
              <label class="fld__label" for="f-contact">{{ t.contact.form.contactField }}</label>
              <input
                id="f-contact"
                v-model="form.contact"
                class="fld__input"
                :class="{ 'has-error': errors.contact }"
                type="text"
                name="contact"
                autocomplete="tel"
                inputmode="tel"
                :placeholder="t.contact.form.contactPlaceholder"
                :aria-invalid="Boolean(errors.contact)"
                :aria-describedby="errors.contact ? 'e-contact' : 'h-contact'"
              />
              <p v-if="errors.contact" id="e-contact" class="fld__err">{{ errors.contact }}</p>
              <p v-else id="h-contact" class="fld__hint">{{ t.contact.form.contactHint }}</p>
            </div>

            <div class="fld">
              <span class="fld__label">{{ t.contact.form.topic }}</span>
              <div class="topics" role="radiogroup" :aria-label="t.contact.form.topic">
                <button
                  v-for="topic in topics"
                  :key="topic"
                  type="button"
                  class="topic"
                  :class="{ 'is-active': form.topic === topic }"
                  role="radio"
                  :aria-checked="form.topic === topic"
                  @click="form.topic = topic"
                >
                  {{ topic }}
                </button>
              </div>
            </div>

            <div class="fld">
              <label class="fld__label" for="f-message">{{ t.contact.form.message }}</label>
              <textarea
                id="f-message"
                v-model="form.message"
                class="fld__input fld__input--area"
                :class="{ 'has-error': errors.message }"
                name="message"
                rows="3"
                :placeholder="t.contact.form.messagePlaceholder"
                :aria-invalid="Boolean(errors.message)"
                :aria-describedby="errors.message ? 'e-message' : undefined"
              />
              <p v-if="errors.message" id="e-message" class="fld__err">{{ errors.message }}</p>
            </div>

            <!-- Ловушка для ботов: спрятана и от глаз, и от скринридеров. -->
            <div class="honeypot" aria-hidden="true">
              <label for="f-website">Website</label>
              <input id="f-website" type="text" name="website" tabindex="-1" autocomplete="off" />
            </div>

            <p v-if="serverError" class="form__err" role="alert">{{ serverError }}</p>

            <button class="btn btn--solid form__submit" type="submit" :disabled="status === 'sending'">
              <AppIcon name="send" :size="15" />
              {{ status === 'sending' ? t.contact.form.sending : t.contact.form.submit }}
            </button>

            <p class="form__consent">{{ t.contact.form.consent }}</p>

            <a
              class="link form__direct"
              :href="t.contact.channels.find((c) => c.id === 'telegram')?.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.contact.form.directLink }}
            </a>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ct {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  align-items: start;

  /* Доли, а не фиксированные 24rem: колонка в rem растёт вместе
     с --font-scale и на увеличенном шрифте выдавливает левую половину.
     Из-за этого порог когда-то подняли до 1280px, и бланк уезжал вниз
     на ноутбучных ширинах — теперь две колонки начинаются с 1024px. */
  @include up($bp-lg) {
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  }
}

.ct__title {
  max-width: 16ch;
}

.ct__lead {
  max-width: 48ch;
  margin-top: 1.25rem;
  color: var(--ink-2);
}

/* ---- Каналы ---- */
.chan {
  margin-top: clamp(1.75rem, 4vw, 2.5rem);
  border-top: var(--rule-bold) solid var(--ink);
  max-width: 32rem;
}

.chan__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: var(--rule) solid var(--line);
}

.chan__key {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  flex: none;
}

.chan__val {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-align: right;
}

.chan__val--muted {
  color: var(--ink-3);
}

.chan__row--note {
  border-bottom: 0;
}

/* ---- Что дальше ---- */
.steps {
  margin-top: clamp(1.75rem, 4vw, 2.5rem);
  max-width: 36rem;
}

.steps__title {
  padding-bottom: 0.5rem;
  border-bottom: var(--rule) solid var(--ink);
}

.step {
  display: flex;
  gap: 0.85rem;
  padding: 0.7rem 0;
  border-bottom: var(--rule) solid var(--line-soft);
}

.step__num {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent);
  padding-top: 0.25em;
}

.step__head {
  display: block;
  font-weight: 600;
  font-size: 0.9375rem;
}

.step__text {
  display: block;
  margin-top: 0.15rem;
  font-family: var(--font-serif);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink-3);
}

/* ---- Бланк ---- */
.blank {
  background: var(--paper-2);
  border: var(--rule) solid var(--ink);
  padding: 1.35rem;

  @include up($bp-lg) {
    position: sticky;
    top: 4rem;
  }
}

.blank__head {
  padding-bottom: 0.8rem;
  margin-bottom: 1.25rem;
  border-bottom: var(--rule-bold) solid var(--ink);
}

.blank__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.blank__sub {
  margin-top: 0.3rem;
  color: var(--accent);
}

.fld {
  margin-bottom: 1.15rem;
}

.fld__label {
  display: block;
  margin-bottom: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
}

/* Поле — линия для заполнения, а не бокс со скруглением. */
.fld__input {
  width: 100%;
  padding: 0.4rem 0;
  border: 0;
  border-bottom: var(--rule) solid var(--ink);
  background: transparent;
  color: var(--ink);
  font-size: 0.9375rem;
  transition: border-color var(--dur-fast) var(--ease);

  &::placeholder {
    color: var(--ink-3);
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-bottom-width: var(--rule-bold);
    border-bottom-color: var(--accent);
  }

  &.has-error {
    border-bottom-color: var(--danger);
  }
}

.fld__input--area {
  border: var(--rule) solid var(--ink);
  padding: 0.5rem 0.6rem;
  resize: vertical;
  min-height: 5rem;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    border-width: var(--rule);
    border-color: var(--accent);
  }
}

.fld__hint,
.fld__err {
  margin-top: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  line-height: 1.4;
}

.fld__hint {
  color: var(--ink-3);
}

.fld__err {
  color: var(--danger);
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.topic {
  padding: 0.3rem 0.55rem;
  border: var(--rule) solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--ink-2);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);

  &:hover {
    border-color: var(--ink);
  }

  &.is-active {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.form__err {
  margin-bottom: 0.9rem;
  padding: 0.6rem 0.7rem;
  border-left: 3px solid var(--danger);
  background: var(--paper-3);
  font-size: 0.8125rem;
  color: var(--danger);
}

.form__submit {
  width: 100%;
}

.form__consent {
  margin-top: 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  line-height: 1.45;
  color: var(--ink-3);
}

.form__direct {
  display: inline-block;
  margin-top: 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
}

/* ---- Отправлено ---- */
.done {
  padding: 0.5rem 0 0.25rem;
}

/* Штамп «принято» — вермильон, разрядка, рамка. */
.done__stamp {
  display: inline-block;
  padding: 0.35rem 0.7rem;
  border: var(--rule-bold) solid var(--accent);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transform: rotate(-2deg);
}

.done__text {
  margin-top: 1.1rem;
  font-size: 0.9375rem;
}

.done__extra {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.8rem;
  font-size: 0.6875rem;
  color: var(--accent);
}

.done .btn {
  margin-top: 1.25rem;
}
</style>
