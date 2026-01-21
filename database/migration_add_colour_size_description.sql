-- Migration: Add colour, size, and description columns to products table
-- Run this SQL if you already have a products table and need to add these new fields

-- Add colour column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS colour VARCHAR(100);

-- Add size column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size VARCHAR(100);

-- Add description column (TEXT type for Markdown content)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add indexes for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_products_colour ON products(colour);
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);




