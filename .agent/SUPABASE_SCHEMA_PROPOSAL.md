# Supabase Schema Proposal

## Purpose

Draft the first Supabase database shape for the Konoha-gotchi dashboard before any project access, credentials, migrations, or runtime integration are added.

This proposal is intentionally review-only. It preserves the current web-only repository boundary while defining the data contracts that the future Raspberry Pi uploader, Supabase project, and Next.js dashboard can share.

## Sources Checked

- Supabase Row Level Security docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Data API security docs: https://supabase.com/docs/guides/api/securing-your-api
- Supabase Data API grant changelog, published 2026-04-28: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- Current local TypeScript data contract: `app/types/plant.ts`
- Current local mock dashboard data: `app/data/mock_data.ts`

Important Supabase note for implementation: new public tables may no longer be automatically exposed to the Supabase Data API. Any implementation migration should bundle explicit `GRANT` statements, `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, and matching policies together.

## Goals

- Preserve the existing sensor payload names:
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
- Support one smart plant pot now, without blocking multiple plants/devices later.
- Keep raw sensor values and normalized display values together.
- Let the Next.js data access layer replace local mock data without changing page components.
- Keep writes server-side only: Raspberry Pi ingestion and Gemini report generation should never require client-side secret keys.

## Non-Goals

- No Supabase project setup in this step.
- No migrations in this step.
- No Supabase client, environment variables, or credentials in this step.
- No ESP32 firmware or Raspberry Pi receiver implementation in this repository.
- No Gemini implementation in this step.

## Proposed Access Model

For the first Supabase implementation, use a conservative split:

- Dashboard reads: Next.js server-side data access reads Supabase and maps records into the existing TypeScript shapes.
- Sensor writes: Raspberry Pi ingestion writes through server-side code only.
- AI report writes: Gemini generation writes through server-side code only.
- Browser clients: no direct writes.
- Secrets: keep service-role keys server-only and never prefix them with `NEXT_PUBLIC_`.

If the dashboard must read directly from the browser later, expose only read-safe tables with explicit `anon` `SELECT` grants and RLS `SELECT` policies. Do not grant browser roles `INSERT`, `UPDATE`, or `DELETE` on sensor readings, reports, or advice tables.

## Tables

### `public.plants`

Stores the durable plant profile currently represented by `PlantProfile`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal plant id. |
| `name` | `text not null` | Example: `Kono-Chan`. |
| `species` | `text not null` | Example: `Monstera deliciosa (Swiss Cheese Plant)`. |
| `description` | `text not null` | Dashboard/profile copy. |
| `image_path` | `text not null` | Maps to TypeScript `imagePath`. |
| `created_at` | `timestamptz not null default now()` | Audit timestamp. |
| `updated_at` | `timestamptz not null default now()` | Updated by application code or trigger. |

### `public.plant_facts`

Stores profile facts such as age, origin, and type.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `label` | `text not null` | Example: `Age`. |
| `value` | `text not null` | Example: `1.5 Years`. |
| `sort_order` | `integer not null default 0` | Stable display order. |

### `public.plant_tags`

Stores dashboard tags such as health, soil moisture preference, and light preference.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `label` | `text not null` | Current UI label. |
| `value` | `text not null` | Current UI value. |
| `icon_path` | `text not null` | Maps to TypeScript `iconPath`. |
| `sort_order` | `integer not null default 0` | Stable display order. |

### `public.devices`

Stores known sensor devices. The external `device_id` remains the payload identifier.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal device id. |
| `device_id` | `text not null unique` | Example: `konoha-esp32-01`. |
| `plant_id` | `uuid not null references public.plants(id) on delete restrict` | Plant currently monitored. |
| `display_name` | `text not null` | Friendly name for admin/debugging. |
| `installed_at` | `timestamptz` | Optional setup timestamp. |
| `is_active` | `boolean not null default true` | Allows retiring a device without deleting history. |
| `created_at` | `timestamptz not null default now()` | Audit timestamp. |

### `public.sensor_readings`

Stores raw and normalized readings from the ESP32/Raspberry Pi data path.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint generated by default as identity primary key` | Efficient time-series row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete restrict` | Denormalized for fast dashboard queries. |
| `device_id` | `text not null references public.devices(device_id) on delete restrict` | Matches incoming payload. |
| `timestamp` | `timestamptz not null` | Measurement time from device/gateway. |
| `soil_moisture_raw` | `integer not null` | Raw analog reading. |
| `soil_moisture_percent` | `numeric(5,2) not null check (soil_moisture_percent >= 0 and soil_moisture_percent <= 100)` | Normalized moisture percent. |
| `temperature_c` | `numeric(5,2) not null` | Celsius. |
| `humidity_percent` | `numeric(5,2) not null check (humidity_percent >= 0 and humidity_percent <= 100)` | Relative humidity. |
| `light_lux` | `numeric(10,2) not null check (light_lux >= 0)` | Light level. |
| `sensor_status` | `text not null check (sensor_status in ('ok', 'warning', 'error', 'offline'))` | Matches `SensorStatus`. |
| `battery_or_power_status` | `text` | Example: `usb_power`. |
| `notes` | `text` | Optional diagnostic note. |
| `created_at` | `timestamptz not null default now()` | Insert timestamp. |

Recommended constraints and indexes:

- `unique (device_id, timestamp)` to avoid duplicate gateway uploads.
- `index sensor_readings_plant_timestamp_idx on (plant_id, timestamp desc)` for latest reading and charts.
- `index sensor_readings_device_timestamp_idx on (device_id, timestamp desc)` for hardware debugging.

### `public.plant_health_snapshots`

Stores computed dashboard health state derived from recent sensor readings.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint generated by default as identity primary key` | Internal row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `source_reading_id` | `bigint references public.sensor_readings(id) on delete set null` | Reading that informed the snapshot. |
| `plant_status` | `text not null check (plant_status in ('Good', 'Needs water', 'Too dark', 'Too hot', 'Too dry', 'Sensor error'))` | Matches `PlantStatus`. |
| `plant_hp_percent` | `integer not null check (plant_hp_percent >= 0 and plant_hp_percent <= 100)` | Current dashboard health score. |
| `mood_emoji` | `text not null` | Current dashboard mood icon/text. |
| `mood_label` | `text not null` | Example: `Happy`. |
| `mood_description` | `text not null` | Example: `Thriving and content`. |
| `generated_at` | `timestamptz not null default now()` | Computation timestamp. |

