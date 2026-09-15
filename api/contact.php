<?php

declare(strict_types=1);

/**
 * Отправка сообщений с формы портфолио в Telegram через Bot API.
 *
 * POST /api/contact.php — принимает JSON формы и шлёт сообщение мне в Telegram.
 *
 * Почему бот, а не шлюз к WhatsApp: токен бота даёт доступ только к самому боту.
 * Личная переписка ему недоступна, привязывать аккаунт не нужно, блокировать
 * нечего. Токен читается из .env рядом со скриптом и наружу не уходит.
 */

// ---------------------------------------------------------------------------
// Конфигурация
// ---------------------------------------------------------------------------

const CONFIG_DEFAULTS = [
    // Токен от @BotFather, вида 123456789:AAH...
    'TELEGRAM_BOT_TOKEN'  => '',
    // Куда приходят заявки: chat_id владельца (узнаётся через @userinfobot)
    'TELEGRAM_CHAT_ID'    => '',
    // Сколько сообщений с одного IP за окно
    'RATE_LIMIT'          => '3',
    'RATE_WINDOW_SECONDS' => '600',
    // Разрешённый Origin для запросов из dev-сборки. Пусто — только тот же домен.
    'ALLOWED_ORIGIN'      => '',
    'LOG_FILE'            => '',
];

/** Простой парсер .env: KEY=value, строки с # игнорируются. */
function loadConfig(string $dir): array
{
    $config = CONFIG_DEFAULTS;
    $path = $dir . '/.env';

    if (is_readable($path)) {
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            // Значение может быть в кавычках — снимаем их.
            if (strlen($value) > 1 && ($value[0] === '"' || $value[0] === "'")
                && $value[-1] === $value[0]) {
                $value = substr($value, 1, -1);
            }
            if (array_key_exists($key, $config)) {
                $config[$key] = $value;
            }
        }
    }

    // Переменные окружения перекрывают файл — удобно для Docker и CI.
    foreach (array_keys($config) as $key) {
        $env = getenv($key);
        if ($env !== false && $env !== '') {
            $config[$key] = $env;
        }
    }

    return $config;
}

// ---------------------------------------------------------------------------
// Утилиты
// ---------------------------------------------------------------------------

