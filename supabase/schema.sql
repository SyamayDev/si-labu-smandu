create extension if not exists pgcrypto;

do $$ begin
  create type public.report_status as enum ('Baru', 'Ditangani', 'Selesai');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type public.reporter_status as enum ('Korban', 'Saksi');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  phone text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists is_admin boolean not null default false;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  report_code text not null unique,
  reporter_name text not null,
  reporter_class text not null,
  reporter_phone text not null,
  reporter_status public.reporter_status not null,
  incident_types text[] not null,
  incident_date date not null,
  incident_time time not null,
  incident_location text not null,
  description text not null,
  is_ongoing boolean not null default false,
  status public.report_status not null default 'Baru',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  handled_at timestamptz,
  handled_by uuid references public.profiles(id),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id),
  constraint reports_name_length check (char_length(btrim(reporter_name)) between 1 and 120),
  constraint reports_class_length check (char_length(btrim(reporter_class)) between 1 and 40),
  constraint reports_phone_length check (char_length(btrim(reporter_phone)) between 8 and 20),
  constraint reports_types_length check (cardinality(incident_types) between 1 and 6),
  constraint reports_description_length check (char_length(btrim(description)) between 1 and 2000)
);

create table if not exists public.report_attachments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  mime_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 26214400),
  created_at timestamptz not null default now(),
  uploaded_by uuid references public.profiles(id)
);

create table if not exists public.report_activity_logs (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  admin_id uuid references public.profiles(id),
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create index if not exists reports_status_idx on public.reports(status);
create index if not exists reports_created_at_idx on public.reports(created_at desc);
create index if not exists attachments_report_id_idx on public.report_attachments(report_id);

create or replace function public.next_report_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_year text := extract(year from current_date)::text;
  next_number integer;
begin
  perform pg_advisory_xact_lock(hashtext('si-labu-report-code-' || current_year));
  select coalesce(max((substring(report_code from '[0-9]+$'))::integer), 0) + 1
    into next_number
    from public.reports
   where report_code like 'LABU-' || current_year || '-%';
  return 'LABU-' || current_year || '-' || lpad(next_number::text, 4, '0');
end;
$$;

create or replace function public.set_report_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.report_code is null or btrim(new.report_code) = '' then
    new.report_code := public.next_report_code();
  end if;
  new.reporter_name := btrim(new.reporter_name);
  new.reporter_class := btrim(new.reporter_class);
  new.reporter_phone := btrim(new.reporter_phone);
  new.incident_location := btrim(new.incident_location);
  new.description := btrim(new.description);
  return new;
end;
$$;

drop trigger if exists reports_set_defaults on public.reports;
create trigger reports_set_defaults
before insert on public.reports
for each row execute procedure public.set_report_defaults();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
drop trigger if exists reports_touch_updated_at on public.reports;
create trigger reports_touch_updated_at before update on public.reports for each row execute procedure public.touch_updated_at();
drop trigger if exists settings_touch_updated_at on public.site_settings;
create trigger settings_touch_updated_at before update on public.site_settings for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_attachments enable row level security;
alter table public.report_activity_logs enable row level security;
alter table public.site_settings enable row level security;

revoke all on public.profiles, public.reports, public.report_attachments, public.report_activity_logs, public.site_settings from anon;
revoke all on public.profiles, public.reports, public.report_attachments, public.report_activity_logs, public.site_settings from authenticated;
grant insert on public.reports to anon;
grant select, insert, update on public.profiles, public.reports, public.report_attachments, public.report_activity_logs, public.site_settings to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Drop policies first so this file can be safely rerun.
drop policy if exists "public may submit reports" on public.reports;
drop policy if exists "admins read reports" on public.reports;
drop policy if exists "admins update reports" on public.reports;
drop policy if exists "admins manage profiles" on public.profiles;
drop policy if exists "admins manage attachments" on public.report_attachments;
drop policy if exists "admins manage logs" on public.report_activity_logs;
drop policy if exists "admins read settings" on public.site_settings;
drop policy if exists "admins write settings" on public.site_settings;

create policy "public may submit reports"
on public.reports for insert to anon, authenticated
with check (
  status = 'Baru'::public.report_status
  and handled_at is null
  and handled_by is null
  and resolved_at is null
  and resolved_by is null
  and char_length(btrim(reporter_name)) between 1 and 120
  and char_length(btrim(description)) between 1 and 2000
  and cardinality(incident_types) between 1 and 6
);
create policy "admins read reports" on public.reports for select to authenticated using (public.is_admin());
create policy "admins update reports" on public.reports for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage attachments" on public.report_attachments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage logs" on public.report_activity_logs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read settings" on public.site_settings for select to authenticated using (public.is_admin());
create policy "admins write settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('report-attachments', 'report-attachments', false)
on conflict (id) do update set public = false;
drop policy if exists "admins read private report files" on storage.objects;
drop policy if exists "authenticated upload report files" on storage.objects;
drop policy if exists "admins delete private report files" on storage.objects;
create policy "admins read private report files" on storage.objects for select to authenticated using (bucket_id = 'report-attachments' and public.is_admin());
create policy "authenticated upload report files" on storage.objects for insert to authenticated with check (bucket_id = 'report-attachments' and public.is_admin());
create policy "admins delete private report files" on storage.objects for delete to authenticated using (bucket_id = 'report-attachments' and public.is_admin());
