# Plan: Dashboard Data Model

## Goal

Prepare the web dashboard for future real sensor data by replacing scattered hardcoded values with typed local mock data and consistent naming.

## Scope

- Project context files in `.agent/` and `AGENTS.md`.
- Web dashboard TypeScript types and mock data.
- Existing web component variable, prop, and file names that represent dashboard data concepts.

## Out of Scope

- ESP32 firmware.
- Raspberry Pi receiver code.
- Supabase setup or schema migration.
- Gemini API integration.
- Automatic watering, pumps, or actuator control.

## Steps

1. Create project context files.
2. Define shared TypeScript types for sensor readings, plant status, care advice, activity items, and AI reports.
3. Move homepage dashboard mock data into a local typed data file.
4. Standardize typo-like and inconsistent names in existing web components.
5. Run the production build.

## Verification

- `npm run build`

## Progress

- [x] Baseline build checked.
- [x] Context files created.
- [x] Types and mock data added.
- [x] Existing names standardized.
- [x] Build passes after changes.
