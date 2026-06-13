# Status

## Current milestone

M2: Replaceable local data layer is implemented and ready for review.

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
- Replaceable local dashboard data access functions wrap typed mock data for all dashboard routes.
- `npm run build` passes after the local data layer change.

## Not yet done

- Draft Supabase schema proposal.
- Connect dashboard to real Supabase data.
- Add Gemini server-side report generation.

## Next recommended step

Review the M2 local data layer, then draft the Supabase schema proposal after confirmation.
