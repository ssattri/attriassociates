-- Phase 3: public consultation requests and protected staff queue.
create table public.consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('CON-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  name text not null, email text not null, phone text not null,
  consultation_type text not null, preferred_date date, preferred_time text,
  notes text not null default '', status text not null default 'requested' check (status in ('requested','confirmed','completed','cancelled')),
  assigned_to uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index consultation_bookings_queue_idx on public.consultation_bookings(status, preferred_date, created_at desc);
create trigger consultation_bookings_updated_at before update on public.consultation_bookings for each row execute procedure private.set_updated_at();
alter table public.consultation_bookings enable row level security;
create policy "public create consultation booking" on public.consultation_bookings for insert to anon,authenticated with check (char_length(name) between 2 and 100 and char_length(notes) <= 3000);
create policy "staff manage consultation bookings" on public.consultation_bookings for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
grant insert on public.consultation_bookings to anon, authenticated;
grant select, update, delete on public.consultation_bookings to authenticated;
