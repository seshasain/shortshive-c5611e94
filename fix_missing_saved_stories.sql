-- Insert missing saved_stories for existing stories
INSERT INTO saved_stories (story_id, status)
SELECT 
    s.id,
    'DRAFT'
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL
ON CONFLICT (story_id) DO NOTHING;

-- Verify all stories have saved_stories records
SELECT 
    s.id as story_id,
    s.title,
    ss.id as saved_story_id,
    ss.status
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL; 