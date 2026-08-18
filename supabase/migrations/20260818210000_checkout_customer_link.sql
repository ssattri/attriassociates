alter table public.checkout_requests add column if not exists customer_id uuid references public.profiles(id);
create index if not exists checkout_requests_customer_idx on public.checkout_requests(customer_id,created_at desc);
create policy "clients read own checkout requests" on public.checkout_requests for select to authenticated using(customer_id=(select auth.uid()));
