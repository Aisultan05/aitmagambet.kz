/**
 * Проверка подключения Telegram-бота.
 *
 * Читает api/.env и по шагам выясняет, где именно всё ломается: заполнены ли
 * ключи, жив ли токен, может ли бот написать вам. Без этого настройка
 * превращается в гадание: форма отвечает «не получилось отправить»,
 * а причин у этого несколько.
 *
 *   node scripts/check-telegram.mjs         — только диагностика
 *   node scripts/check-telegram.mjs --send  — ещё и отправить тестовое сообщение
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SEND = process.argv.includes('--send')

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`)
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`)
const hint = (m) => console.log(`    \x1b[2m${m}\x1b[0m`)

function loadEnv() {
  const values = {}
  try {
    const raw = readFileSync(resolve(root, 'api/.env'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('#') || !t.includes('=')) continue
      const [k, ...rest] = t.split('=')
      values[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
    }
  } catch {
    return null
  }
  return values
}

console.log('\nПроверка Telegram-бота\n')

// --- 1. Файл с ключами -----------------------------------------------------
const env = loadEnv()
if (!env) {
  bad('api/.env не найден')
  hint('cp api/.env.example api/.env — и заполнить значениями из Telegram')
  process.exit(1)
}
ok('api/.env найден')

const token = env.TELEGRAM_BOT_TOKEN || ''
const chatId = env.TELEGRAM_CHAT_ID || ''

const missing = []
if (!token) missing.push('TELEGRAM_BOT_TOKEN')
if (!chatId) missing.push('TELEGRAM_CHAT_ID')
if (missing.length) {
  bad(`не заполнено: ${missing.join(', ')}`)
  hint('токен даёт @BotFather, chat_id подскажет @userinfobot')
  process.exit(1)
}

// Токен всегда выглядит как «цифры:буквы» — ловим опечатку до запроса
if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(token)) {
  bad('TELEGRAM_BOT_TOKEN не похож на токен')
  hint('ожидается вид 123456789:AAH... — скопируйте целиком из сообщения @BotFather')
  process.exit(1)
}
ok('ключи на месте')

const api = (method) => `https://api.telegram.org/bot${token}/${method}`

// --- 2. Токен жив ----------------------------------------------------------
let me
try {
  const res = await fetch(api('getMe'))
  me = await res.json()
  if (!me.ok) {
    bad(`токен отклонён: ${me.description || 'неизвестная ошибка'}`)
    hint('если токен отозван — /revoke у @BotFather выдаст новый')
    process.exit(1)
  }
} catch (e) {
  bad(`Telegram недоступен: ${e.message}`)
  process.exit(1)
}
ok(`бот отвечает — @${me.result.username}`)

// --- 3. Бот может писать владельцу -----------------------------------------
if (!SEND) {
  console.log('\nВсё готово. Чтобы проверить доставку — запустите с флагом --send\n')
  process.exit(0)
}

const res = await fetch(api('sendMessage'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: chatId,
    text: '✅ <b>Проверка связи</b>\nЕсли видите это сообщение — форма портфолио настроена.',
    parse_mode: 'HTML',
  }),
})
const body = await res.json().catch(() => null)

if (body?.ok) {
  ok(`сообщение доставлено в чат ${chatId}`)
  console.log('\nОткройте Telegram — оно должно быть в чате с ботом.\n')
} else {
  bad(`отправка не прошла: ${body?.description || `HTTP ${res.status}`}`)
  if (String(body?.description || '').includes('chat not found')) {
    hint('неверный TELEGRAM_CHAT_ID — сверьте с тем, что прислал @userinfobot')
  } else if (String(body?.description || '').includes('blocked')) {
    hint('вы заблокировали бота — разблокируйте его в Telegram')
  } else {
    hint('чаще всего: вы ещё не написали боту. Откройте его и отправьте /start —')
    hint('Telegram не даёт боту написать первым.')
  }
  process.exit(1)
}
