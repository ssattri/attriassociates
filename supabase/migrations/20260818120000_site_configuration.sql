create table public.site_settings (key text primary key, value jsonb not null default '{}', updated_by uuid references public.profiles(id), updated_at timestamptz not null default now());
alter table public.site_settings enable row level security;
create policy "public read site settings" on public.site_settings for select to anon,authenticated using(true);
create policy "staff manage site settings" on public.site_settings for all to authenticated using((select private.is_staff())) with check((select private.is_staff()));
grant select on public.site_settings to anon,authenticated;grant insert,update,delete on public.site_settings to authenticated;
create trigger site_settings_updated_at before update on public.site_settings for each row execute procedure private.set_updated_at();
insert into public.site_settings(key,value) values('identity_contact','{"business_name":"Attri Associates & Vastu Consultants","tagline":"Infinite World of Vedic & Modern Vastu Science","primary_email":"attriassociates99@gmail.com","secondary_email":"","primary_phone":"+91 9990777716","secondary_phone":"","whatsapp_number":"+91 9990777716","emergency_phone":"","address":"1887, G.F., Sector-8, 7/8 Dividing Road, Faridabad, Haryana-121006","hours":"Monday to Friday · 10:00 AM to 05:00 PM","facebook":"","instagram":"","youtube":"","linkedin":""}'::jsonb) on conflict(key) do nothing;