function jsonResponse(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function logLine(array $config, string $message): void
{
    $file = $config['LOG_FILE'];
    if ($file === '') {
        return;
    }
    @file_put_contents($file, sprintf("[%s] %s\n", date('c'), $message), FILE_APPEND | LOCK_EX);
}

function clientIp(): string
{
    // За nginx/CDN реальный адрес приходит в заголовке; иначе REMOTE_ADDR.
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR'] as $header) {
        $value = $_SERVER[$header] ?? '';
        if ($value === '') {
            continue;
        }
        $first = trim(explode(',', $value)[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Убирает управляющие символы и подрезает длину. */
function cleanText(mixed $value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $text = trim($text);

    if (mb_strlen($text) > $maxLength) {
        $text = mb_substr($text, 0, $maxLength) . '…';
    }
    return $text;
}

/**
 * Экранирование под parse_mode=HTML.
 * Telegram принимает только ограниченный набор тегов, всё остальное
 * должно быть экранировано, иначе сообщение отклоняется целиком.
 */
function esc(string $text): string
{
    return htmlspecialchars($text, ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function looksLikePhone(string $raw): bool
{
    $digits = preg_replace('/\D+/', '', $raw) ?? '';
    return strlen($digits) >= 10 && strlen($digits) <= 15;
}

// ---------------------------------------------------------------------------
// Ограничение частоты — файловое, без БД
// ---------------------------------------------------------------------------

function rateLimitExceeded(array $config, string $ip): bool
{
    $limit = max(1, (int) $config['RATE_LIMIT']);
    $window = max(30, (int) $config['RATE_WINDOW_SECONDS']);

    $dir = sys_get_temp_dir() . '/portfolio-contact-rate';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        logLine($config, 'rate-limit storage unavailable');
        return false;
    }

    $file = $dir . '/' . hash('sha256', $ip) . '.json';
    $now = time();

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return false;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return false;
        }

        $size = (int) (fstat($handle)['size'] ?? 0);
        $raw = $size > 0 ? (string) fread($handle, $size) : '';
        $stamps = json_decode($raw, true);
        if (!is_array($stamps)) {
            $stamps = [];
        }

        // Оставляем только попытки внутри окна.
        $stamps = array_values(array_filter(
            $stamps,
            static fn ($t): bool => is_int($t) && $t > $now - $window
        ));

        if (count($stamps) >= $limit) {
            return true;
        }

        $stamps[] = $now;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($stamps));
        fflush($handle);

        return false;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

// ---------------------------------------------------------------------------
// Telegram Bot API
// ---------------------------------------------------------------------------

/**
 * @return array{ok: bool, status: int, body: string}
 */
function telegramSend(array $config, string $text): array
{
    $url = sprintf(
        'https://api.telegram.org/bot%s/sendMessage',
        $config['TELEGRAM_BOT_TOKEN']
    );

    $payload = json_encode([
        'chat_id'                  => $config['TELEGRAM_CHAT_ID'],
        'text'                     => $text,
        'parse_mode'               => 'HTML',
        // Ссылка на страницу в подписи не должна разворачиваться в превью.
        'disable_web_page_preview' => true,
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        return ['ok' => false, 'status' => 0, 'body' => $error];
    }

    $decoded = json_decode((string) $body, true);
    $ok = $status === 200 && is_array($decoded) && ($decoded['ok'] ?? false) === true;

    return ['ok' => $ok, 'status' => $status, 'body' => (string) $body];
}

function buildMessage(array $data, string $ip): string
{
    $lines = [
        '📩 <b>Новое сообщение с портфолио</b>',
        '',
        '<b>Имя:</b> ' . esc($data['name']),
        '<b>Тема:</b> ' . esc($data['topic']),
        '<b>Контакт:</b> ' . esc($data['contact']),
        '',
        '<b>Сообщение:</b>',
        esc($data['message']),
        '',
        '<code>' . esc($data['page']) . '</code>',
        '<code>' . date('d.m.Y H:i') . ' · ' . esc($ip) . '</code>',
    ];

    return implode("\n", $lines);
}

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

$config = loadConfig(__DIR__);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Origin для dev-сборки на другом порту.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($config['ALLOWED_ORIGIN'] !== '' && $origin === $config['ALLOWED_ORIGIN']) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    jsonResponse(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

if ($config['TELEGRAM_BOT_TOKEN'] === '' || $config['TELEGRAM_CHAT_ID'] === '') {
    logLine($config, 'request rejected: Telegram bot is not configured');
    jsonResponse(503, ['ok' => false, 'error' => 'not_configured']);
}

// --- Разбор тела -----------------------------------------------------------
$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 20000) {
    jsonResponse(413, ['ok' => false, 'error' => 'too_large']);
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    jsonResponse(400, ['ok' => false, 'error' => 'bad_request']);
}

// --- Анти-спам -------------------------------------------------------------
// Скрытое поле, которое заполняют только боты.
if (cleanText($input['website'] ?? '', 200) !== '') {
    logLine($config, 'honeypot triggered');
    // Боту отвечаем как при успехе, чтобы не подсказывать правило.
    jsonResponse(200, ['ok' => true]);
}

// Форма, отправленная быстрее трёх секунд после открытия, — почти наверняка бот.
$elapsed = (int) ($input['elapsed'] ?? 0);
if ($elapsed > 0 && $elapsed < 3) {
    logLine($config, 'submitted too fast: ' . $elapsed . 's');
    jsonResponse(200, ['ok' => true]);
}

$ip = clientIp();
if (rateLimitExceeded($config, $ip)) {
    jsonResponse(429, ['ok' => false, 'error' => 'rate_limited']);
}

// --- Валидация -------------------------------------------------------------
$data = [
    'name'    => cleanText($input['name'] ?? '', 120),
    'contact' => cleanText($input['contact'] ?? '', 160),
    'topic'   => cleanText($input['topic'] ?? '', 80),
    'message' => cleanText($input['message'] ?? '', 2000),
    'page'    => cleanText($input['page'] ?? '', 200),
];

$errors = [];
if (mb_strlen($data['name']) < 2) {
    $errors['name'] = 'too_short';
}
if (mb_strlen($data['contact']) < 5) {
    $errors['contact'] = 'too_short';
} elseif (!looksLikePhone($data['contact'])
    && !filter_var($data['contact'], FILTER_VALIDATE_EMAIL)) {
    $errors['contact'] = 'invalid';
}
if (mb_strlen($data['message']) < 10) {
    $errors['message'] = 'too_short';
}

if ($errors !== []) {
    jsonResponse(422, ['ok' => false, 'error' => 'validation', 'fields' => $errors]);
}

if ($data['topic'] === '') {
    $data['topic'] = 'Не указана';
}

// --- Отправка --------------------------------------------------------------
$result = telegramSend($config, buildMessage($data, $ip));

if (!$result['ok']) {
    logLine($config, sprintf(
        'Telegram send failed: status=%d body=%s',
        $result['status'],
        substr($result['body'], 0, 500)
    ));
    // Детали Telegram наружу не отдаём — только факт неудачи.
    jsonResponse(502, ['ok' => false, 'error' => 'send_failed']);
}

logLine($config, 'message delivered from ' . $ip);

jsonResponse(200, ['ok' => true]);
