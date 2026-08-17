create table public.testimonials (id uuid primary key default gen_random_uuid(),client_name text not null,service text not null,location text,quote text not null,rating smallint not null default 5 check(rating between 1 and 5),status public.publish_status not null default 'draft',sort_order integer not null default 0,created_by uuid references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),deleted_at timestamptz);
create index testimonials_public_idx on public.testimonials(status,sort_order) where deleted_at is null;
create trigger testimonials_updated_at before update on public.testimonials for each row execute procedure private.set_updated_at();
alter table public.testimonials enable row level security;
create policy "published testimonials public" on public.testimonials for select to anon,authenticated using(status='published' and deleted_at is null);
create policy "staff manage testimonials" on public.testimonials for all to authenticated using((select private.is_staff())) with check((select private.is_staff()));
grant select on public.testimonials to anon,authenticated; grant insert,update,delete on public.testimonials to authenticated;
