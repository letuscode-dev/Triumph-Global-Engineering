-- ============================================================

-- Triumph Global Engineering — Supabase schema

-- Run this in the Supabase SQL Editor to enable persistent

-- leads, content management and admin authentication.

-- ============================================================



-- ---------- LEADS ----------

create table if not exists public.leads (

  id          uuid primary key default gen_random_uuid(),

  name        text not null,

  company     text,

  phone       text not null,

  email       text,

  location    text,

  service     text,

  budget      text,

  message     text not null,

  status      text not null default 'new'

              check (status in ('new','contacted','quoted','won','lost')),

  source      text not null default 'quote'

              check (source in ('quote','contact')),

  created_at  timestamptz not null default now()

);



alter table public.leads enable row level security;



-- Leads are inserted only via /api/leads using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

-- Do NOT grant anon/authenticated INSERT on leads — the anon key is public in the browser bundle.



-- ---------- CONTENT TABLES ----------

-- Services

create table if not exists public.services (

  slug        text primary key,

  title       text not null,

  short_title text,

  category    text,

  icon        text,

  excerpt     text,

  description text,

  benefits    jsonb default '[]',

  process     jsonb default '[]',

  image       text,

  gallery     jsonb default '[]',

  keywords    jsonb default '[]',

  created_at  timestamptz default now(),

  updated_at  timestamptz default now()

);



-- Projects

create table if not exists public.projects (

  id           uuid primary key default gen_random_uuid(),

  title        text not null,

  slug         text unique,

  category     text,

  service_type text,

  location     text,

  completed_at date,

  description  text,

  cover        text,

  images       jsonb default '[]',

  video        text,

  before_image text,

  after_image  text,

  featured     boolean default false,

  created_at   timestamptz default now(),

  updated_at   timestamptz default now()

);



-- Blog posts

create table if not exists public.blog_posts (

  slug         text primary key,

  title        text not null,

  category     text,

  excerpt      text,

  content      text,

  cover        text,

  author       text,

  published_at timestamptz default now(),

  read_minutes int default 4,

  created_at   timestamptz default now(),

  updated_at   timestamptz default now()

);



-- Testimonials

create table if not exists public.testimonials (

  id         uuid primary key default gen_random_uuid(),

  name       text not null,

  role       text,

  location   text,

  rating     int default 5,

  quote      text,

  created_at timestamptz default now(),

  updated_at timestamptz default now()

);



-- FAQs

create table if not exists public.faqs (

  id         uuid primary key default gen_random_uuid(),

  question   text not null,

  answer     text,

  created_at timestamptz default now(),

  updated_at timestamptz default now()

);



-- Media library

create table if not exists public.media (

  id         uuid primary key default gen_random_uuid(),

  type       text check (type in ('image','video')) default 'image',

  src        text not null,

  caption    text,

  category   text,

  created_at timestamptz default now(),

  updated_at timestamptz default now()

);



-- Site settings (company contact info editable from admin)

create table if not exists public.site_settings (

  id         int primary key default 1 check (id = 1),

  data       jsonb not null default '{}'::jsonb,

  updated_at timestamptz not null default now()

);



-- Public read-only CMS data. Writes go through API routes with the service role.

do $$

declare t text;

begin

  foreach t in array array['services','projects','blog_posts','testimonials','faqs','media','site_settings']

  loop

    execute format('alter table public.%I enable row level security;', t);

    execute format($p$create policy "Public read %1$s" on public.%1$I for select to anon, authenticated using (true);$p$, t);

  end loop;

end $$;



-- ---------- STORAGE ----------

insert into storage.buckets (id, name, public)

values ('media', 'media', true)

on conflict (id) do nothing;



-- Public read for uploaded media files.

create policy "Public read media objects"

  on storage.objects for select

  to anon, authenticated

  using (bucket_id = 'media');



-- Admin uploads and credential storage use the service role (bypasses RLS).

-- The admin-secrets bucket is created at runtime and has no public policies.

