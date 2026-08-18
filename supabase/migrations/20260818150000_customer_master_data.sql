-- Customer master data: independent CRM records, not customer login accounts.
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (char_length(email) <= 180),
  phone text not null check (char_length(phone) <= 40),
  company text,
  city text,
  state text,
  gstin text,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_status_created_idx on public.customers(status, created_at desc);
create index customers_email_idx on public.customers(lower(email));
create trigger customers_updated_at before update on public.customers for each row execute procedure private.set_updated_at();

alter table public.customers enable row level security;
create policy "staff manage customers" on public.customers for all to authenticated
  using ((select private.is_staff())) with check ((select private.is_staff()));

grant select, insert, update, delete on public.customers to authenticated;
