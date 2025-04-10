-- Check all tables
SELECT 
    table_schema,
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name;

-- Check columns for all tables
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable,
    is_identity
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name,
    ordinal_position;

-- Check all sequences
SELECT 
    sequence_schema,
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment
FROM 
    information_schema.sequences
WHERE 
    sequence_schema = 'public';

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
      AND tc.table_name = kcu.table_name
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

-- Check RLS policies
SELECT
    n.nspname as schema,
    c.relname as table,
    pol.polname as policy,
    CASE pol.polpermissive
        WHEN TRUE THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as policy_type,
    CASE pol.polroles = '{0}' 
        WHEN TRUE THEN 'PUBLIC'
        ELSE array_to_string(array_agg(rol.rolname), ', ')
    END as roles,
    pg_catalog.pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
    pg_catalog.pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression,
    CASE pol.polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END as command
FROM pg_catalog.pg_policy pol
JOIN pg_catalog.pg_class c ON c.oid = pol.polrelid
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_catalog.pg_auth_members mem ON mem.member = pol.polroles[1]
LEFT JOIN pg_catalog.pg_roles rol ON rol.oid = mem.roleid
WHERE n.nspname = 'public'
GROUP BY 1,2,3,4,pol.polroles,6,7,8
ORDER BY 2,3; 