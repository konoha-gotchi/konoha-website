# Status

## Current milestone

M2: Replaceable local data layer

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

## Not yet done

- Add a replaceable local dashboard data layer.
- Draft Supabase schema proposal.
- Connect dashboard to real Supabase data.
- Add Gemini server-side report generation.

## Next recommended step

Add a small dashboard data access function that returns typed mock data now and can later be replaced by Supabase reads.
