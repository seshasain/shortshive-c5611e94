-- Drop the trigger if it exists (to avoid conflicts)
DROP TRIGGER IF EXISTS on_story_created ON stories;

-- Create the trigger to automatically create saved_stories
CREATE TRIGGER on_story_created
    AFTER INSERT ON stories
    FOR EACH ROW
    EXECUTE FUNCTION create_saved_story();

-- Verify the trigger was created
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