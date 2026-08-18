drop policy if exists "public create checkout requests" on public.checkout_requests;
create policy "public create checkout requests" on public.checkout_requests for insert to anon,authenticated with check(
  char_length(name) between 2 and 100
  and char_length(address) between 8 and 1000
  and total_paise>=0
  and (customer_id is null or customer_id=(select auth.uid()))
);
