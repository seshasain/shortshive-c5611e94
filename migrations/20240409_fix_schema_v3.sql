-- Add default values for saved_stories if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'saved_stories'
        AND column_name = 'status'
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE saved_stories
        ALTER COLUMN status SET DEFAULT 'DRAFT';
    END IF;
END $$;

-- Add generation_state default if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'saved_stories'
        AND column_name = 'generation_state'
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE saved_stories
        ALTER COLUMN generation_state SET DEFAULT '{"currentStep": "CREATED", "completedSteps": []}'::jsonb;
    END IF;
END $$;

-- Clean up duplicate indexes if they exist
DROP INDEX IF EXISTS saved_stories_story_id_idx;  -- Keep idx_saved_stories_story_id instead

-- Add ON DELETE CASCADE to foreign key if it doesn't have it
DO $$
BEGIN
    -- First drop the existing foreign key
    ALTER TABLE saved_stories 
    DROP CONSTRAINT IF EXISTS saved_stories_story_id_fkey;
    
    -- Then recreate it with CASCADE
    ALTER TABLE saved_stories
    ADD CONSTRAINT saved_stories_story_id_fkey
    FOREIGN KEY (story_id)
    REFERENCES stories(id)
    ON DELETE CASCADE;
EXCEPTION
    WHEN others THEN
        -- If there's any error, we'll just keep the existing constraint
        NULL;
END $$;

-- Grant permissions to authenticated users (these are idempotent)
GRANT SELECT, INSERT, UPDATE, DELETE ON saved_stories TO authenticated;

-- Note: We don't need to create RLS policies as they already exist and are correct
-- Note: We don't need to enable RLS as it's already enabled
-- Note: We don't need to create primary key as it already exists 