# Triumph Global Engineering — Website

A modern, mobile-responsive, SEO-optimised, content-managed website for
**Triumph Global Engineering**, a Zimbabwean engineering company specialising
in borehole drilling, water solutions, irrigation systems and solar
installations.

Built with **Next.js 16 (App Router, Turbopack)**, **React 19**, **TypeScript**,
**Tailwind CSS**, **Supabase** and **Cloudinary**.

---

## Features

- **Marketing site**: Home, About, Services (9 dedicated service pages),
  Projects portfolio (with filtering & before/after sliders), Media Gallery
  (masonry + lightbox), Blog/News, Request a Quote, and Contact (map + FAQ).
- **Lead capture**: Quote and contact forms feed straight into the admin
  dashboard (and Supabase when configured). Submissions are validated with Zod,
  rate-limited per IP, and protected by a honeypot.
- **Admin dashboard** at `/admin`:
  - Overview with stats & recent leads
  - Lead management (status tracking, search, **CSV export**)
  - Content management for Services, Projects, Blog, Testimonials, FAQs
  - Media library with **drag-and-drop bulk upload** to Cloudinary
  - Analytics (lead/inquiry statistics)
  - Settings & integration status
- **SEO**: dynamic metadata, Open Graph + Twitter cards, dynamic OG image,
  `sitemap.xml`, `robots.txt`, and JSON-LD schema (LocalBusiness, Service,
  BlogPosting, FAQPage, Breadcrumbs).
- **Conversion**: floating WhatsApp button, sticky call button, and quote CTAs
  throughout the site (including a quote form on every service page).
- **Runs out of the box** in "demo mode" with built-in content even before you
  add Supabase / Cloudinary keys.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env.local   # (Windows: copy .env.example .env.local)

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>. The admin dashboard is at
<http://localhost:3000/admin> (default demo password: `triumph-admin`).

---

## Environment variables

All variables are optional — the site works with demo data without them. See
`.env.example` for the full list. The important ones:

| Variable                                                                     | Purpose                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                       | Canonical site URL (for SEO / sitemap)                   |
| `ADMIN_PASSWORD`                                                             | Admin dashboard password (**change this!**)              |
| `ADMIN_SESSION_TOKEN`                                                        | Random secret used to HMAC-sign the admin session cookie |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`                 | Supabase project                                         |
| `SUPABASE_SERVICE_ROLE_KEY`                                                  | Server-side Supabase key (keep secret)                   |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary uploads                                       |
| `RESEND_API_KEY` / `RESEND_FROM`                                             | Email delivery of leads via Resend                       |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`                        | Optional Redis-backed rate limiting (multi-instance)     |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                                                | WhatsApp number (international format)                   |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`                                              | Google Analytics 4 (loads only after cookie consent)     |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED`                                              | Google Maps embed URL for the contact page               |

### Security & persistence notes

- The admin login uses an **HMAC-signed, 12-hour session cookie**. Always set a
  strong `ADMIN_PASSWORD` and a random `ADMIN_SESSION_TOKEN` in production.
- The lead API has a **honeypot field** and **per-IP rate limiting** (5 requests
  / 10 min). Leads are inserted **server-side only** (no public Supabase INSERT
  policy). Set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` to make
  the limiter work across multiple serverless instances; otherwise it falls back
  to an in-memory limiter.
- Production builds **fail at startup** if required env vars are missing (see
  `src/instrumentation.ts` and PRODUCTION.md).
- Public pages use **ISR** (`revalidate = 60s`) and the admin CMS triggers
  **on-demand revalidation** so edits appear within seconds.
- **Security headers** (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, CSP `frame-ancestors`) are applied in
  `next.config.mjs`; the admin area is marked `noindex`.
- The Image Optimizer is restricted to trusted hosts (Cloudinary, Unsplash,
  Supabase). CMS images from other hosts render un-optimised via `SafeImage`.
- **Google Analytics** loads only after the visitor accepts the cookie-consent
  banner.
- When Supabase is configured, **all CMS content and leads persist to the
  database** and appear on the public site. Without it, the site runs from
  seeded demo content kept in memory.

---

## Connecting Supabase (permanent storage)

1. Create a project at <https://app.supabase.com>.
2. Open the **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `leads`, content, and `site_settings` tables with Row Level Security.
3. If you applied an older schema, also run
   [`supabase/migrations/001_production_hardening.sql`](./supabase/migrations/001_production_hardening.sql).
3. Copy your Project URL and keys into `.env.local`.
4. (Optional) Create an admin user under **Authentication → Users** to use
   Supabase Auth instead of the demo password gate.

Once configured, lead submissions are stored in the `leads` table and survive
restarts/deploys.

## Media uploads

Uploads work automatically once **Supabase** is connected — the `supabase/schema.sql`
script creates a public `media` storage bucket, and the admin **Media** page (and
image fields) upload through a protected server route (`/api/admin/upload`) using the
service-role key. No extra setup or third-party account is required.

**Cloudinary is optional.** If you set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (an _unsigned_ preset from
<https://cloudinary.com>), it takes priority over Supabase Storage. Note Cloudinary
is currently unavailable in some countries (incl. Zimbabwe), in which case just rely
on Supabase Storage.

---

## Editing content

- **Company details, phone numbers, socials**: **Admin → Settings** (no redeploy), or defaults in `src/lib/site.ts`
- **Default services / projects / blog / testimonials / FAQs**: `src/lib/content.ts`
- **Live content**: use the Admin Dashboard at `/admin`.

> In demo mode (no Supabase), admin changes are kept in memory and reset on
> server restart. Connect Supabase for permanent persistence.

---

## SEO target keywords

Borehole Drilling Zimbabwe · Borehole Drilling Harare · Borehole Survey
Zimbabwe · Borehole Deepening Zimbabwe · Borehole Pump Installation Zimbabwe ·
Irrigation Systems Zimbabwe · Irrigation Design Zimbabwe · Solar Installations
Zimbabwe · Water Solutions Zimbabwe · Engineering Services Zimbabwe.

---

## Scripts

| Command                                   | Description                                          |
| ----------------------------------------- | ---------------------------------------------------- |
| `npm run dev`                             | Start the development server                         |
| `npm run build`                           | Production build                                     |
| `npm run start`                           | Run the production build                             |
| `npm run lint`                            | Lint the project                                     |
| `npm run typecheck`                       | Type-check with the TypeScript compiler              |
| `npm run format` / `npm run format:check` | Format (write/check) with Prettier                   |
| `npm run test:unit`                     | Run Vitest unit tests                                |
| `npm run test:e2e`                        | Run Playwright smoke tests (builds + starts the app) |

---

## Deployment

**→ Full production checklist, env vars, domain, SEO, and security:**
see **[PRODUCTION.md](./PRODUCTION.md)**.

Quick path — deploy to **Vercel** (recommended for Next.js):

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example` (see PRODUCTION.md §2).
4. Deploy. Set up Google Search Console with your `sitemap.xml`.

---

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, RLS)
- Cloudinary (image & video storage)
- lucide-react icons

> Admin route protection lives in `src/proxy.ts` (Next.js 16 renamed the
> `middleware` convention to `proxy`). Linting runs via the ESLint CLI
> (`npm run lint`) using the flat config in `eslint.config.mjs`, since Next.js 16
> removed `next lint`.
