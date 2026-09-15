/** Клиент формы. Единственное место, которое знает про эндпоинт. */

export const WHATSAPP_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/api/whatsapp.php'

/** Ссылка «написать напрямую» идёт через редирект на сервере,
 *  чтобы номер телефона не лежал в разметке и не достался парсерам. */
export const WHATSAPP_DIRECT_URL = `${WHATSAPP_ENDPOINT}?go=wa`

export interface FormPayload {
  name: string
  contact: string
  topic: string
  message: string
}

export type SendErrorKind = 'validation' | 'rate' | 'config' | 'network' | 'server'

export interface SendResult {
  ok: boolean
  kind?: SendErrorKind
  /** Ошибки по полям, когда сервер их вернул. */
  fields?: Record<string, string>
  /** Гостю ушло подтверждение в WhatsApp. */
  confirmation?: boolean
}

interface ApiResponse {
  ok?: boolean
  error?: string
  fields?: Record<string, string>
  confirmation?: boolean
}

/** Ошибки сервера — в понятные фронту категории. */
function classify(status: number, error?: string): SendErrorKind {
  if (error === 'not_configured') return 'config'
  // 404 — эндпоинт не задеплоен (например, статика без PHP): для гостя это
  // то же самое, что «форма не подключена», а не сбой отправки.
  if (status === 404) return 'config'
  if (error === 'rate_limited' || status === 429) return 'rate'
  if (error === 'validation' || status === 422) return 'validation'
  return 'server'
}

export async function sendToWhatsApp(
  payload: FormPayload,
  /** Секунд с момента открытия формы — отсекает мгновенные отправки ботами. */
  elapsedSeconds: number,
): Promise<SendResult> {
  try {
    const response = await fetch(WHATSAPP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        elapsed: elapsedSeconds,
        page: location.href.slice(0, 200),
        // Ловушка для ботов: реальный пользователь это поле не видит.
        website: '',
      }),
    })

    const data = (await response.json().catch(() => ({}))) as ApiResponse

    if (response.ok && data.ok) {
      return { ok: true, confirmation: data.confirmation }
    }

    return {
      ok: false,
      kind: classify(response.status, data.error),
      fields: data.fields,
    }
  } catch {
    // Сеть недоступна или ответ не JSON — до сервера мы не дошли.
    return { ok: false, kind: 'network' }
  }
}
