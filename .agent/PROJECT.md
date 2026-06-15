# Project

## Goal

Build a stable, demonstrable web dashboard for the Konoha-gotchi smart plant pot prototype. The dashboard should start with typed mock data, then later accept real sensor readings from Supabase after the ESP32 and Raspberry Pi data path is verified.

## Architecture

- Web dashboard: Next.js, React, TypeScript, deployed to Vercel.
- Data storage, later: Supabase.
- AI reports, later: Gemini API called only from server-side code.
- Hardware data path, later and out of this repo:
  - ESP32 reads sensors.
  - Raspberry Pi receives ESP32 JSON over HTTP.
  - Raspberry Pi uploads confirmed readings to Supabase.

## Repository Scope

This repository contains the web dashboard only. It may contain TypeScript data contracts and mock data that describe the expected sensor payloads, but it should not contain ESP32 firmware or Raspberry Pi receiver services.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS Modules
- Recharts

## Key Decisions

- Start with typed local mock data.
- Keep raw sensor values and normalized sensor values together.
- Use database/API-compatible snake_case field names for sensor reading payload data.
- Keep presentational component props simple and idiomatic.
- Delay Supabase, Raspberry Pi, ESP32, and Gemini implementation until each preceding step is confirmed.

## Milestones

### M0: Context and naming baseline

- Add project agent context files.
- Standardize dashboard data names and typo-like identifiers.

### M1: Typed mock dashboard data

- Move dashboard mock values out of JSX.
- Define shared TypeScript types for sensor readings, plant status, care advice, and AI reports.

### M2: Replaceable local data layer

- Add a small data access function that returns mock dashboard data.
- Keep it easy to replace with Supabase later.

### M3: Supabase schema proposal

- Draft schema only.
- Do not require Supabase setup until reviewed.

### M4: Real data integration

- Connect dashboard to Supabase only after Raspberry Pi upload is confirmed.

### M5: AI report integration

- Add Gemini only after real sensor data is visible on the dashboard.
