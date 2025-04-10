-- Add text column to scenes table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'scenes' 
        AND column_name = 'text'
    ) THEN
        ALTER TABLE scenes ADD COLUMN text TEXT;
    END IF;
END $$;

-- Create extensions if they don't exist
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pgjwt with schema extensions;

-- Grant usage on schemas
grant usage on schema public to postgres, anon, authenticated, service_role;
grant usage on schema extensions to postgres, anon, authenticated, service_role;

-- Grant all privileges on all tables in schema public
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Set default privileges for future tables/functions/sequences
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- Grant specific table permissions
grant all privileges on table stories to service_role;
grant all privileges on table scenes to service_role;
grant all privileges on table saved_stories to service_role;
grant all privileges on table scene_images to service_role;
grant all privileges on table animations to service_role;
grant all privileges on table characters to service_role;
grant all privileges on table profiles to service_role;

-- Set appropriate timeouts for roles
alter role anon set statement_timeout = '3s';
alter role authenticated set statement_timeout = '8s';

-- Grant access to auth.users for service_role (needed for user operations)
grant select on table auth.users to service_role; 