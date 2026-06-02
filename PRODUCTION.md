# Production launch guide — Triumph Global Engineering

This document is the **single reference for going live**. Keep it with the project.
Do **not** commit `.env.local` or paste secret keys into this file — store secrets only
in your hosting provider’s environment settings.

**Last updated:** June 2026  
**Stack:** Next.js 16 · React 19 · Supabase · Supabase Storage · Google Analytics 4

---

## Current integration status (local dev)

| Integration        | Status   | Notes                                      |
| ------------------ | -------- | ------------------------------------------ |
| Supabase           | Configured | Database, CMS content, leads, storage      |
| Media uploads      | Configured | Supabase Storage (`media` bucket)          |
| Google Analytics   | Configured | ID `G-FYMXDJ721F`, consent-gated           |
| Cloudinary         | Not used | Supabase Storage handles all uploads       |
| Lead email (Resend)| Configured | Notifications to `LEADS_NOTIFY_EMAIL`      |
| Rate limit (Upstash)| Not set | Recommended for production — see §7        |

---

## Recommended order of work

1. **Security** — change admin password and session secret (§3).
2. **Content** — replace demo copy/images with real company content via `/admin`.
3. **Optional email** — Resend for instant lead notifications (§6).
4. **Git + deploy** — push to GitHub, deploy on Vercel (§8).
5. **Domain** — point `triumphglobal.co.zw` (or your domain) to Vercel (§9).
6. **SEO** — Google Search Console + verify sitemap (§10).
7. **Post-launch** — monitoring, backups, content workflow (§11–§12).

---

## 1. Prerequisites

- **Node.js 20.9+** (required by Next.js 16).
- **Git** repository (GitHub recommended for Vercel).
- **Supabase project** — already created (`xyolxuomcvewqqsmldnd`).
- **Google Analytics 4** property — already created (`G-FYMXDJ721F`).

### Project folder

If you ever see random 404s or `MODULE_NOT_FOUND` in dev, stop the server,
delete `.next`, and run `npm run dev` again.

---

## 2. Environment variables (production)

Copy every variable from your local `.env.local` into the host’s **Environment
Variables** panel (e.g. Vercel → Project → Settings → Environment Variables).
Use **Production** (and optionally Preview) scope.

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Canonical URL, e.g. `https://www.triumphglobal.co.zw` |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Server-only; uploads, CMS writes, leads |
| `ADMIN_PASSWORD` | **Yes** | Admin login — **must not stay `triumph-admin`** |
| `ADMIN_SESSION_TOKEN` | **Yes** | Long random string for signed session cookies |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Recommended | `G-FYMXDJ721F` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recommended | e.g. `263779651626` |
| `LEADS_NOTIFY_EMAIL` | Recommended | Where new leads are emailed |
| `RESEND_API_KEY` | Optional | Email delivery (§6) |
| `RESEND_FROM` | Optional | Verified sender in Resend |
| `UPSTASH_REDIS_REST_URL` | Optional | Multi-instance rate limiting (§7) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Paired with Upstash URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED` | Optional | Contact page map iframe URL |
| `NEXT_PUBLIC_CLOUDINARY_*` | Not used | Leave empty — media uses Supabase Storage |

**Never** expose `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_TOKEN`, or
`RESEND_API_KEY` to the browser (no `NEXT_PUBLIC_` prefix).

Template without secrets: see `.env.example`.

---

## 3. Security checklist (do before go-live)

- [ ] Open **Admin → Settings → Admin password** and set a strong password (8+ characters).
      This saves a hashed password in Supabase Storage (`admin-secrets` bucket). After that,
      the dashboard password is **not** the default `triumph-admin` anymore.
- [ ] Alternatively (or for first deploy), set a strong `ADMIN_PASSWORD` in production env
      before go-live, then change it from Settings once live.
- [ ] Generate a new `ADMIN_SESSION_TOKEN` (e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`).
- [ ] Confirm `.env.local` is **not** committed (listed in `.gitignore`).
- [ ] Rotate Supabase **secret key** if it was ever shared in chat or email
      (Supabase → Project Settings → API → rotate, then update env everywhere).
