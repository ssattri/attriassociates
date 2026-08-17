# Hostinger deployment (Node.js/VPS)

Target Node.js 22 or newer. Supabase client libraries ended Node.js 20 support in June 2026.

## Vercel/Git import troubleshooting

The repository root must contain `package.json`, `package-lock.json`, `next.config.ts`, `app/` and `tsconfig.json`. In the import screen, choose the `attriassociates` repository and leave the Root Directory as `/`. `vercel.json` explicitly identifies this as a Next.js project. If Vercel still reports an unsupported framework, refresh the Git integration and import the latest `main` commit; do not select a nested folder.

1. Create the Supabase production project and apply reviewed migrations with the Supabase CLI or Dashboard SQL editor.
2. Create `.env.production` only on the server from `.env.example`. Never commit it.
3. Clone the repository, run `npm ci`, `npm run typecheck`, `npm run lint`, then `npm run build`.
4. Run `npm start` under Hostinger's Node process manager or PM2, bound to an internal port.
5. Configure the domain/reverse proxy to that port, enable SSL and redirect HTTP to HTTPS.
6. Set `NEXT_PUBLIC_SITE_URL=https://attriassociates.com`; update Supabase Auth Site URL and redirect allow-list.
7. Configure `/api/cron/*` calls with `Authorization: Bearer $CRON_SECRET` once workers are implemented.
8. Keep at least one previous release directory and environment backup for application rollback.

## Backup/restore

- Enable Supabase database backups/PITR appropriate to the plan. Storage objects are not part of database backups; export them separately.
- Before releases, take a database backup and record the deployed Git commit.
- Prefer forward-fix migrations. If rollback is required, restore to a new project first, validate, then switch environment variables during maintenance.
