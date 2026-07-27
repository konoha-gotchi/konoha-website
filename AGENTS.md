# AGENTS.md

Project-wide Konoha-gotchi context is centralized in the sibling
`../konoha-hub` directory.

Before planning or editing this repository, read:

1. `../konoha-hub/AGENTS.md`
2. `../konoha-hub/PROJECT_CONTEXT.md`
3. `../konoha-hub/CURRENT_STATUS.md`
4. `../konoha-hub/IMPLEMENTED.md`
5. `../konoha-hub/INTERFACES.md`
6. `../konoha-hub/ROADMAP.md`

This repository owns the Next.js dashboard, Supabase migrations and
server-only integration, the protected ingestion endpoint, and future
server-only Gemini work. It does not own ESP32 firmware or Raspberry Pi
services.

Do not recreate a local `.agent/` context directory. Update the hub after a
verified milestone changes project status, interfaces, or sequencing.
