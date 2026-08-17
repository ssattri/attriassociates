-- Phase 5: portfolio projects managed by staff and visible when published.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique,
  category text not null, location text, summary text not null default '', body jsonb not null default '[]',
  featured_image_path text, gallery jsonb not null default '[]', status public.publish_status not null default 'draft',
  featured boolean not null default false, sort_order integer not null default 0, created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
  constraint project_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);
create index projects_public_idx on public.projects(status, featured, sort_order) where deleted_at is null;
create trigger projects_updated_at before update on public.projects for each row execute procedure private.set_updated_at();
alter table public.projects enable row level security;
create policy "published projects public" on public.projects for select to anon,authenticated using (status='published' and deleted_at is null);
create policy "staff manage projects" on public.projects for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
grant select on public.projects to anon,authenticated;
grant insert,update,delete on public.projects to authenticated;
