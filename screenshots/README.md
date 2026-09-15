# Скриншоты живых сайтов

Сняты 11.09.2026 в Chrome, 1280×800, с закрытыми модалками выбора города
и cookie-баннерами. Виджеты чатов оставлены — они часть живых страниц.

В этой папке лежат снимки, которые **не** используются на сайте:
Vite копирует `public/` в сборку целиком, поэтому неиспользуемые файлы
оттуда убраны, чтобы не возить лишний мегабайт на продакшн.

Используются сейчас (лежат в `public/shots/`):

| Файл | Кейс |
|---|---|
| `svoydom.jpg` | svoydom.kz |
| `ecp.jpg` | ecp.kz |
| `rgurpo.jpg` | rgurpo.agartu.kz |
| `elke.jpg` | ELKE COMPANY |

Здесь, про запас (сайты из раздела «Опыт», а не из кейсов):

| Файл | Сайт | Где упоминается |
|---|---|---|
| `svd.jpg` | svd.kz | мультисайт на ядре svoydom |
| `damumall.jpg` | damumall.kz | Capital Network |
| `bfmereke.jpg` | bfmereke.kz | Capital Network |
| `bmconsult.jpg` | bmconsult.kz | BenchMark Consulting |
| `pavlenko.jpg` | pavlenko.kz | веб-студия Pavlenko |
| `abcdesign.jpg` | abc-design.kz | ABC Design |
| `snggroup.jpg` | snggroup.kz | ABC Design |
| `acbgroup.jpg` | acbgroup.kz | ABC Design |
| `coffeestore.jpg` | coffeestore.uz | ABC Design |

Чтобы поставить любой из них в кейс: перенести файл в `public/shots/`
и прописать `image` и `imageAlt` в `src/content/ru.ts` и `en.ts`.

## Не открылись

- `hard.abcsup.kz` — домен не резолвится, сайта больше нет.
- `elke.kz` — домен-заглушка. Рабочий адрес ELKE — `elkecompany.kz`.
