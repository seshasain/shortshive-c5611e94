-- 1. Check if the unique constraint exists
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.table_name = 'saved_stories'
    AND tc.constraint_type = 'UNIQUE';

-- 2. Check for any duplicate story_ids in saved_stories
SELECT 
    story_id,
    COUNT(*) as count
FROM 
    saved_stories
GROUP BY 
    story_id
HAVING 
    COUNT(*) > 1;

-- 3. Check for stories without saved_stories
SELECT 
    s.id as story_id,
    s.title,
    s.created_at
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL;

-- 4. Check saved_stories status distribution
SELECT 
    status,
    COUNT(*) as count
FROM 
    saved_stories
GROUP BY 
    status
ORDER BY 
    count DESC;

-- 5. Verify trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM 
    information_schema.triggers
WHERE 
    event_object_table = 'stories'
    AND trigger_name = 'on_story_created';

-- 6. Check if create_saved_story function exists and is correct
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
    AND p.proname = 'create_saved_story'; 