# Supabase Integration

## Access Model

Konoha-gotchi uses server-only Supabase access.

- Browser code does not import or call Supabase directly.
- Do not create `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, or any other public Supabase variable.
- Next.js server code reads and writes through `@supabase/supabase-js` with `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.
- Prefer a new-format Supabase secret key beginning with `sb_secret_`.
- Use a legacy `service_role` key only if the project does not support new secret keys yet. If used, keep it strictly server-only.
- Do not use `@supabase/ssr` or cookie/session Supabase clients with the secret key.

## Schema And Migrations

Committed migrations live in `supabase/migrations/`.

- `20260616134726_initial_konoha_schema.sql` creates the Konoha application tables, constraints, indexes, RLS policies, grants, and seed data.
- `20260616135144_add_konoha_fk_indexes.sql` adds foreign-key support indexes requested by the Supabase performance advisor.

The initial schema creates:

- `public.plants`
- `public.plant_facts`
- `public.plant_tags`
- `public.devices`
- `public.sensor_readings`
- `public.plant_health_snapshots`
- `public.metric_thresholds`
- `public.care_guidelines`
- `public.care_advice`
- `public.ai_reports`
- `public.activity_events`

RLS is enabled on every application table. `anon` and `authenticated` are explicitly denied table access, and deny-all policies are present for those roles. The server-side Supabase secret uses the `service_role` path, which is granted read/write access for the app tables and required sequences.

Seed data includes one prototype plant, one prototype device, profile facts, tags, metric thresholds, care guidelines, several readings, one health snapshot, one active care advice row, one AI report placeholder, and activity events.

## Local Environment

Copy `.env.example` to `.env.local` and fill in real values locally. Do not commit `.env.local`.

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_server_only_secret
KONOHA_INGESTION_TOKEN=replace-with-a-long-random-token
KONOHA_DEFAULT_DEVICE_ID=konoha-esp32-01
KONOHA_USE_MOCK_FALLBACK=false
```

For local development without Supabase values, set `KONOHA_USE_MOCK_FALLBACK=true`. The fallback is explicit by design. Production deployments should use real Supabase env vars and keep fallback disabled.

## Vercel Environment

Configure real values in Vercel Project Settings > Environment Variables.

- Use Production variables for production deployments.
- Use Preview variables for the `dev` branch and preview deployments.
- Mark secret values as sensitive where possible.
- Redeploy after changing environment variables so new deployments receive the updated values.

## Raspberry Pi Ingestion Endpoint

The future Raspberry Pi gateway repository should POST validated readings to:

```text
POST /api/readings/ingest
Authorization: Bearer <KONOHA_INGESTION_TOKEN>
Content-Type: application/json
```

Expected body:

```json
{
  "device_id": "konoha-esp32-01",
  "timestamp": "2026-06-16T12:00:00+09:00",
  "soil_moisture_raw": 2150,
  "soil_moisture_percent": 34,
  "temperature_c": 22.5,
  "humidity_percent": 48.2,
  "light_lux": 820,
  "sensor_status": "ok",
  "battery_or_power_status": "usb_power",
  "notes": "optional diagnostic note"
}
```

Safe local test command:

```bash
curl -i http://localhost:3000/api/readings/ingest \
  -H "Authorization: Bearer <KONOHA_INGESTION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "konoha-esp32-01",
    "timestamp": "2026-06-16T12:00:00+09:00",
    "soil_moisture_raw": 2150,
    "soil_moisture_percent": 34,
    "temperature_c": 22.5,
    "humidity_percent": 48.2,
    "light_lux": 820,
    "sensor_status": "ok",
    "battery_or_power_status": "usb_power",
    "notes": "optional diagnostic note"
  }'
```

If the seed data has already been applied, the exact sample timestamp may return a controlled duplicate response. Change the timestamp to a new ISO value to test a fresh insert.

The endpoint derives `plant_id` from `devices.device_id` and ignores any client-provided `plant_id`.

## Raspberry Pi Gateway Notes

The future Raspberry Pi repository should:

- Receive or read ESP32 sensor values.
- Normalize or calibrate sensor values locally where needed.
- Add a gateway timestamp if the ESP32 clock is unreliable.
- POST the validated payload to the Vercel ingestion endpoint.
- Store `KONOHA_INGESTION_TOKEN` locally as an environment variable or systemd environment file, not in source code.
- Retry failed uploads with backoff.
- Avoid sending `plant_id`; send only `device_id` and sensor values.

## Out Of Scope

- ESP32 firmware.
- Raspberry Pi gateway scripts or services.
- Gemini report generation.
- Public/browser Supabase reads.
