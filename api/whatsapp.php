<?php

declare(strict_types=1);

/**
 * Отправка сообщений с формы портфолио в WhatsApp через Green API.
 *
 * POST /api/whatsapp.php  — принимает JSON формы и отправляет сообщение мне.
 * GET  /api/whatsapp.php?go=wa — редирект на wa.me, чтобы номер не лежал в HTML.
 *
 * Токен Green API читается из .env рядом со скриптом и никогда не уходит
 * в ответ клиенту. Настройки — в api/.env (см. .env.example).
 */

// ---------------------------------------------------------------------------
// Конфигурация
// ---------------------------------------------------------------------------

const CONFIG_DEFAULTS = [
    'GREEN_API_HOST'      => 'https://api.green-api.com',
    'GREEN_API_ID'        => '',
    'GREEN_API_TOKEN'     => '',
    // Номер получателя — только цифры, с кодом страны: 77077238960
    'OWNER_PHONE'         => '',
    // Подтверждение отправителю, если он оставил номер WhatsApp
    'SEND_CONFIRMATION'   => '0',
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
    $line = sprintf("[%s] %s\n", date('c'), $message);
    @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
}

/** Только цифры: Green API ждёт chatId вида 77077238960@c.us. */
function normalizePhone(string $raw): string
{
    $digits = preg_replace('/\D+/', '', $raw) ?? '';

    // Локальная казахстанская запись 8XXXXXXXXXX → 7XXXXXXXXXX
    if (strlen($digits) === 11 && str_starts_with($digits, '8')) {
        $digits = '7' . substr($digits, 1);
    }

    return $digits;
}

function looksLikePhone(string $raw): bool
{
    $digits = normalizePhone($raw);
    return strlen($digits) >= 10 && strlen($digits) <= 15;
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

/** Убирает управляющие символы и подрезает длину — в WhatsApp уходит чистый текст. */
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

// ---------------------------------------------------------------------------
// Ограничение частоты — файловое, без БД
// ---------------------------------------------------------------------------

function rateLimitExceeded(array $config, string $ip): bool
{
    $limit = max(1, (int) $config['RATE_LIMIT']);
    $window = max(30, (int) $config['RATE_WINDOW_SECONDS']);

    $dir = sys_get_temp_dir() . '/portfolio-wa-rate';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        // Не смогли создать хранилище — пропускаем запрос, но пишем в лог.
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
// Green API
// ---------------------------------------------------------------------------

/**
 * @return array{ok: bool, status: int, body: string}
 */
function greenApiSend(array $config, string $phone, string $message): array
{
    $url = sprintf(
        '%s/waInstance%s/sendMessage/%s',
        rtrim($config['GREEN_API_HOST'], '/'),
        rawurlencode($config['GREEN_API_ID']),
        rawurlencode($config['GREEN_API_TOKEN'])
    );

    $payload = json_encode([
        'chatId'  => $phone . '@c.us',
        'message' => $message,
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

    // Успех — 200 и idMessage в ответе.
    $decoded = json_decode((string) $body, true);
    $ok = $status === 200 && is_array($decoded) && !empty($decoded['idMessage']);

    return ['ok' => $ok, 'status' => $status, 'body' => (string) $body];
}

function buildOwnerMessage(array $data, string $ip): string
{
    $lines = [
        '📩 *Новое сообщение с портфолио*',
        '',
        '*Имя:* ' . $data['name'],
        '*Тема:* ' . $data['topic'],
        '*Контакт:* ' . $data['contact'],
        '',
        '*Сообщение:*',
        $data['message'],
        '',
        '—',
        'Страница: ' . $data['page'],
        'Время: ' . date('d.m.Y H:i') . ' (сервер)',
        'IP: ' . $ip,
    ];

    return implode("\n", $lines);
}

function buildVisitorMessage(array $data): string
{
    return implode("\n", [
        'Здравствуйте, ' . $data['name'] . '!',
        '',
        'Это Айсултан — ваше сообщение с сайта дошло, я его получил.',
        'Отвечу в течение дня, обычно быстрее.',
        '',
        'Ваше сообщение:',
        '«' . mb_substr($data['message'], 0, 300) . '»',
    ]);
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

// --- Редирект на WhatsApp: номер остаётся на сервере, в HTML его нет. ------
if ($method === 'GET' && ($_GET['go'] ?? '') === 'wa') {
    $phone = normalizePhone($config['OWNER_PHONE']);
    if ($phone === '') {
        jsonResponse(503, ['ok' => false, 'error' => 'not_configured']);
    }

    $text = rawurlencode('Здравствуйте! Пишу с сайта портфолио.');
    header('Location: https://wa.me/' . $phone . '?text=' . $text, true, 302);
    exit;
}

if ($method !== 'POST') {
    jsonResponse(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// --- Конфигурация на месте? ------------------------------------------------
if ($config['GREEN_API_ID'] === '' || $config['GREEN_API_TOKEN'] === ''
    || normalizePhone($config['OWNER_PHONE']) === '') {
    logLine($config, 'request rejected: Green API is not configured');
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
$owner = normalizePhone($config['OWNER_PHONE']);
$result = greenApiSend($config, $owner, buildOwnerMessage($data, $ip));

if (!$result['ok']) {
    logLine($config, sprintf(
        'Green API send failed: status=%d body=%s',
        $result['status'],
        substr($result['body'], 0, 500)
    ));
    // Детали Green API наружу не отдаём — только факт неудачи.
    jsonResponse(502, ['ok' => false, 'error' => 'send_failed']);
}

// Подтверждение отправителю — только если он оставил номер и это включено.
$confirmationSent = false;
if ($config['SEND_CONFIRMATION'] === '1' && looksLikePhone($data['contact'])) {
    $visitor = normalizePhone($data['contact']);
    if ($visitor !== $owner) {
        $confirm = greenApiSend($config, $visitor, buildVisitorMessage($data));
        $confirmationSent = $confirm['ok'];
        if (!$confirm['ok']) {
            // Не ошибка формы: у гостя может просто не быть WhatsApp.
            logLine($config, 'confirmation not delivered to ' . $visitor);
        }
    }
}

logLine($config, 'message delivered from ' . $ip);

jsonResponse(200, ['ok' => true, 'confirmation' => $confirmationSent]);
