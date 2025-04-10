-- First, clean up any potential duplicate saved_stories records
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

-- Add unique constraint on story_id
ALTER TABLE saved_stories ADD CONSTRAINT saved_stories_story_id_key UNIQUE (story_id);

-- Now insert missing saved_stories
INSERT INTO saved_stories (story_id, status)
SELECT 
    s.id,
    'DRAFT'
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
WHERE 
    ss.id IS NULL;

-- Verify all stories have exactly one saved_story record
SELECT 
    s.id as story_id,
    s.title,
    COUNT(ss.id) as saved_story_count
FROM 
    stories s
    LEFT JOIN saved_stories ss ON s.id = ss.story_id
GROUP BY 
    s.id,
    s.title
HAVING 
    COUNT(ss.id) != 1; 