## Assignment Tracker

Mobile-first assignment tracker for a single university class, built with Next.js (App Router), Supabase, TailwindCSS, and TypeScript.

### Tech stack

- **Frontend**: Next.js App Router, React, TailwindCSS, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Edge Functions)

### Project structure

- `app/` – App Router routes
  - `(public)/` – landing + verification
  - `(student)/` – student dashboard and assignment details
  - `(admin)/` – admin panel
- `components/` – UI components (auth, dashboard, admin, common)
- `lib/` – Supabase clients and auth helpers
- `services/` – data-access utilities (students, assignments, admin, email)
- `hooks/` – reusable hooks (assignments, countdown, toast)
- `types/` – shared types
- `utils/` – date and status helpers
- `supabase/` – SQL schema and Edge function source

### Environment variables

Create a `.env.local` file in `assignment-tracker/` using `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
EMAIL_API_KEY=...
```

### Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor to create tables, indexes, and RLS policies.
3. Seed the `students` table with your class list.
4. Mark at least one user as admin by setting their `app_metadata.role` to `"admin"`.
5. Deploy the Edge function in `supabase/functions/send-assignment-notifications` using the Supabase CLI.
