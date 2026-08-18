-- Link bookings to signed-in clients without exposing anyone else's records.
alter table public.consultation_bookings add column if not exists customer_id uuid references public.profiles(id);
create index if not exists consultation_bookings_customer_idx on public.consultation_bookings(customer_id, created_at desc);
create policy "clients read own consultation bookings" on public.consultation_bookings for select to authenticated
  using (customer_id = (select auth.uid()));
