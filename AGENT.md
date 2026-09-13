# Bunyoro Board Portal – Handoff Guide

## Project identity
This project is a Next.js institutional portal and real-estate member platform for Bunyoro Omuhama. It presents a polished public-facing landing page, a member login flow, a member signup flow, and an internal dashboard for tracking member equity and capital contributions.

The system is conceptualized as a real-estate investment and land subdivision portal where:
- members register as shareholders or investors
- each member contributes capital
- their equity share is tracked as a percentage
- land is intended to be acquired and divided into subplots in proportion to each member’s contribution
- the dashboard shows each member’s contribution, equity percentage, and portfolio allocation

## Business objective
The core business model is:
1. Purchase land for real-estate development.
2. Divide the land into subplots.
3. Allocate each subplot in proportion to the member’s capital contribution.
4. Maintain a transparent and auditable equity membership system.

The portal is designed to make this visible to members and stakeholders through the UI.

## Current implemented features
### 1. Public landing page
The home page is a branded institutional landing experience. It includes:
- Bunyoro branding and the project logo
- institutional governance messaging
- feature cards covering governance, approvals, compliance, and reporting
- operational dashboard section
- member acquisition call-to-action
- footer and contact section

### 2. Login page
The login page is implemented at `/login` and includes:
- SMS login tab and email login tab
- full legal name + phone input flow
- OTP verification step
- email/password option
- role-based institutional styling
- redirect to `/admin` after verification simulation
- link to `/signup`

### 3. Member signup page
The signup page is implemented at `/signup` and supports:
- full name
- email
- phone number
- city
- role selection
- equity share percentage
- capital contribution amount
- creation of new member record saved in browser local storage
- redirect to `/admin` after successful creation

### 4. Admin dashboard
The dashboard is implemented at `/admin` and displays:
- total capital raised
- total equity share
- active members
- average contribution per member
- member register table with name, city, equity, contribution, status
- capital allocation progress bars for each member
- a real-estate and member equity summary view

### 5. Brand and logo integration
The project logo is placed in:
- `/public/logo.png`

It is used in:
- the public home page header
- the login screen
- the admin dashboard header
- the signup form header

## File structure and purpose
### App routes
- `app/page.js` – public landing page for Bunyoro Board Portal
- `app/login/page.tsx` – member authentication UI
- `app/signup/page.js` – member registration form
- `app/admin/page.js` – member equity and capital dashboard
- `app/layout.js` – root app layout, metadata
- `app/globals.css` – institutional styling, theme, layout classes

### Utilities and data
- `lib/members.js` – member seed data, local storage key, and currency formatter
- `utils/firebase.ts` – Firebase setup utility
- `utils/supabase/client.ts` – Supabase browser client setup

### Static asset
- `public/logo.png` – the main portal logo

## Data model used in the MVP
The current member structure is represented as follows:
- id
- fullName
- email
- phone
- city
- role
- equityShare
- capitalContributed
- capitalTarget
- status
- joinedAt
- propertyUnits

The app uses a seed list stored in `lib/members.js` and persists new members to `localStorage` under:
- `bunyoro-board-members`

## Business logic used in the MVP
Members are represented with an equity contribution model. The dashboard calculates:
- total contributed capital across all members
- total equity share across the portfolio
- average contribution per member
- progress toward each member’s contribution target

Example relationship:
- member contribution divided by total contribution = relative ownership share
- this share is used in the UI as performance and allocation visualization

## Styling and branding standards
The brand style is built around a dark institutional theme with:
- deep slate and navy backgrounds
- emerald, sky, and amber accent colors
- glassmorphism cards
- strong typography
- premium governance dashboard feel

Design intent:
- serious, institutional, trustworthy
- suitable for shareholder, board, and governance communication
- aligned with land investment and member reporting workflows

## Runtime and build setup
### Environment
The project uses:
- Next.js 16
- React 19
- Tailwind CSS
- Firebase integration-ready config
- Supabase integration-ready config

### Run locally
```bash
npm install
npm run dev
```

Open:
- http://localhost:3000

### Production build
```bash
npm run build
```

## Environment files
A template file exists at:
- `.env.example`

Relevant keys include:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important project notes
### What is already implemented
- institutional public portal UI
- member login screen
- signup screen
- member equity dashboard
- local member state persistence
- branding/logo application
- real-estate member attribution logic

### What is still intentionally MVP-level
The current implementation is still a frontend MVP, not a production backend system.
It does not yet include:
- secure real authentication with Firebase/Supabase backend
- database-backed member records
- role-based authorization
- server-side transaction logic
- real land deed or legal ownership integration
- payment and contribution records linked to a backend
- email verification and SMS sending connected to true providers

## Recommended next implementation phase
To finish the project into a real production system, the next AI or developer should add:
1. Firebase or Supabase-authenticated member login
2. persistent database storage for member records
3. contribution ledger with transactional history
4. legal and land allocation mapping per member
5. admin-only management controls
6. secure document storage for contracts, land titles, and plot maps
7. member profile pages and dashboard access
8. real payment tracking and contribution verification

## AI handoff instructions
When continuing this project, the AI should:
- preserve the current branding and institutional design language
- keep the real-estate and member-equity objective at the center of decisions
- maintain the portal structure: landing page, login, signup, admin dashboard
- avoid generic templates that do not reflect the actual business logic
- implement future features as real-estate/member-capital functionality, not generic SaaS boilerplate
- treat land subdivision and equity allocation as the project’s core domain

## Summary
This project is not a generic Next.js starter. It is a custom Bunyoro Omuhama member-ownership portal for real-estate investment management, with a focus on:
- land acquisition
- equity participation
- member registration
- contribution tracking
- subdivision allocation planning
- institutional reporting for member and management visibility

The AI building from this handoff should continue from this domain-specific understanding instead of resetting to a generic board portal or starter application.
