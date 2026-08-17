# Attri Associates & Vastu Consultants

Production platform for architecture, scientific Vastu consulting, commerce, courses and client operations. The application is being delivered in working vertical slices; see [Architecture](docs/ARCHITECTURE.md), [AI log](docs/AI_LOG.md) and [Changelog](CHANGELOG.md).

## Local setup

Requirements: Node.js 22+, npm and a Supabase project.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Apply `supabase/migrations/20260817150000_phase_one_foundation.sql` to a development Supabase project after review. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; never expose the secret key to client code.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Documentation

- [Architecture and phased roadmap](docs/ARCHITECTURE.md)
- [Hostinger deployment and backups](docs/HOSTINGER_DEPLOYMENT.md)
- [External integration checklist](docs/INTEGRATION_CHECKLIST.md)
- [AI handoff log](docs/AI_LOG.md)
- [Changelog](CHANGELOG.md)

No demo credentials or production data are committed. Seed accounts should be created through a controlled development-only script in the authentication phase.
