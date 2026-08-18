-- An approved consultant can see only bookings explicitly assigned to them.
create policy "approved consultants read assigned bookings" on public.consultation_bookings for select to authenticated
using (
  assigned_to = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'consultant'
      and account_status = 'active'
      and consultant_application_status = 'approved'
  )
);