- [ ] Use **HTTPS only** in production (Vercel provides this automatically).
- [ ] Admin routes are protected by `src/proxy.ts` and return 401 for API calls
      without a valid session cookie.

Default demo login (`triumph-admin`) must **not** remain on the live site.

---

## 4. Supabase (production)

### Already done

- Schema applied (`supabase/schema.sql`) — tables + RLS + public `media` bucket + `site_settings`.
- If upgrading from an older schema, run `supabase/migrations/001_production_hardening.sql`
  (removes public lead inserts, adds `site_settings`, adds `updated_at` columns).
- Starter content seeded (services, projects, blog, testimonials, FAQs, media).
- Leads persist to the `leads` table.

### Supabase dashboard URLs

- Project: `https://supabase.com/dashboard/project/xyolxuomcvewqqsmldnd`
- Table Editor — view/edit leads and content directly.
- Storage → `media` — uploaded files from the admin Media page.

### Re-seed demo content (if needed)

From the project root (with `.env.local` present):

```bash
npx tsx --env-file=.env.local scripts/seed-supabase.ts
```

**Warning:** This clears and re-inserts all CMS tables with bundled starter content.

### Storage limits

Free tier includes ~**1 GB** storage. Monitor under **Storage** in Supabase.
Upgrade the plan if you upload many large videos.

### Backups

- Enable **Point-in-Time Recovery** or regular backups on a paid Supabase plan
  for business-critical data.
- Export leads periodically from **Admin → Leads → CSV export**.

---

## 5. Media uploads (Supabase Storage)

- Uploads go through **`POST /api/admin/upload`** (admin-authenticated only).
- Files land in the public **`media`** bucket.
- Public URLs look like:
  `https://xyolxuomcvewqqsmldnd.supabase.co/storage/v1/object/public/media/...`
- Max file size: **50 MB** per upload (images and videos).
- Media uploads use **Supabase Storage** only. Do not set Cloudinary env vars.

---

## 6. Lead email notifications (Resend) — optional but recommended

Without Resend, leads still appear in **Admin → Leads** and in Supabase; you
just won’t get an email alert.

### Setup

