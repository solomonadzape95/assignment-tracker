-- WARNING: The following SQL will drop *all* tables, views, materialized views, and functions in the "public" schema. 
-- This will remove ALL DATA and schema objects, effectively resetting your database schema. 
-- Use with extreme caution and only on disposable or development databases!

-- Drop all tables in the "public" schema
do
$$
declare
    obj record;
begin
    -- Drop all views
    for obj in
        select table_schema, table_name 
        from information_schema.views 
        where table_schema = 'public'
    loop
        execute format('drop view if exists %I.%I cascade;', obj.table_schema, obj.table_name);
    end loop;

    -- Drop all materialized views
    for obj in
        select schemaname as table_schema, matviewname as table_name
        from pg_matviews 
        where schemaname = 'public'
    loop
        execute format('drop materialized view if exists %I.%I cascade;', obj.table_schema, obj.table_name);
    end loop;

    -- Drop all tables
    for obj in
        select table_schema, table_name 
        from information_schema.tables 
        where table_schema = 'public' and table_type = 'BASE TABLE'
    loop
        execute format('drop table if exists %I.%I cascade;', obj.table_schema, obj.table_name);
    end loop;

    -- Drop all functions
    for obj in
        select n.nspname as function_schema,
               p.proname as function_name,
               pg_get_function_identity_arguments(p.oid) as args
        from pg_proc p
             join pg_namespace n ON p.pronamespace = n.oid
        where n.nspname = 'public'
    loop
        execute format('drop function if exists %I.%I(%s) cascade;', obj.function_schema, obj.function_name, obj.args);
    end loop;
end
$$;

-- Optionally, drop all sequences
do
$$
declare
    obj record;
begin
    for obj in
        select sequence_schema, sequence_name
        from information_schema.sequences
        where sequence_schema = 'public'
    loop
        execute format('drop sequence if exists %I.%I cascade;', obj.sequence_schema, obj.sequence_name);
    end loop;
end
$$;

-- Optionally, drop all types (except array and base types)
-- You likely don't need this, but for completeness:
do
$$
declare
    obj record;
begin
    for obj in
        select n.nspname as type_schema, t.typname as type_name
        from pg_type t
        join pg_namespace n on n.oid = t.typnamespace
        where n.nspname = 'public'
          and t.typtype in ('c', 'e')     -- composite or enum types only
          and not t.typname like '\\_%'   -- skip system/generated types
    loop
        execute format('drop type if exists %I.%I cascade;', obj.type_schema, obj.type_name);
    end loop;
end
$$;

-- Run this in your Supabase project's SQL editor or through migrations.

-- Extensions ------------------------------------------------------------------

create extension if not exists "uuid-ossp";

-- Tables ----------------------------------------------------------------------

create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  reg_no text unique not null,
  fullname text not null,
  department text not null,
  level text not null,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  student_id uuid references public.students(id),
  email text not null
);

create table if not exists public.assignments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  course_code text not null,
  deadline timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists public.assignment_status (
  id uuid primary key default uuid_generate_v4(),
  assignment_id uuid references public.assignments(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  status text check (status in ('pending', 'completed')) default 'pending',
  completed_at timestamptz null
);

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  assignment_id uuid references public.assignments(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz null,
  created_at timestamptz default now()
);

-- Indexes & constraints -------------------------------------------------------

create index if not exists idx_assignments_deadline
  on public.assignments (deadline);

create unique index if not exists ux_assignment_status_assignment_student
  on public.assignment_status (assignment_id, student_id);

-- Helper functions ------------------------------------------------------------

create or replace function public.is_admin() returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Row Level Security ----------------------------------------------------------

alter table public.students enable row level security;
alter table public.profiles enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_status enable row level security;
alter table public.notifications enable row level security;

-- Students: by default no direct writes from clients. Reads can be restricted
-- further if needed.

create policy if not exists "Students are readable to authenticated users"
on public.students
as permissive
for select
to authenticated
using (true);

-- Profiles: each user can see and update only their own profile.

create policy if not exists "Users can view their own profile"
on public.profiles
as permissive
for select
to authenticated
using (auth.uid() = auth_user_id);

create policy if not exists "Users can update their own profile"
on public.profiles
as permissive
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

create policy if not exists "Users can insert their own profile"
on public.profiles
as permissive
for insert
to authenticated
with check (auth.uid() = auth_user_id);

-- Assignments: all authenticated users can read; only admins can write.

create policy if not exists "Assignments readable to authenticated users"
on public.assignments
as permissive
for select
to authenticated
using (true);

create policy if not exists "Only admins can modify assignments"
on public.assignments
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Assignment status: students can view and modify only their own rows.

create policy if not exists "Students can view their own assignment status"
on public.assignment_status
as permissive
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.student_id = assignment_status.student_id
  )
);

create policy if not exists "Students can upsert their own assignment status"
on public.assignment_status
as permissive
for insert, update
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.student_id = assignment_status.student_id
  )
);

create policy if not exists "Users can view their own notifications"
on public.notifications
as permissive
for select
to authenticated
using (user_id = auth.uid());

create policy if not exists "Admins can create notifications"
on public.notifications
as permissive
for insert
to authenticated
with check (public.is_admin());

create policy if not exists "Users can update their own notifications"
on public.notifications
as permissive
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Note: seeding of the students table is assumed to be handled separately
-- for this specific class (CSV import or SQL inserts).

