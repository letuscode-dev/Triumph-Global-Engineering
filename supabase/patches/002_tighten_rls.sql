-- Patch 002: tighten RLS (run on existing Supabase projects)
-- Safe to run multiple times — uses IF EXISTS where possible.

-- Leads: remove overly permissive authenticated policies
drop policy if exists "Admins can read leads" on public.leads;
drop policy if exists "Admins can update leads" on public.leads;
drop policy if exists "Admins can delete leads" on public.leads;

-- Content: remove authenticated write-all policies
do $$
declare t text;
begin
  foreach t in array array['services','projects','blog_posts','testimonials','faqs','media']
  loop
    execute format('drop policy if exists "Admin write %1$s" on public.%1$I;', t);
  end loop;
end $$;

-- Storage: public read for media bucket only
drop policy if exists "Public read media objects" on storage.objects;

create policy "Public read media objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');
