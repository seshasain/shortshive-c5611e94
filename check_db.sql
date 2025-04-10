-- Check all schemas
SELECT nspname AS schema_name, 
       pg_catalog.pg_get_userbyid(nspowner) AS schema_owner 
FROM pg_catalog.pg_namespace 
WHERE nspname !~ '^pg_' 
  AND nspname <> 'information_schema';

-- Check all tables and their columns
SELECT 
    t.table_schema,
    t.table_name,
    c.column_name,
    c.data_type,
    c.column_default,
    c.is_nullable,
    c.character_maximum_length
FROM 
    information_schema.tables t
    JOIN information_schema.columns c 
        ON t.table_name = c.table_name 
        AND t.table_schema = c.table_schema
WHERE 
    t.table_schema = 'public'
ORDER BY 
    t.table_name,
    c.ordinal_position;

-- Check all constraints
SELECT 
    tc.table_schema, 
    tc.table_name, 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.table_schema = 'public'
ORDER BY 
    tc.table_name,
    tc.constraint_name;

-- Check all indexes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;

-- Check all triggers
SELECT 
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_schema,
    event_object_table,
    action_statement,
    action_timing
FROM 
    information_schema.triggers
WHERE 
    trigger_schema = 'public'
ORDER BY 
    event_object_table,
    trigger_name;

-- Check all functions
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
    AND p.proname LIKE '%story%';

-- Check all roles and their permissions
SELECT 
    r.rolname,
    r.rolsuper,
    r.rolinherit,
    r.rolcreaterole,
    r.rolcreatedb,
    r.rolcanlogin,
    r.rolreplication,
    r.rolconnlimit,
    r.rolvaliduntil
FROM 
    pg_catalog.pg_roles r
ORDER BY 
    r.rolname;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename,
    policyname;

-- Check table privileges
SELECT 
    grantor,
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM 
    information_schema.table_privileges 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name,
    grantee,
    privilege_type;

-- Check sequence privileges
SELECT 
    n.nspname AS schema_name,
    c.relname AS sequence_name,
    g.rolname AS grantee,
    d.defaclacl AS privileges
FROM 
    pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    CROSS JOIN pg_roles g
    LEFT JOIN pg_default_acl d ON d.defaclnamespace = n.oid 
        AND d.defaclrole = g.oid 
        AND d.defaclobjtype = 'S'
WHERE 
    c.relkind = 'S'
    AND n.nspname = 'public'
ORDER BY 
    n.nspname,
    c.relname,
    g.rolname;

-- Check extensions
SELECT 
    extname,
    extversion,
    extrelocatable,
    extconfig,
    extcondition
FROM 
    pg_extension;

-- Check saved_stories table structure
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'saved_stories'
ORDER BY 
    ordinal_position;

-- Check saved_stories constraints
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.table_name = 'saved_stories';

-- Check saved_stories RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    tablename = 'saved_stories';

-- Check if there are any triggers on saved_stories
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM 
    information_schema.triggers
WHERE 
    event_object_table = 'saved_stories';

-- Check stories table structure
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'stories'
ORDER BY 
    ordinal_position;

-- Check stories constraints
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.table_name = 'stories'; 