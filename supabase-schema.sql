-- ============================================================
-- BurnLens — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Audit Results table
CREATE TABLE IF NOT EXISTS audit_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  share_id VARCHAR(12) UNIQUE NOT NULL,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  ai_summary TEXT,
  total_monthly_spend DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_monthly_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_annual_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
  savings_tier VARCHAR(10) NOT NULL DEFAULT 'optimal',
  is_public BOOLEAN DEFAULT true
);

-- 2. Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(255),
  team_size INT,
  audit_id UUID REFERENCES audit_results(id),
  audit_savings DECIMAL(10,2),
  savings_tier VARCHAR(10),
  email_sent BOOLEAN DEFAULT false
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_audit_share_id ON audit_results(share_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);

-- 4. Row Level Security
ALTER TABLE audit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads of public audits (for shareable URLs)
CREATE POLICY "Public audits are viewable by everyone"
  ON audit_results FOR SELECT
  USING (is_public = true);

-- Allow anonymous inserts (for saving audits)
CREATE POLICY "Anyone can create audits"
  ON audit_results FOR INSERT
  WITH CHECK (true);

-- Allow anonymous inserts for leads
CREATE POLICY "Anyone can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);
