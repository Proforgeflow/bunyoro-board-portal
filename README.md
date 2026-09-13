# Bunyoro Board Portal

A secure, institutional-style governance portal for board operations, committee oversight, policy tracking, and executive reporting.

## Overview

This project presents a full governance ecosystem with:

- board and council management
- meeting agenda and minutes workflows
- approval routing and business compliance oversight
- institutional reporting and leadership dashboards
- secure admin visibility for operational teams

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS
- Firebase and Supabase integration-ready clients

## Project structure

- `app/` – application routes and layouts
- `components/` – reusable UI components
- `utils/` – Firebase and Supabase client utilities
- `public/` – static assets

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Production build

```bash
npm run build
```

## Environment variables

Configure the following values in `.env.local` when enabling live Firebase or Supabase integrations:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Notes

The current UI is designed as a polished institutional front-end demonstration and can be extended with real authentication, database records, and document workflows.
