-- CRUD Entities Schema for Categories, Occasions, and Delivery Times
-- Run this SQL in your Neon PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Occasions Table
CREATE TABLE IF NOT EXISTS occasions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Times Table
CREATE TABLE IF NOT EXISTS delivery_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_occasions_slug ON occasions(slug);
CREATE INDEX IF NOT EXISTS idx_occasions_is_active ON occasions(is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_times_slug ON delivery_times(slug);
CREATE INDEX IF NOT EXISTS idx_delivery_times_is_active ON delivery_times(is_active);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occasions_updated_at
  BEFORE UPDATE ON occasions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_times_updated_at
  BEFORE UPDATE ON delivery_times
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update products table to reference these entities (optional foreign keys)
-- Note: This is for reference. Products can still use text fields for flexibility
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS occasion_id UUID REFERENCES occasions(id);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_time_id UUID REFERENCES delivery_times(id);




