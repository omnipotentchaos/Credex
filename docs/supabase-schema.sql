-- BurnLens — Supabase schema alignment with the assignment data model
-- Run in SQL Editor (Supabase Dashboard) if your project predates these columns.

-- audit_results: expected columns used by the app
-- (create table only if missing — adjust to your existing migration style)
create table if not exists public.audit_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  input_data jsonb not null,
  result_data jsonb not null,
  ai_summary text,
  total_monthly_spend numeric,
  total_monthly_savings numeric,
  total_annual_savings numeric,
  share_id text not null unique,
  savings_tier text,
  is_public boolean default true
);

create index if not exists audit_results_share_id_idx on public.audit_results (share_id);

-- leads: add FK to persisted audit row (optional but recommended)
alter table public.leads
  add column if not exists audit_id uuid references public.audit_results (id) on delete set null;

alter table public.leads
  add column if not exists role text;

alter table public.leads
  add column if not exists team_size integer;

alter table public.leads
  add column if not exists email_sent boolean default false;

-- If you used different legacy column names, rename or migrate before running.