1. Create an account at [https://resend.com](https://resend.com).
2. **API Keys** → Create API key → copy it.
3. Add to `.env.local` (and production env):

   ```env
   RESEND_API_KEY=re_xxxxxxxx
   RESEND_FROM=Triumph Global <onboarding@resend.dev>
   LEADS_NOTIFY_EMAIL=ruserewellington22@gmail.com
   ```

   - For **development**, Resend allows sending from `onboarding@resend.dev` to
     verified recipients only — add `ruserewellington22@gmail.com` in the Resend dashboard
     if test emails do not arrive.
   - For **production**, verify your domain in Resend and set `RESEND_FROM` to
     e.g. `Triumph Global <noreply@triumphglobal.co.zw>`.

4. Restart the dev server (`npm run dev`).
5. Go to **Admin → Settings → Lead email alerts** → click **Send test email**.
6. Submit a test quote on the site and confirm the notification arrives.

---

## 7. Rate limiting (Upstash Redis) — recommended for production

The lead form allows **5 submissions per IP per 10 minutes**. On Vercel, each
request may hit a different server, so the in-memory limiter is weak.

For reliable protection:

1. Create a free Redis database at [https://console.upstash.com](https://console.upstash.com).
2. Copy **REST URL** and **REST TOKEN**.
3. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in production env.

---

## 8. Deploy to Vercel (recommended)

### 8.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial production-ready site"
git remote add origin https://github.com/YOUR_ORG/triumph-global-engineering.git
git push -u origin main
```

Ensure `.env.local` is **not** in the commit.

### 8.2 Import on Vercel

1. [https://vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. **Environment Variables** — paste all vars from §2 (Production).
4. Deploy.

### 8.3 Verify the deployment

- [ ] Homepage loads over HTTPS.
- [ ] `/admin` redirects to login; login works with production password.
- [ ] Submit a test lead; appears in Admin and Supabase.
- [ ] Upload an image in Admin → Media; URL opens in browser.
- [ ] Cookie banner appears; after Accept, GA Realtime shows a visit.
- [ ] `https://YOUR_DOMAIN/sitemap.xml` and `/robots.txt` return 200.

### 8.4 CI (optional)

GitHub Actions workflow is in `.github/workflows/ci.yml` (lint, typecheck, format, build, Playwright).

---

## 9. Custom domain

1. Vercel → Project → **Settings → Domains** → add `www.triumphglobal.co.zw`
   (and optionally apex `triumphglobal.co.zw`).
2. At your domain registrar, add the DNS records Vercel shows (usually `CNAME`
   for `www`, `A` or `ALIAS` for apex).
3. Wait for DNS propagation (minutes to 48 hours).
4. Update production env:

   ```env
   NEXT_PUBLIC_SITE_URL=https://www.triumphglobal.co.zw
   ```

5. Redeploy so sitemap, Open Graph, and JSON-LD use the correct URL.

---

## 10. SEO & analytics after launch

### Google Search Console

1. [https://search.google.com/search-console](https://search.google.com/search-console)
2. Add property for your domain.
3. Verify ownership (DNS TXT record or HTML tag via Vercel if needed).
4. Submit sitemap: `https://www.triumphglobal.co.zw/sitemap.xml`

### Google Analytics

- Property already uses **`G-FYMXDJ721F`**.
- In GA4: **Admin → Data streams** → set the stream URL to your live domain.
- Tracking only runs after users **accept** cookies (built-in consent banner).

### Google Maps (contact page)

1. Google Maps → share/embed map for your office.
2. Copy the **embed iframe `src`** URL.
3. Set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED` in production env.

---

## 11. Content & admin workflow

| Task | Where |
| ---- | ----- |
| Edit services, projects, blog, FAQs, testimonials | `/admin` → relevant section |
| Upload photos/videos | `/admin/media` or image fields in content editors |
| View/export leads | `/admin/leads` |
| Company phone, email, social links | **Admin → Settings** (or defaults in `src/lib/site.ts`) |
| Check integration status | `/admin/settings` |

After CMS edits, public pages refresh within ~60 seconds (ISR) or immediately
(on-demand revalidation when saving via the admin API).

Replace Unsplash placeholder images with real project photos before marketing
the site publicly.

---

## 12. Ongoing maintenance

| Frequency | Action |
| --------- | ------ |
| Weekly | Review new leads in admin; respond within 24h |
| Monthly | Check Supabase storage usage; review GA traffic |
| Quarterly | Rotate admin password; review `npm audit`; update dependencies |
| As needed | `npm run build` locally before major releases; run `npm run test:e2e` |

### Useful commands

```bash
npm run dev          # local development
npm run build        # production build test
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test:e2e     # Playwright smoke tests
```

### If something breaks after deploy

1. Check Vercel **Deployment logs** and **Runtime logs**.
2. Confirm all env vars are set for **Production** (not only Preview).
3. Supabase **Logs** for API/storage errors.
4. Admin 404 in dev → delete `.next`, restart dev server.

---

## 13. Quick reference — important URLs

| Resource | URL |
| -------- | --- |
| Local site | http://localhost:3000 |
| Local admin | http://localhost:3000/admin |
| Supabase dashboard | https://supabase.com/dashboard/project/xyolxuomcvewqqsmldnd |
| Google Analytics | https://analytics.google.com |
| Google Search Console | https://search.google.com/search-console |
| Vercel | https://vercel.com/dashboard |

---

## 14. Pre-launch checklist (printable)

- [ ] Strong `ADMIN_PASSWORD` and `ADMIN_SESSION_TOKEN` in production env
- [ ] `NEXT_PUBLIC_SITE_URL` set to live domain
- [ ] All Supabase keys in production env
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-FYMXDJ721F`
- [ ] Real content and images in admin (not demo placeholders)
- [ ] Test lead submission on production URL
- [ ] Test media upload on production admin
- [ ] Custom domain + HTTPS working
- [ ] Sitemap submitted to Search Console
- [ ] WhatsApp / phone numbers correct in `src/lib/site.ts`
- [ ] (Optional) Resend email for leads
- [ ] (Optional) Upstash for rate limiting

---

*For day-to-day development setup, see [README.md](./README.md).*
