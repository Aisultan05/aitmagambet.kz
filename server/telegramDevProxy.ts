import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

/**
 * Dev-версия эндпоинта api/contact.php.
 *
 * В продакшене форму обслуживает PHP (или функция Cloudflare); локально PHP
 * может быть не поднят, поэтому `npm run dev` отвечает на тот же путь тем же
 * контрактом. Читает те же api/.env, чтобы не держать конфиг в двух местах.
 */

const ENDPOINT = '/api/contact.php'

interface Config {
  token: string
  chatId: string
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
    token: values.TELEGRAM_BOT_TOKEN ?? '',
    chatId: values.TELEGRAM_CHAT_ID ?? '',
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

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function sendMessage(cfg: Config, text: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      console.warn(`[telegram] ${res.status} ${await res.text()}`)
      return false
    }
    const json = (await res.json()) as { ok?: boolean }
    return Boolean(json.ok)
  } catch (error) {
    console.warn('[telegram] request failed:', error)
    return false
  }
}

export function telegramDevProxy(): Plugin {
  return {
    name: 'telegram-dev-proxy',
    apply: 'serve',

    configureServer(server) {
      const cfg = loadEnv(server.config.root)

      if (!cfg.token || !cfg.chatId) {
        server.config.logger.warn(
          '[telegram] api/.env не заполнен — форма вернёт not_configured. ' +
            'Скопируйте api/.env.example в api/.env.',
        )
      }

      server.middlewares.use(ENDPOINT, async (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(payload))
        }

        if (req.method !== 'POST') return send(405, { ok: false, error: 'method_not_allowed' })
        if (!cfg.token || !cfg.chatId) return send(503, { ok: false, error: 'not_configured' })

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
          '📩 <b>Новое сообщение с портфолио</b> (dev)',
          '',
          `<b>Имя:</b> ${esc(data.name)}`,
          `<b>Тема:</b> ${esc(data.topic)}`,
          `<b>Контакт:</b> ${esc(data.contact)}`,
          '',
          '<b>Сообщение:</b>',
          esc(data.message),
          '',
          `<code>${esc(data.page)}</code>`,
        ].join('\n')

        const ok = await sendMessage(cfg, text)
        if (!ok) return send(502, { ok: false, error: 'send_failed' })

        return send(200, { ok: true })
      })
    },
  }
}
