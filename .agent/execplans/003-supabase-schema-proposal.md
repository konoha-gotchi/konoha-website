# Plan: Supabase Schema Proposal

## Goal

Draft a reviewable Supabase schema proposal for the web dashboard before Supabase project access or database migrations are introduced.

## Scope

- `.agent/SUPABASE_SCHEMA_PROPOSAL.md`
- `.agent/STATUS.md`

## Out of Scope

- Supabase setup, credentials, MCP project changes, or migrations.
- Next.js Supabase client integration.
- Raspberry Pi receiver code.
- ESP32 firmware.
- Gemini API integration.

## Steps

1. Review the current TypeScript dashboard data contract.
2. Check current Supabase RLS and Data API guidance.
3. Draft table, access model, RLS/grant, and implementation-sequence proposal.
4. Run the production build.
5. Update project status.

## Verification

- `npm run build`

## Progress

- [x] Current dashboard data contract reviewed.
- [x] Supabase RLS and Data API guidance checked.
- [x] Schema proposal drafted.
- [x] Production build passes.
- [x] Project status updated.
