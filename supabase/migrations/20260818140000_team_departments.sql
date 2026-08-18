alter table public.profiles add column if not exists department text;
grant update(department) on public.profiles to authenticated;
