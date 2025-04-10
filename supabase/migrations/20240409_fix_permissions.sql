-- Grant usage on schema public to service_role
grant usage on schema public to postgres, anon, authenticated, service_role;

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