alter table public.checkout_requests add column if not exists order_id uuid unique references public.orders(id);
