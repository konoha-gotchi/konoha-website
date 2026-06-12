# Konoha-gotchi Dashboard

Next.js dashboard for the Konoha-gotchi smart planter class prototype.

The dashboard reads plant sensor data from Supabase, shows current values and recent charts, and calls a server-side API route to generate Gemini plant messages. Secret keys are used only on the server.

## Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Required for live data:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-2.5-flash
```

Only `NEXT_PUBLIC_SUPABASE_URL` is browser-safe. Do not add `NEXT_PUBLIC_` to the Supabase service role key or Gemini key.

If Supabase is not configured or has no readings yet, the dashboard displays mock prototype data so the UI can still be reviewed.

## Local Development

```bash
npm install
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Supabase Tables

Run the migration in the hardware repo:

```bash
../plant-node/supabase/migrations/001_konoha_schema.sql
```

The dashboard expects:

- `plant_readings`
- `plant_ai_reports`

## Gemini Route

`POST /api/plant-ai-report`:

1. Reads latest and recent readings from Supabase.
2. Computes simple rule-based analysis and prediction.
3. Sends a short structured prompt to Gemini if `GEMINI_API_KEY` is present.
4. Stores the report in `plant_ai_reports`.
5. Returns the saved report.

If Gemini is not configured, the route falls back to the rule-based message shape.

## Deployment

Set the same environment variables in Vercel project settings, then deploy normally. The existing dashboard design is preserved; live data is loaded server-side on the dashboard and sensors pages.
