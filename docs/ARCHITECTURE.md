# Architecture decisions

## ADR-001 — Supabase replaces MySQL

The original brief named MySQL 8, while the owner's current direction explicitly selects Supabase. Supabase provides PostgreSQL, Auth, Storage and Realtime, so the application uses Supabase PostgreSQL as the system of record. Running both MySQL and Supabase would duplicate identity, migration and authorization concerns.

## Application boundaries

- Next.js App Router provides the public site, dashboards and server-side route handlers.
- Supabase Auth owns credentials and sessions. Application roles live in `profiles.role`; clients cannot set roles.
- PostgreSQL RLS is defense-in-depth on every exposed table. Server routes still validate input and authorization.
- Supabase Storage will hold media and private client files in separate buckets with distinct policies.
- Razorpay, Brevo, MSG91 and WhatsApp integrations will be server-only adapters with signed webhooks/queues.
- Financial records will use immutable snapshots and append-only event tables in the commerce phase.

## Delivery phases

1. Foundation: design system, public routes, SSR client, identity/RBAC schema, CMS, module control, enquiry intake.
2. Identity and CMS: login/reset/OAuth, staff permissions, media, admin CRUD and real dashboard metrics.
3. Consultation marketplace: profiles, slot capacity, holds, rooms, reschedule/cancel and reminders.
4. Commerce: catalogue, cart, server-priced checkout, Razorpay, GST, orders, invoices and shipping.
5. Academy/support: LMS, reviews, tickets, notifications and reporting.
6. Hardening/release: integration tests, accessibility/performance pass, backups, Hostinger deployment and monitoring.
