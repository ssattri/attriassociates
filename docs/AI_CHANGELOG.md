# AI change log

## 2026-08-17 — Leads & CRM foundation

- Added the live `/admin/enquiries` workspace for viewing, searching and filtering website service enquiries.
- Added staff-only workflow updates for enquiry status and priority, with a server-side role check.
- Added migration `20260817160000_crm_enquiry_audit.sql` to record each workflow change in `audit_logs` under RLS.

## 2026-08-17 — Admin command centre

- Rebuilt `/admin` to match the approved command-centre reference: navigation rail, operational header, metric cards, monitoring panels and responsive layout.
- Connected live Supabase data for the signed-in staff member, new service-enquiry count, priority attention count, recent enquiries and module states.
- Added secure staff-only module activation controls, a live refresh action, website shortcut and signed-out session action.
- Added `/api/admin/logout` and `/api/admin/modules/[key]`; both use the authenticated Supabase session and do not expose a service-role key.
- Verified with `npm run typecheck` and `npm run build`.

## Operating note

Only the modules implemented in the public website are affected by the module controls. Sales, booking, commerce and academy records will become live as their corresponding database migrations and admin screens are added.
