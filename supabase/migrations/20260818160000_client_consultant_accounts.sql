-- Public workspaces. A signup may request consultant workspace, but never grants
-- the consultant application role; approval remains an administrator action.
alter table public.profiles
  add column if not exists workspace_type text not null default 'client'
    check (workspace_type in ('client','consultant')),
  add column if not exists consultant_application_status text not null default 'not_applicable'
    check (consultant_application_status in ('not_applicable','pending','approved','rejected'));

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare requested_workspace text := coalesce(new.raw_user_meta_data ->> 'workspace_type', 'client');
begin
  if requested_workspace not in ('client','consultant') then requested_workspace := 'client'; end if;
  insert into public.profiles (id, full_name, phone, workspace_type, consultant_application_status)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 100),
    nullif(left(coalesce(new.raw_user_meta_data ->> 'phone', ''), 40), ''),
    requested_workspace,
    case when requested_workspace = 'consultant' then 'pending' else 'not_applicable' end
  );
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public;

grant update (workspace_type, consultant_application_status, role, account_status) on public.profiles to authenticated;

-- Existing profile policies already permit each authenticated account to read its own row.
-- No client/consultant can grant or modify a role through the Data API.
