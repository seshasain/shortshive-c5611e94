-- First, drop the existing unique constraint if it exists
ALTER TABLE saved_stories DROP CONSTRAINT IF EXISTS saved_stories_story_id_key;

-- Add primary key only if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'saved_stories_pkey'
        AND conrelid = 'saved_stories'::regclass
    ) THEN
        ALTER TABLE saved_stories ADD CONSTRAINT saved_stories_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'saved_stories_story_id_fkey'
        AND conrelid = 'saved_stories'::regclass
    ) THEN
        ALTER TABLE saved_stories 
        ADD CONSTRAINT saved_stories_story_id_fkey 
        FOREIGN KEY (story_id) 
        REFERENCES stories(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS saved_stories_story_id_idx ON saved_stories(story_id);
CREATE INDEX IF NOT EXISTS saved_stories_status_idx ON saved_stories(status);

-- Update any existing duplicate records
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