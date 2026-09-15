import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

/**
 * Dev-версия эндпоинта api/whatsapp.php.
 *
 * В продакшене форму обслуживает PHP; локально PHP может быть не поднят,
 * поэтому `npm run dev` отвечает на тот же путь тем же контрактом.
 * Читает те же api/.env, чтобы не держать конфиг в двух местах.
 */

const ENDPOINT = '/api/whatsapp.php'

interface Config {
  host: string
  id: string
  token: string
  phone: string
  confirmation: boolean
}

function loadEnv(root: string): Config {
  const values: Record<string, string> = {}

  try {
    const raw = readFileSync(resolve(root, 'api/.env'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [key, ...rest] = trimmed.split('=')
      values[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
    }
  } catch {
    /* .env ещё не создан — вернём пустой конфиг, эндпоинт ответит not_configured */
  }

  return {
    host: (values.GREEN_API_HOST || 'https://api.green-api.com').replace(/\/+$/, ''),
    id: values.GREEN_API_ID ?? '',
    token: values.GREEN_API_TOKEN ?? '',
    phone: (values.OWNER_PHONE ?? '').replace(/\D+/g, ''),
    confirmation: values.SEND_CONFIRMATION === '1',
  }
}

function readBody(req: import('node:http').IncomingMessage): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 20000) reject(new Error('payload too large'))
    })
    req.on('end', () => resolvePromise(data))
    req.on('error', reject)
  })
}

async function sendMessage(cfg: Config, chat: string, message: string): Promise<boolean> {
  const url = `${cfg.host}/waInstance${cfg.id}/sendMessage/${cfg.token}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: `${chat}@c.us`, message }),
    })
    if (!res.ok) {
      console.warn(`[green-api] ${res.status} ${await res.text()}`)
      return false
    }
    const json = (await res.json()) as { idMessage?: string }
    return Boolean(json.idMessage)
  } catch (error) {
    console.warn('[green-api] request failed:', error)
    return false
  }
}

export function greenApiDevProxy(): Plugin {
  return {
    name: 'green-api-dev-proxy',
    apply: 'serve',

    configureServer(server) {
      const cfg = loadEnv(server.config.root)

      if (!cfg.id || !cfg.token || !cfg.phone) {
        server.config.logger.warn(
          '[green-api] api/.env не заполнен — форма вернёт not_configured. ' +
            'Скопируйте api/.env.example в api/.env.',
        )
      }

      server.middlewares.use(ENDPOINT, async (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(payload))
        }

        // Редирект на wa.me — тот же контракт, что у PHP-версии.
        if (req.method === 'GET') {
          if (!cfg.phone) return send(503, { ok: false, error: 'not_configured' })
          res.statusCode = 302
          res.setHeader(
            'Location',
            `https://wa.me/${cfg.phone}?text=${encodeURIComponent(
              'Здравствуйте! Пишу с сайта портфолио.',
            )}`,
          )
          return res.end()
        }

        if (req.method !== 'POST') return send(405, { ok: false, error: 'method_not_allowed' })
        if (!cfg.id || !cfg.token || !cfg.phone) {
          return send(503, { ok: false, error: 'not_configured' })
        }

        let input: Record<string, unknown>
        try {
          input = JSON.parse(await readBody(req))
        } catch {
          return send(400, { ok: false, error: 'bad_request' })
        }

        if (String(input.website ?? '').trim()) return send(200, { ok: true })

        const str = (key: string, max: number) =>
          String(input[key] ?? '')
            .trim()
            .slice(0, max)

        const data = {
          name: str('name', 120),
          contact: str('contact', 160),
          topic: str('topic', 80) || 'Не указана',
          message: str('message', 2000),
          page: str('page', 200),
        }

        const fields: Record<string, string> = {}
        if (data.name.length < 2) fields.name = 'too_short'
        if (data.contact.length < 5) fields.contact = 'too_short'
        if (data.message.length < 10) fields.message = 'too_short'
        if (Object.keys(fields).length) {
          return send(422, { ok: false, error: 'validation', fields })
        }

        const text = [
          '📩 *Новое сообщение с портфолио* (dev)',
          '',
          `*Имя:* ${data.name}`,
          `*Тема:* ${data.topic}`,
          `*Контакт:* ${data.contact}`,
          '',
          '*Сообщение:*',
          data.message,
          '',
          '—',
          `Страница: ${data.page}`,
        ].join('\n')

        const ok = await sendMessage(cfg, cfg.phone, text)
        if (!ok) return send(502, { ok: false, error: 'send_failed' })

        let confirmation = false
        const visitor = data.contact.replace(/\D+/g, '')
        if (cfg.confirmation && visitor.length >= 10 && visitor !== cfg.phone) {
          confirmation = await sendMessage(
            cfg,
            visitor,
            `Здравствуйте, ${data.name}! Ваше сообщение с сайта дошло — отвечу в течение дня.`,
          )
        }

        return send(200, { ok: true, confirmation })
      })
    },
  }
}
