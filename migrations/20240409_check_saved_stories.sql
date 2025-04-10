-- Check saved_stories table structure
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable,
    is_identity
FROM 
    information_schema.columns
WHERE 
    table_name = 'saved_stories'
ORDER BY 
    ordinal_position;

-- Check sequences owned by saved_stories
SELECT 
    c.relname as table_name,
    a.attname as column_name,
    s.relname as sequence_name
FROM pg_class s
    JOIN pg_depend d ON d.objid = s.oid
    JOIN pg_class c ON d.refobjid = c.oid
    JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum)
WHERE s.relkind = 'S'
    AND c.relname = 'saved_stories';

-- Check constraints on saved_stories
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