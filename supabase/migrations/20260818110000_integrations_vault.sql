-- Encrypted values are written only by server routes using the service-role key.
create table public.integration_settings (provider text primary key, encrypted_config text not null, key_version smallint not null default 1, updated_by uuid references public.profiles(id), updated_at timestamptz not null default now());
alter table public.integration_settings enable row level security;
revoke all on public.integration_settings from anon, authenticated;
create trigger integration_settings_updated_at before update on public.integration_settings for each row execute procedure private.set_updated_at();