### `public.metric_thresholds`

Stores plant-specific metric ranges used to classify readings and build chart summaries.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `metric_key` | `text not null check (metric_key in ('soil_moisture', 'light', 'temperature', 'humidity'))` | Matches `SensorMetricKey`. |
| `display_title` | `text not null` | Example: `Soil moisture`. |
| `unit` | `text not null` | Example: `%`, `lux`, `C`. |
| `optimal_min` | `numeric(10,2) not null` | Lower ideal bound. |
| `optimal_max` | `numeric(10,2) not null` | Upper ideal bound. |
| `display_range` | `text not null` | Human range shown on plant info page. |
| `sort_order` | `integer not null default 0` | Stable display order. |

Presentation colors, chart labels, and icon paths can stay in the web data layer unless the team wants non-developers to edit them from Supabase later.

### `public.care_guidelines`

Stores static plant care guidance shown on the plant info page.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `title` | `text not null` | Guideline title. |
| `body` | `text not null` | Guideline copy. |
| `sort_order` | `integer not null default 0` | Stable display order. |

### `public.care_advice`

Stores active and historical actionable advice for the dashboard.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal row id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `source_reading_id` | `bigint references public.sensor_readings(id) on delete set null` | Reading that informed the advice. |
| `title` | `text not null` | Example: `Care advice`. |
| `body` | `text not null` | Advice copy. |
| `action_label` | `text` | Example: `Mark as Watered`. |
| `image_path` | `text` | Maps to TypeScript `imagePath`. |
| `status` | `text not null default 'active' check (status in ('active', 'completed', 'dismissed'))` | Advice lifecycle. |
| `created_at` | `timestamptz not null default now()` | Creation timestamp. |
| `resolved_at` | `timestamptz` | Completed/dismissed timestamp. |

### `public.ai_reports`

Stores future server-side Gemini report output. No API keys or prompts with secrets belong in this table.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal report id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `source_reading_id` | `bigint references public.sensor_readings(id) on delete set null` | Reading that informed the report. |
| `plant_message` | `text not null` | Matches `AiReport.plant_message`. |
| `condition_summary` | `text not null` | Matches `AiReport.condition_summary`. |
| `near_future_prediction` | `text not null` | Matches `AiReport.near_future_prediction`. |
| `model_name` | `text` | Optional model trace, no secret values. |
| `prompt_version` | `text` | Optional app-owned prompt/version id. |
| `generated_at` | `timestamptz not null default now()` | Matches `AiReport.generated_at`. |

Recommended index:

- `index ai_reports_plant_generated_at_idx on (plant_id, generated_at desc)`

### `public.activity_events`

Stores timeline events from sensor alerts, watering actions, calibration notes, and AI summaries.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Internal event id. |
| `plant_id` | `uuid not null references public.plants(id) on delete cascade` | Parent plant. |
| `source_reading_id` | `bigint references public.sensor_readings(id) on delete set null` | Optional reading link. |
| `event_type` | `text not null` | Example: `sensor_alert`, `watering`, `calibration`, `ai_report`. |
| `title` | `text not null` | Timeline title. |
| `description` | `text` | Timeline description. |
| `icon_path` | `text` | Maps to TypeScript `iconPath`. |
| `icon_background_color` | `text` | Maps to TypeScript `iconBackgroundColor`. |
| `metadata` | `jsonb not null default '{}'::jsonb` | Extra structured context. |
| `occurred_at` | `timestamptz not null default now()` | Event time. |
| `created_at` | `timestamptz not null default now()` | Insert timestamp. |

