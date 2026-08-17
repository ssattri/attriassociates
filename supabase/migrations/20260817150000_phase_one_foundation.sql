-- Phase 1: accounts, CMS, module controls and enquiries.
-- After creating the first Auth user, promote it manually in Supabase SQL Editor:
-- update public.profiles set role = 'super_admin' where id = 'AUTH_USER_UUID';

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;

create type public.app_role as enum ('super_admin','admin','manager','staff','consultant','customer');
create type public.publish_status as enum ('draft','scheduled','published','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  role public.app_role not null default 'customer',
  full_name text not null default '', phone text, avatar_path text,
  account_status text not null default 'active' check (account_status in ('active','suspended','pending','closed')),
  locale text not null default 'en-IN', timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  excerpt text, body jsonb not null default '[]', featured_image_path text,
  seo_title text, meta_description text, keywords text[] not null default '{}', og jsonb not null default '{}',
  canonical_url text, status public.publish_status not null default 'draft', publish_at timestamptz,
  sort_order integer not null default 0, created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
  constraint scheduled_requires_date check (status <> 'scheduled' or publish_at is not null)
);
create index pages_publication_idx on public.pages(status,publish_at,sort_order);

create table public.module_controls (
  key text primary key, label text not null, active boolean not null default true,
  navigation_visible boolean not null default true, homepage_visible boolean not null default false,
  maintenance_message text, activate_at timestamptz, deactivate_at timestamptz,
  visible_roles public.app_role[] not null default '{}', sort_order integer not null default 0,
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('ENQ-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  customer_id uuid references public.profiles(id), name text not null, email text not null, phone text not null,
  service text not null, message text not null, source_page text, assigned_to uuid references public.profiles(id),
  priority text not null default 'normal' check(priority in ('low','normal','high','urgent')),
  status text not null default 'new' check(status in ('new','contacted','qualified','proposal_sent','follow_up','converted','closed','spam')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz
);
create index enquiries_work_queue_idx on public.enquiries(status,priority,created_at desc);

create table public.audit_logs (
  id bigint generated always as identity primary key, actor_id uuid references public.profiles(id),
  action text not null, entity_type text not null, entity_id text, metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure private.handle_new_user();

create function private.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and account_status = 'active'
      and role in ('super_admin','admin','manager','staff')
  );
$$;
revoke all on function private.is_staff() from public;
grant execute on function private.is_staff() to authenticated;

create function private.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function private.set_updated_at() from public;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure private.set_updated_at();
create trigger pages_updated_at before update on public.pages for each row execute procedure private.set_updated_at();
create trigger modules_updated_at before update on public.module_controls for each row execute procedure private.set_updated_at();
create trigger enquiries_updated_at before update on public.enquiries for each row execute procedure private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.module_controls enable row level security;
alter table public.enquiries enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles read own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "staff read profiles" on public.profiles for select to authenticated using ((select private.is_staff()));
create policy "published pages public" on public.pages for select to anon,authenticated using (status = 'published' and deleted_at is null and (publish_at is null or publish_at <= now()));
create policy "staff manage pages" on public.pages for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "active modules public" on public.module_controls for select to anon,authenticated using (active and (activate_at is null or activate_at <= now()) and (deactivate_at is null or deactivate_at > now()));
create policy "staff manage modules" on public.module_controls for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "enquiries public create" on public.enquiries for insert to anon,authenticated with check (customer_id is null or customer_id = (select auth.uid()));
create policy "enquiries read own" on public.enquiries for select to authenticated using (customer_id = (select auth.uid()));
create policy "staff manage enquiries" on public.enquiries for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff read audit logs" on public.audit_logs for select to authenticated using ((select private.is_staff()));

-- Explicit Data API grants are required by current Supabase projects.
grant select on public.pages, public.module_controls to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select on public.enquiries, public.profiles, public.audit_logs to authenticated;
grant update (full_name,phone,avatar_path,locale,timezone,updated_at) on public.profiles to authenticated;
grant insert, update, delete on public.pages, public.module_controls, public.enquiries to authenticated;

insert into public.module_controls(key,label,active,navigation_visible,homepage_visible,sort_order) values
  ('services','Services',true,true,true,10),
  ('consultations','Consultations',true,true,true,20),
  ('projects','Projects',true,true,true,30),
  ('courses','Courses',true,true,false,40),
  ('shop','Shop',true,true,false,50),
  ('blog','Blog',true,true,true,60);
