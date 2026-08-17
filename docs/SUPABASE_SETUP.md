# Supabase phase-one migration

The public website works without a database. This is the one migration required before enabling accounts, CMS pages, module controls, enquiries or dashboards.

The Supabase Auth endpoint is reachable. This workspace does not have a Supabase CLI login, database password, or MCP database authorization, so it cannot safely execute schema changes against the remote project.

In Supabase Dashboard SQL Editor, run the migration file once. Then create the first Auth user and run the bootstrap instruction at the top of that file.
