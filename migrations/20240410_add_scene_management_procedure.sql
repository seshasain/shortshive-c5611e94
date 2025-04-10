-- Drop existing objects if they exist
DO $$ 
BEGIN
    -- Drop the function first since it depends on the type
    DROP FUNCTION IF EXISTS public.manage_story_scenes(UUID, scene_data[]);
    
    -- Drop the type if it exists
    DROP TYPE IF EXISTS public.scene_data;
EXCEPTION
    WHEN OTHERS THEN
        -- Log any errors but continue
        RAISE NOTICE 'Error dropping existing objects: %', SQLERRM;
END $$;

-- Create a type for scene data
CREATE TYPE public.scene_data AS (
    story_id UUID,
    scene_number INTEGER,
    duration_estimate INTEGER,
    visual_description TEXT,
    dialogue_or_narration TEXT,
    text TEXT
);

-- Create a function to manage scenes atomically
CREATE OR REPLACE FUNCTION public.manage_story_scenes(
    p_story_id UUID,
    p_scenes_data scene_data[]
) RETURNS VOID AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Start an explicit transaction
    BEGIN
        -- Lock the story to prevent concurrent modifications
        PERFORM pg_advisory_xact_lock(hashtext('story_scenes_' || p_story_id::text));
        
        -- Delete existing scenes for the story
        DELETE FROM public.scenes WHERE story_id = p_story_id;
        
        -- Get the count of scenes to be inserted
        SELECT COUNT(*) INTO v_count FROM unnest(p_scenes_data);
        
        -- Verify scene count is within limits
        IF v_count > 20 THEN
            RAISE EXCEPTION 'Too many scenes: maximum of 20 scenes allowed (got %)', v_count;
        END IF;
        
        -- Insert new scenes with explicit scene numbers
        INSERT INTO public.scenes (
            story_id,
            scene_number,
            duration_estimate,
            visual_description,
            dialogue_or_narration,
            text
        )
        SELECT 
            p_story_id,  -- Use the parameter story_id instead of the array element
            ROW_NUMBER() OVER (ORDER BY (scene).scene_number),  -- Generate sequential numbers
            (scene).duration_estimate,
            (scene).visual_description,
            (scene).dialogue_or_narration,
            (scene).text
        FROM unnest(p_scenes_data) AS scene;

        -- Verify scene numbers are sequential
        IF EXISTS (
            SELECT 1
            FROM (
                SELECT 
                    scene_number,
                    LAG(scene_number) OVER (ORDER BY scene_number) as prev_number
                FROM public.scenes
                WHERE story_id = p_story_id
            ) s
            WHERE scene_number <> COALESCE(prev_number + 1, 1)
        ) THEN
            RAISE EXCEPTION 'Scene numbers must be sequential';
        END IF;

    EXCEPTION WHEN OTHERS THEN
        -- Re-raise the error with more context
        RAISE EXCEPTION 'Failed to manage scenes for story %: %', p_story_id, SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql; 