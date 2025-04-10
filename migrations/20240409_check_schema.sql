\d saved_stories;
\d stories;

-- Check table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name IN ('saved_stories', 'stories')
ORDER BY 
    table_name,
    ordinal_position;

-- Check existing constraints
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
    tc.table_name IN ('saved_stories', 'stories')
ORDER BY 
    tc.table_name,
    tc.constraint_name;

-- Check existing indexes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename IN ('saved_stories', 'stories')
ORDER BY
    tablename,
    indexname; 