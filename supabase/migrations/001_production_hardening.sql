-- Production hardening migration (run in Supabase SQL Editor if schema.sql was applied earlier).
-- Safe to run multiple times (uses IF EXISTS / IF NOT EXISTS where possible).

-- 1. Remove public lead inserts — leads must go through /api/leads (service role).
drop policy if exists "Public can insert leads" on public.leads;

-- 2. Site settings (editable from admin without redeploy).
create table if not exists public.site_settings (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- 3. Track content updates for sitemap lastModified.
alter table public.services add column if not exists updated_at timestamptz default now();
alter table public.projects add column if not exists updated_at timestamptz default now();
alter table public.blog_posts add column if not exists updated_at timestamptz default now();
alter table public.testimonials add column if not exists updated_at timestamptz default now();
alter table public.faqs add column if not exists updated_at timestamptz default now();
alter table public.media add column if not exists updated_at timestamptz default now();
