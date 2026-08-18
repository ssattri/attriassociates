create function private.is_super_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=(select auth.uid()) and account_status='active' and role='super_admin') $$;
revoke all on function private.is_super_admin() from public;grant execute on function private.is_super_admin() to authenticated;
create policy "super admin manage profiles" on public.profiles for update to authenticated using((select private.is_super_admin())) with check((select private.is_super_admin()));
grant update(role,account_status) on public.profiles to authenticated;
