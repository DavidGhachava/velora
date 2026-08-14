# Velora

Velora is a Batumi-focused accommodation booking and hotel operations platform. It combines a public guest booking experience with a private operations workspace for reservations, rooms, housekeeping, services, billing, and analytics.

## Stack

- React, TypeScript, Vite, and Tailwind CSS
- React Router and TanStack Query
- React Hook Form and Zod
- Supabase Auth, PostgreSQL, Storage, and Realtime
- Recharts, date-fns, Lucide, and Framer Motion

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and add the development Supabase values when the backend is connected. Never commit `.env` or service-role credentials.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

Product, design, architecture, schema, user-flow, and implementation specifications are stored in [`docs/`](docs/). The single-owner Supabase dashboard rollout is defined in [`docs/admin-dashboard-plan.md`](docs/admin-dashboard-plan.md).
