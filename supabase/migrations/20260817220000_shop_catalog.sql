create table public.products (id uuid primary key default gen_random_uuid(),title text not null,slug text not null unique,category text not null,description text not null default '',price_paise integer not null default 0 check(price_paise>=0),currency text not null default 'INR',image_path text,stock_status text not null default 'in_stock' check(stock_status in('in_stock','out_of_stock','preorder')),status public.publish_status not null default 'draft',sort_order integer not null default 0,created_by uuid references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),deleted_at timestamptz,check(slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'));
create index products_public_idx on public.products(status,sort_order) where deleted_at is null;
create trigger products_updated_at before update on public.products for each row execute procedure private.set_updated_at();
alter table public.products enable row level security;
create policy "published products public" on public.products for select to anon,authenticated using(status='published' and deleted_at is null);
create policy "staff manage products" on public.products for all to authenticated using((select private.is_staff())) with check((select private.is_staff()));
grant select on public.products to anon,authenticated;grant insert,update,delete on public.products to authenticated;
