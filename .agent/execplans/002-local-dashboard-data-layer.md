# Plan: Local Dashboard Data Layer

## Goal

Add a small replaceable data access layer for the web dashboard so pages no longer import mock data directly.

## Scope

- `app/data/`
- Dashboard, sensors, plant info, and timeline route data imports.
- `.agent/STATUS.md`

## Out of Scope

- Supabase setup, schema migrations, or credentials.
- ESP32 firmware.
- Raspberry Pi receiver code.
- Gemini API integration.

## Steps

1. Add async data access functions that return typed mock data.
2. Update dashboard routes/components to consume the data access functions.
3. Run the production build.
4. Update project status.

## Verification

- `npm run build`

## Progress

- [x] Data access functions added.
- [x] Dashboard routes/components use the data access layer.
- [x] Production build passes.
- [x] Project status updated.
