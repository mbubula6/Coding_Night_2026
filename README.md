# SmartCanteen
Project for hackathon Coding Night 2026 
Role-based food ordering platform built with SvelteKit + Supabase.

This project is designed for a canteen workflow with two user experiences:
- Client: browse dishes, place orders, track status, and collect ready meals with QR pickup.
- Employee: manage incoming orders, monitor performance, and verify pickup tickets.

The app includes real-time data refresh, role-based routing, inventory-aware ordering, and Android support through Capacitor.

## Recruiter Snapshot

If you are reviewing this repository as a hiring manager or recruiter, the most relevant points are:
- End-to-end full-stack ownership in one codebase (UI, server logic, auth, DB integration).
- Real business rules implemented: stock-aware ordering, worker/client separation, pickup verification.
- Security-minded patterns: signed pickup tokens, server-side auth checks, protected routes.
- Production-style architecture with reusable server helpers and typed SvelteKit routes.
- Mobile-ready packaging via Capacitor for Android.

## Product Features

### Authentication and Access Control
- Email/password login and Google OAuth login via Supabase Auth.
- Global route protection in server hooks.
- Role-based entry flow:
	- After login, users land on panel routing.
	- Worker accounts are redirected to employee pages.
	- Non-worker accounts are redirected to client pages.
- Root path redirects to login screen.

### Client Experience
- Daily menu with availability filtering based on product stock.
- Cart-based multi-order placement with planned pickup time slots.
- Automatic stock decrement for recipe ingredients after order placement.
- Auto-suggested product restock entries when inventory drops below threshold.
- Personalized dish recommendations from order history, time patterns, and weather context.
- Active and past order views.
- QR code generation for completed order pickup confirmation.

### Employee Experience
- Dashboard with claimed orders overview.
- Unclaimed orders list with required product breakdown.
- QR scanner page for pickup verification (camera + manual URL fallback).
- Personal stats page with chart visualization of completed workload over time.
- Operational sections for dishes, products, supplies, scanning, and settings.

### Shared Features
- Real-time invalidation on database changes using Supabase Realtime channels.
- Theme persistence (light/dark).
- Contact page with map and email sending API.
- Responsive UI optimized for desktop and mobile.

## Technical Stack

- Frontend: Svelte 5, SvelteKit 2, Tailwind CSS 4
- Backend: SvelteKit server routes + actions
- Database and Auth: Supabase (PostgreSQL + Auth + Realtime)
- Charts: Chart.js
- Maps: Leaflet + OpenStreetMap
- Email: Nodemailer
- QR: qrcode for generation, jsqr for scanning
- Mobile: Capacitor Android
- Language: TypeScript

## Architecture Overview

### Routing and Security
- Server hook initializes Supabase SSR client and enforces authenticated access to protected routes.
- Authentication callback exchanges OAuth code for session and redirects to panel.
- Panel route resolves role and redirects to appropriate section.

### Domain Logic Highlights
- Cart checkout validates stock before writing orders.
- Each ordered dish decrements linked product quantities.
- Low stock can trigger supply suggestion records.
- Pickup verification uses HMAC-signed token payloads.
- Realtime subscription invalidates stale server data automatically.

### Code Organization
- src/routes: route-level UI and server logic.
- src/lib: shared client/server utilities and stores.
- src/functions: reusable Supabase and utility helper functions.
- supabase/migrations: SQL migration history.

## Key Files to Review

- src/hooks.server.ts: auth/session handling and protected route guard.
- src/routes/panel/+page.server.ts: role-based redirect entrypoint.
- src/routes/client/cart/+page.server.ts: order placement and stock mutation logic.
- src/routes/client/+page.server.ts: recommendations and pickup QR token flow.
- src/lib/orderTicketToken.ts: signed order ticket creation and verification.
- src/routes/employee/scan/+page.svelte: QR scan UX and verification pipeline.

## Local Development

### 1. Prerequisites
- Node.js 20+
- npm
- Supabase project (hosted or local)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file in the project root with values similar to:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

ORDER_PICKUP_SECRET=change-this-to-a-long-random-secret
```

Notes:
- ORDER_PICKUP_SECRET must be at least 16 characters to enable pickup QR signing.
- For Google OAuth, configure redirect URL to /auth/callback in Supabase Auth settings.

### 4. Run the app

```bash
npm run dev
```

App starts in development mode and redirects unauthenticated users to login.

## Available Scripts

- npm run dev: Start dev server.
- npm run build: Build production bundle.
- npm run preview: Preview production build locally.
- npm run check: Run Svelte type checks.
- npm run check:watch: Run checks in watch mode.
- npm run lint: Prettier validation.
- npm run format: Prettier formatting.
- npm run cap:sync: Sync web build with Capacitor Android project.
- npm run cap:open: Open Android project in Android Studio.
- npm run cap:run: Build and run on Android target.

## Mobile (Android)

Capacitor integration is already included. Typical flow:
1. Build web assets.
2. Run capacitor sync.
3. Open or run Android project.

This allows camera/QR workflows to run in a native wrapper where browser camera constraints are less limiting.

## Engineering Practices Demonstrated

- Separation of concerns between route UI, server load/actions, and shared helpers.
- Defensive server-side validation before database mutations.
- Progressive enhancement for forms.
- Graceful fallback UX (manual pickup URL when camera unavailable).
- Reusable typed helper functions for Supabase nested data handling.

## Known Limitations / Next Improvements

- Add automated tests (unit + integration + e2e).
- Add stricter DB transactions around multi-step stock updates.
- Add observability and structured error reporting.
- Improve claim order workflow currently partly disabled in UI.
- Add CI pipeline with lint/type/test gates.

## Project Status

Active prototype with substantial production-oriented patterns and room for hardening.

