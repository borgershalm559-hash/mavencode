# MavenCode → Timeweb: полный переезд на хост

- **Дата:** 2026-06-04
- **Статус:** Утверждён, выполняется поэтапно
- **Связанный коммит:** `fdcc8aa` (S3-хранилище для загрузок + Node engine ≥20)

## Цель

Полностью перенести MavenCode на инфраструктуру Timeweb: приложение, база
данных и файловое хранилище — на Timeweb, с сохранением всех данных и рабочими
интеграциями (OAuth, email, rate-limit).

## Утверждённые решения

| Компонент | Решение | Примечание |
|---|---|---|
| Приложение | Timeweb App Platform (PaaS, buildpack Next.js) | Node 20, ≥2 ГБ RAM на сборку |
| База данных | Timeweb Managed Postgres | перенос из Neon через `pg_dump → pg_restore`, сохраняем всё |
| Файлы | Timeweb S3 | код готов (коммит `fdcc8aa`), fallback на диск |
| Email | Resend (внешний, free) | у Timeweb нет API-аналога |
| Rate-limit | Upstash Redis (внешний, free) | Timeweb Redis платный — не берём |
| Домен | бесплатный поддомен Timeweb + авто-SSL | кастомный домен привязать позже |
| 152-ФЗ | удовлетворяется переносом БД в РФ | главная причина ухода с Neon |

## Целевая архитектура

```
Браузер ──HTTPS──▶ Timeweb App Platform (Next.js 16, Node 20)
                      ├─▶ Timeweb Postgres   (аккаунты, прогресс, контент)
                      ├─▶ Timeweb S3         (картинки уроков / аватары)
                      ├─▶ Resend             (письма сброса пароля)   ← внешн., free
                      └─▶ Upstash Redis      (rate-limit)             ← внешн., free
OAuth: GitHub · Yandex · VK  (redirect URI → новый домен)
```

## Переменные окружения (в панели App)

| Группа | Переменные |
|---|---|
| БД | `DATABASE_URL`, `DIRECT_URL` (Timeweb Postgres, `?sslmode=require`) |
| Auth | `AUTH_SECRET`, `NEXTAUTH_URL`=домен, `NEXT_PUBLIC_APP_URL`=домен |
| OAuth | `GITHUB_ID`/`GITHUB_SECRET`, `YANDEX_CLIENT_ID`/`YANDEX_CLIENT_SECRET`, `VK_CLIENT_ID` |
| Сервисы | `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` |
| S3 | `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_PUBLIC_URL` |

## OAuth redirect URI (под новый домен)

- GitHub → `https://<домен>/api/auth/callback/github`
- Yandex → `https://<домен>/api/auth/callback/yandex`
- VK → `https://<домен>/api/vk-auth/callback`

## Этапы

1. **GitHub** — запушить коммит `fdcc8aa` в `main` (без этого Timeweb не соберёт код).
2. **Timeweb Postgres** — создать БД (мажорная версия ≥ Neon), `pg_dump` с Neon →
   `pg_restore` в Timeweb (`--no-owner --no-privileges`), прописать `DATABASE_URL`/`DIRECT_URL`.
3. **Timeweb S3** — бакет с публичным чтением + ключи доступа; залить существующие
   `public/uploads` (если есть), задать `S3_*` env.
4. **Timeweb App** — подключить GitHub-репо, ветка `main`, пресет Next.js, вставить env, деплой.
5. **Домен + OAuth + проверка** — поддомен/SSL, обновить redirect URI в 3 провайдерах,
   прогнать Definition of Done.

## Definition of Done

- [ ] Сайт открывается по HTTPS на домене Timeweb
- [ ] Вход работает: email + GitHub + Yandex + VK
- [ ] Уроки проходятся, прогресс пишется в Timeweb Postgres
- [ ] Загрузка картинки в админке переживает редеплой (S3)
- [ ] Письмо сброса пароля приходит (Resend)
- [ ] Старые данные (аккаунты/прогресс/контент) на месте

## Разделение работ

- **Claude:** правки кода (готово), команды `pg_dump`/`pg_restore`, точные значения
  env, чек-листы консоли, дебаг сборки/подключения; перенос БД и заливку S3 — если
  даны строки подключения.
- **Пользователь (в панелях):** создание App / Postgres / S3-бакета, ввод env,
  обновление redirect URI в GitHub/Yandex/VK, пуш в GitHub, привязка домена.

## Откат

Neon не трогаем до подтверждения работы Timeweb. Откат = вернуть `DATABASE_URL`
на строку Neon. Данные копируются, не переносятся.
