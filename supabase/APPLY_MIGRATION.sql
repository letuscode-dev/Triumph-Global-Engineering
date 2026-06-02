-- ============================================================
-- Triumph Global Engineering — apply on existing Supabase projects
-- Run once in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run (uses IF EXISTS / IF NOT EXISTS).
-- ============================================================

-- ---------- 001: Production hardening ----------

drop policy if exists "Public can insert leads" on public.leads;

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

alter table public.services add column if not exists updated_at timestamptz default now();
alter table public.projects add column if not exists updated_at timestamptz default now();
alter table public.blog_posts add column if not exists updated_at timestamptz default now();
alter table public.testimonials add column if not exists updated_at timestamptz default now();
alter table public.faqs add column if not exists updated_at timestamptz default now();
alter table public.media add column if not exists updated_at timestamptz default now();

-- ---------- 002: Tighten RLS (legacy projects) ----------

drop policy if exists "Admins can read leads" on public.leads;
drop policy if exists "Admins can update leads" on public.leads;
drop policy if exists "Admins can delete leads" on public.leads;

do $$
declare t text;
begin
  foreach t in array array['services','projects','blog_posts','testimonials','faqs','media']
  loop
    execute format('drop policy if exists "Admin write %1$s" on public.%1$I;', t);
  end loop;
end $$;

drop policy if exists "Public read media objects" on storage.objects;

create policy "Public read media objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Seed empty site_settings row if missing
insert into public.site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
