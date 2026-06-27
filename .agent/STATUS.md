# Status

## Current milestone

M4: Supabase server-only data integration implemented, pending Raspberry Pi gateway repository integration.

Active plan: none

## Done

- Raspberry Pi basic setup is complete outside this repository.
- Basic Next.js dashboard skeleton exists.
- Website is already deployed to Vercel.
- Baseline `npm run build` passes before the data naming refactor.
- Repository context files exist.
- Shared TypeScript data types exist for plant profile, sensor readings, care advice, activity items, and AI reports.
- Dashboard, sensors, plant info, and timeline pages use centralized typed mock data.
- Typo-like and inconsistent data names have been standardized.
- Replaceable local dashboard data access functions wrap typed mock data for all dashboard routes.
- `npm run build` passes after the local data layer change.
- Supabase schema proposal is drafted in `.agent/SUPABASE_SCHEMA_PROPOSAL.md`.
- Supabase schema migrations are committed under `supabase/migrations/`.
- Supabase application tables, RLS, server-only grants, policies, indexes, and seed data are applied.
- Dashboard data access functions read from Supabase on the server when server env vars are configured.
- Local mock data fallback remains available only when `KONOHA_USE_MOCK_FALLBACK=true`.
- Protected Raspberry Pi ingestion endpoint contract exists at `/api/readings/ingest`.

## Not yet done

- Integrate the separate Raspberry Pi gateway repository with `/api/readings/ingest`.
- Add Gemini server-side report generation.

## Next recommended step

Configure Vercel Production and Preview environment variables, then point the separate Raspberry Pi gateway repository at `/api/readings/ingest` with `KONOHA_INGESTION_TOKEN`.
