-- Phase 2: permit authenticated staff to record workflow changes.
-- The application route also validates staff role, and RLS enforces it again.

create policy "staff create audit logs"
on public.audit_logs
for insert
to authenticated
with check (
  (select private.is_staff())
  and actor_id = (select auth.uid())
);

grant insert on public.audit_logs to authenticated;
