# Iruka Web

Iruka turns open onchain data into managed signals for DeFi operators and agent builders. The web app contains the public marketing surface, authenticated signal console, Telegram setup flow, and local API proxy routes used by the browser client.

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Use `.env.example` as the local baseline:

```bash
NEXT_PUBLIC_TELEGRAM_BOT_HANDLE=iruka_tech_bot
IRUKA_API_BASE_URL=http://localhost:3000/api/v1
DELIVERY_BASE_URL=http://localhost:3100
```

`IRUKA_API_BASE_URL` points at the Iruka backend API. Browser requests go through the local Next.js proxy under `/api/iruka/*` where needed.

## Verification

```bash
pnpm lint
pnpm build
```

The production site is intended to live at [https://iruka.tech](https://iruka.tech).
