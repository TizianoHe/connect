# Spotted

A two-sided discovery platform connecting SMEs with potential clients.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend / Auth / Storage**: Supabase
- **Deploy**: Vercel

---

## Getting started

### 1. Clone and install

```bash
git clone <repo>
cd connect
npm install
```

### 2. Set up Supabase

Create a free project at [supabase.com](https://supabase.com), then:

1. Run the migration in **SQL Editor**:
   - Paste and run `supabase/migrations/20260504000001_initial.sql`
2. Run the seed in **SQL Editor**:
   - Paste and run `supabase/seed.sql`
3. Go to **Authentication → URL Configuration** and add:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth-callback`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add the four env vars in Vercel → Settings → Environment Variables
4. Update Supabase URL Configuration with your production domain

---

## Project structure

```
src/
  app/
    (auth)/          # Login, signup, auth-callback — no chrome
    (dashboard)/     # SME dashboard — sidebar layout
    onboarding/      # 4-step profile wizard
  components/
    auth/            # LoginForm, SignupForm
    onboarding/      # Step1–4 forms, StepIndicator
    dashboard/       # Sidebar, ProfileCompletenessCard
    ui/              # Button, Input, Textarea, Badge
    shared/          # Logo, LoadingSpinner
  lib/
    supabase/        # Browser + server clients
    validations/     # Zod schemas
  types/             # Database types
supabase/
  migrations/        # SQL schema
  seed.sql           # Service categories seed data
```

---

## Phase 2 (next)

- Client browse page: grid of SME cards with search + filter by category and location
- Individual SME profile page
- Landing page improvements
