-- 1. First, clean up any duplicate saved_stories
WITH ranked_stories AS (
    SELECT 
        id,
        story_id,
        ROW_NUMBER() OVER (PARTITION BY story_id ORDER BY created_at DESC) as rn
    FROM saved_stories
)
DELETE FROM saved_stories
WHERE id IN (
    SELECT id 
    FROM ranked_stories 
    WHERE rn > 1
);

-- 2. Drop existing unique constraint if it exists (to avoid errors)
ALTER TABLE saved_stories 
    DROP CONSTRAINT IF EXISTS saved_stories_story_id_key;

-- 3. Add unique constraint on story_id
ALTER TABLE saved_stories 
    ADD CONSTRAINT saved_stories_story_id_key UNIQUE (story_id);

-- 4. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_story_created ON stories;

-- 5. Create trigger to automatically create saved_stories
CREATE TRIGGER on_story_created
    AFTER INSERT ON stories
    FOR EACH ROW
    EXECUTE FUNCTION create_saved_story();

-- 6. Insert saved_stories for any stories that don't have them
INSERT INTO saved_stories (story_id, status, generation_state)
SELECT 
    s.id,
    'DRAFT',
    '{"currentStep": "CREATED", "completedSteps": []}'::jsonb
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL;

-- 7. Verify the fixes
-- Check unique constraint
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

-- Check trigger
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

-- Check for any remaining stories without saved_stories
SELECT 
    s.id as story_id,
    s.title
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL; 