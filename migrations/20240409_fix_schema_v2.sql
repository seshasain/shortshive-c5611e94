-- Clean up duplicate indexes on saved_stories
DROP INDEX IF EXISTS saved_stories_story_id_idx;  -- Keep idx_saved_stories_story_id instead

-- Make sure we have the proper foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'saved_stories_story_id_fkey'
    ) THEN
        ALTER TABLE saved_stories
        ADD CONSTRAINT saved_stories_story_id_fkey
        FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE;
    END IF;
END $$;

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

-- Drop existing policies if they exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own saved stories" ON saved_stories;
    DROP POLICY IF EXISTS "Users can update their own saved stories" ON saved_stories;
    DROP POLICY IF EXISTS "Users can delete their own saved stories" ON saved_stories;
    DROP POLICY IF EXISTS "Users can insert their own saved stories" ON saved_stories;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create policies
CREATE POLICY "Users can view their own saved stories"
    ON saved_stories
    FOR SELECT
    USING (
        story_id IN (
            SELECT id FROM stories WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own saved stories"
    ON saved_stories
    FOR UPDATE
    USING (
        story_id IN (
            SELECT id FROM stories WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own saved stories"
    ON saved_stories
    FOR DELETE
    USING (
        story_id IN (
            SELECT id FROM stories WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own saved stories"
    ON saved_stories
    FOR INSERT
    WITH CHECK (
        story_id IN (
            SELECT id FROM stories WHERE user_id = auth.uid()
        )
    );

-- Enable RLS on saved_stories
ALTER TABLE saved_stories ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON saved_stories TO authenticated;
GRANT USAGE ON SEQUENCE saved_stories_id_seq TO authenticated; 