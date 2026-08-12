# AMJ Mark — Print-on-Demand DTF Website

Next.js 16 storefront: custom DTF gang sheets (via the standalone builder at
`/design`), preset sheet sizes, ready-pressed apparel, wholesale pricing,
Stripe checkout, guest + account orders, and an admin dashboard.

## Stack

Next.js (App Router) + TypeScript + Tailwind · Supabase (Postgres, Auth,
Storage) · Prisma · Stripe Checkout · Resend.

## One-time account setup

You'll need four free accounts. Create each, then fill in `.env` (copy
`.env.example` to `.env` first).

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`,
   the `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the
   `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`.
3. **Project Settings → Database → Connection string**:
   - Copy the **Transaction pooler** (pgbouncer, port 6543) string →
     `DATABASE_URL`.
   - Copy the **Direct connection** (port 5432) string → `DIRECT_URL`.
   - Both need your DB password filled into the `[YOUR-PASSWORD]` placeholder.
4. Run migrations and seed data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Open the **SQL Editor** in Supabase and run everything in
   [`supabase/setup.sql`](supabase/setup.sql) — this adds the trigger that
   creates a `profiles` row on signup and creates the public `designs`
   storage bucket for print files.
6. Sign up for an account on the running site (`/account/signup`), then in
   the SQL Editor run:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   That account can now see `/admin`.

### 2. Stripe

1. Create an account at [stripe.com](https://stripe.com) (stay in **test mode**).
2. **Developers → API keys**: copy the secret key → `STRIPE_SECRET_KEY`,
   publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Webhook — for local dev, use the Stripe CLI instead of the dashboard:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a `whsec_...` value — put that in `STRIPE_WEBHOOK_SECRET`.
   For production, add a webhook endpoint in the dashboard pointed at
   `https://amjmark.com/api/webhooks/stripe` listening for
   `checkout.session.completed`, and use *that* signing secret instead.

### 3. Resend

1. Create an account at [resend.com](https://resend.com).
2. **API Keys**: create one → `RESEND_API_KEY`.
3. Either verify `amjmark.com` under **Domains** and set
   `RESEND_FROM_EMAIL="AMJ Mark <orders@amjmark.com>"`, or leave the default
   Resend sandbox sender for initial testing.

### 4. Vercel (deploy)

1. Push this repo to GitHub, then import it at [vercel.com](https://vercel.com).
2. Add every variable from `.env` to the Vercel project's Environment
   Variables, with `NEXT_PUBLIC_SITE_URL` set to your real domain.
3. Add `amjmark.com` under **Settings → Domains** and follow Vercel's DNS
   instructions — **do this only when you're ready to point the live
   domain at the new site.**
4. Add a Stripe webhook endpoint for the production URL (see above) before
   flipping Stripe from test to live keys.

## Local development

```bash
npm install
npm run dev              # http://localhost:3000
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # separate terminal
```

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed placeholder products + pricing rules (`prisma/seed.ts`) |
| `npm run db:studio` | Open Prisma Studio to browse/edit data |

## End-to-end test checklist

1. `/shop` — placeholder products load.
2. `/design` → `/gang-sheet-builder.html` — upload an image, Auto Build,
   Add to Cart → redirected to `/cart` with the design in it.
3. `/cart` → `/checkout` — fill shipping info → redirected to Stripe.
4. Pay with test card `4242 4242 4242 4242`, any future expiry/CVC.
5. Redirected to `/order/confirmation` showing the order; `stripe listen`
   terminal shows the webhook firing; order appears in `/admin` and, if you
   were logged in, `/account`.
6. Confirmation email arrives (customer) and an alert lands at
   aabushaa@gmail.com.
