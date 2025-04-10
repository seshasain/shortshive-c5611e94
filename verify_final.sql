-- 1. Check for any stories without saved_stories
SELECT 
    s.id as story_id,
    s.title,
    s.created_at
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL;

-- 2. Check for any duplicate saved_stories
SELECT 
    story_id,
    COUNT(*) as count,
    array_agg(id) as saved_story_ids
FROM 
    saved_stories
GROUP BY 
    story_id
HAVING 
    COUNT(*) > 1;

-- 3. Test the trigger with a dummy story
DO $$
DECLARE
    test_user_id uuid;
    test_story_id uuid;
BEGIN
    -- Get a valid user_id
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    -- Insert a test story
    INSERT INTO stories (title, user_id)
    VALUES ('Test Story for Trigger', test_user_id)
    RETURNING id INTO test_story_id;
    
    -- Check if saved_story was created
    ASSERT EXISTS (
        SELECT 1 
        FROM saved_stories 
        WHERE story_id = test_story_id
    ), 'No saved_story was created for test story';
    
    -- Clean up
    DELETE FROM stories WHERE id = test_story_id;
END $$; 