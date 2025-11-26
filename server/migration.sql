-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username text unique;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text default 'user';

-- Update menus table defaults
ALTER TABLE menus ALTER COLUMN available_date SET DEFAULT CURRENT_DATE;
ALTER TABLE menus ALTER COLUMN stock_quantity SET DEFAULT 100;
