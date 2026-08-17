alter table public.checkout_requests add column razorpay_payment_link_id text unique, add column razorpay_payment_link_url text, add column razorpay_payment_link_status text;
create index checkout_requests_razorpay_idx on public.checkout_requests(razorpay_payment_link_id) where razorpay_payment_link_id is not null;
