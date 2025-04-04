-- Add new columns to profiles table for enhanced user information
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS profession text;

-- Migrate existing full_name data to name if applicable
UPDATE profiles 
SET name = full_name 
WHERE name IS NULL AND full_name IS NOT NULL;

-- Create an index on country for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);

-- Comment on columns
COMMENT ON COLUMN profiles.name IS 'User''s full name';
COMMENT ON COLUMN profiles.phone_number IS 'User''s phone number (optional)';
COMMENT ON COLUMN profiles.country IS 'User''s country';
COMMENT ON COLUMN profiles.profession IS 'User''s profession or occupation (optional)'; 