Recommended index:

- `index activity_events_plant_occurred_at_idx on (plant_id, occurred_at desc)`

## Derived Dashboard Data

The current `app/data/dashboard_data.ts` accessors can map Supabase rows into existing page shapes:

- `PlantProfile`: `plants` plus `plant_facts`.
- `PlantTag[]`: `plant_tags`.
- `SensorReading`: latest `sensor_readings` row.
- `SensorMetricSummary[]`: latest `sensor_readings` plus recent history and `metric_thresholds`; presentation icon/color metadata can remain in application code.
- `DashboardMood` and health score: latest `plant_health_snapshots`.
- `CareAdvice`: latest active `care_advice`.
- `AiReport`: latest `ai_reports`.
- `TimelineData`: `sensor_readings` history, weekly aggregates, and `activity_events`.

If a database view is added later for latest readings or dashboard summary rows, create it with `security_invoker = true` on Postgres 15+ so the view respects underlying RLS policies.

## RLS and Grants Sketch

Exact policies depend on whether the reviewed dashboard is public or authenticated. The implementation should choose one of these modes.

### Mode A: Public Read-Only Dashboard

Use when the class demo dashboard is intentionally public.

- Grant `anon` only `SELECT` on read-safe tables.
- Grant `service_role` full access for server-side ingestion/report jobs.
- Enable RLS on every exposed table.
- Add `SELECT` policies that allow public read only for approved tables.
- Do not grant `anon` any writes.

Tables likely safe for public read in this mode:

- `plants`
- `plant_facts`
- `plant_tags`
- `sensor_readings`
- `plant_health_snapshots`
- `metric_thresholds`
- `care_guidelines`
- `care_advice`
- `ai_reports`
- `activity_events`

Consider excluding `devices` from `anon` reads if device identifiers should not be public.

### Mode B: Server-Only Reads and Writes

Use when raw readings should not be exposed directly through the browser.

- Do not grant `anon` access to the tables.
- Keep Supabase access inside Next.js server-side data access functions.
- Use server-only credentials for reads and writes.
- Still enable RLS on public tables as defense in depth.

This is the safer default if there is uncertainty about data privacy.

## Initial SQL Sketch

This is not a migration yet. It is here to make the proposal concrete and reviewable.

```sql
create table public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null,
  description text not null,
  image_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  plant_id uuid not null references public.plants(id) on delete restrict,
  display_name text not null,
  installed_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.sensor_readings (
  id bigint generated by default as identity primary key,
  plant_id uuid not null references public.plants(id) on delete restrict,
  device_id text not null references public.devices(device_id) on delete restrict,
  timestamp timestamptz not null,
  soil_moisture_raw integer not null,
  soil_moisture_percent numeric(5,2) not null
    check (soil_moisture_percent >= 0 and soil_moisture_percent <= 100),
  temperature_c numeric(5,2) not null,
  humidity_percent numeric(5,2) not null
    check (humidity_percent >= 0 and humidity_percent <= 100),
  light_lux numeric(10,2) not null check (light_lux >= 0),
  sensor_status text not null
    check (sensor_status in ('ok', 'warning', 'error', 'offline')),
  battery_or_power_status text,
  notes text,
  created_at timestamptz not null default now(),
  unique (device_id, timestamp)
);

create index sensor_readings_plant_timestamp_idx
  on public.sensor_readings (plant_id, timestamp desc);

create index sensor_readings_device_timestamp_idx
  on public.sensor_readings (device_id, timestamp desc);
```

The full implementation migration should include the remaining tables, explicit grants, RLS, policies, indexes, and seed data after this proposal is reviewed.

## Open Review Questions

1. Should the dashboard be public read-only, or should all Supabase reads stay server-only?
2. Should `devices.device_id` be visible in public dashboard data?
3. Is one plant enough for the prototype seed data, or should the first migration seed multiple plant/device rows?
4. Should the Raspberry Pi upload directly to a protected server endpoint, or directly to Supabase using a restricted database role?
5. How much sensor history should the dashboard keep for the class demo?

## Recommended Implementation Sequence After Supabase Access

1. Confirm the access model: public read-only dashboard vs server-only reads.
2. Create a migration from this proposal.
3. Add explicit grants, enable RLS, and define policies in the same migration.
4. Seed one `plants` row, one `devices` row, and mock-equivalent starter data.
5. Run Supabase advisors or the available MCP advisor equivalent.
6. Replace `app/data/dashboard_data.ts` internals with Supabase reads while preserving its exported functions.
7. Run `npm run build` and verify the dashboard renders the same shape of data.
