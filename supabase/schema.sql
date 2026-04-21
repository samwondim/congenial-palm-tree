-- Supabase Schema for Wedding Platform
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Couples table
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name1 TEXT NOT NULL,
  name2 TEXT NOT NULL,
  last_name TEXT,
  wedding_date DATE NOT NULL,
  story JSONB DEFAULT '[]'::jsonb,
  schedule JSONB DEFAULT '[]'::jsonb,
  venues JSONB DEFAULT '{}'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  registry JSONB DEFAULT '[]'::jsonb,
  accommodations JSONB DEFAULT '[]'::jsonb,
  guest_photos JSONB DEFAULT '[]'::jsonb,
  rsvps JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  telegram_chat_id BIGINT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published weddings
CREATE POLICY "Public read published" ON couples
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Allowbot to manage couples
CREATE POLICY "Bot manages couples" ON couples
  FOR ALL TO anon, authenticated
  USING (telegram_chat_id IS NOT NULL);

-- Index for slug lookups
CREATE INDEX couples_slug_idx ON couples(slug);
CREATE INDEX couples_status_idx ON couples(status);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER couples_updated_at
  BEFORE UPDATE ON couples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();