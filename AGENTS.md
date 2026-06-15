# AGENTS.md

## Project Overview

Konoha-gotchi is an ICT Systems Design class prototype for a smart plant pot. This repository, `konoha-website`, owns only the web dashboard. It should display plant profile data, sensor readings, plant status, care advice, and later server-side AI reports.

Hardware firmware and gateway/server work are intentionally out of scope for this repository:
- ESP32 firmware will live in a separate firmware repository.
- Raspberry Pi receiver/gateway code will live in a separate Raspberry Pi repository.
- This web repository may define data contracts and mock data, but should not assume hardware code lives here.

## Workspace Layout

- `app/`: Next.js App Router pages, route-local components, styles, mock data, and shared types.
- `public/`: Static images and icons used by the dashboard.
- `.agent/`: Project context, status, and execution plans for Codex sessions.

## Required Reading Order

At the start of each session, read:

1. `AGENTS.md`
2. `.agent/PROJECT.md`
3. `.agent/STATUS.md`
4. The active plan listed in `.agent/STATUS.md`, if any

## Development Rules

- Work in small, safe, testable steps.
- Keep the web dashboard decoupled from ESP32 firmware and Raspberry Pi code.
- Use TypeScript types clearly for sensor readings, plant status, care advice, and AI reports.
- Keep mock data replaceable by a future API/data layer.
- Do not add Supabase or Gemini integration until the user confirms the earlier steps are ready.
- Never expose secret keys in client-side code.
- Do not use `NEXT_PUBLIC_` for Supabase service-role keys, Gemini API keys, or other secrets.

## Naming Rules

- Use one name for one concept across files, variables, data fields, and future API/schema contracts.
- Sensor reading payload fields should use the planned database/API names:
  - `device_id`
  - `timestamp`
  - `soil_moisture_raw`
  - `soil_moisture_percent`
  - `temperature_c`
  - `humidity_percent`
  - `light_lux`
  - `sensor_status`
  - `battery_or_power_status`
  - `notes`
- In UI labels, use:
  - `Soil moisture`
  - `Light level`
  - `Temperature`
  - `Air humidity`
- Use `sensors` for the dashboard route/nav section, not singular `sensor`.
- Use `iconPath` for local static asset paths.

## Verification

- Run `npm run build` before committing code changes.
- Treat build warnings as baseline notes unless the current task is specifically to fix them.
