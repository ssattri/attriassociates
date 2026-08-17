create table public.articles (id uuid primary key default gen_random_uuid(),title text not null,slug text not null unique,category text not null default 'Knowledge',excerpt text not null default '',body jsonb not null default '[]',featured_image_path text,status public.publish_status not null default 'draft',publish_at timestamptz,created_by uuid references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),deleted_at timestamptz,check(slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'));
create index articles_public_idx on public.articles(status,publish_at) where deleted_at is null;
create trigger articles_updated_at before update on public.articles for each row execute procedure private.set_updated_at();
alter table public.articles enable row level security;
create policy "published articles public" on public.articles for select to anon,authenticated using(status='published' and deleted_at is null and (publish_at is null or publish_at<=now()));
create policy "staff manage articles" on public.articles for all to authenticated using((select private.is_staff())) with check((select private.is_staff()));
grant select on public.articles to anon,authenticated;grant insert,update,delete on public.articles to authenticated;
