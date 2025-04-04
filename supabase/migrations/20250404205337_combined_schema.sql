-- Clear existing schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Profile table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT CHECK (phone_number IS NULL OR length(regexp_replace(phone_number, '[^0-9]', '', 'g')) BETWEEN 8 AND 15),
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Story table
CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Character table
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Scene table
CREATE TABLE public.scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_number INTEGER NOT NULL,
    duration_estimate INTEGER NOT NULL,
    visual_description TEXT NOT NULL,
    dialogue_or_narration TEXT NOT NULL,
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Animation table
CREATE TABLE public.animations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    scene_id UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    video_url TEXT,
    thumbnail_url TEXT,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create SavedStory table
CREATE TABLE public.saved_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID UNIQUE NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'SAVED_WITH_ERRORS', 'COMPLETED')),
    error_details JSONB,
    generation_state JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_scenes_updated_at
    BEFORE UPDATE ON public.scenes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_animations_updated_at
    BEFORE UPDATE ON public.animations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_saved_stories_updated_at
    BEFORE UPDATE ON public.saved_stories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if the user has confirmed their email
  IF NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, phone_number, country)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.raw_user_meta_data->>'phone_number',
      NEW.raw_user_meta_data->>'country'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      phone_number = EXCLUDED.phone_number,
      country = EXCLUDED.country,
      updated_at = TIMEZONE('utc', NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the auth user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF email_confirmed_at, raw_user_meta_data
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create RLS (Row Level Security) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create policies for stories
CREATE POLICY "Users can view own stories"
    ON public.stories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create stories"
    ON public.stories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
    ON public.stories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
    ON public.stories FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for characters
CREATE POLICY "Users can view characters of own stories"
    ON public.characters FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = characters.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can create characters for own stories"
    ON public.characters FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = characters.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update characters of own stories"
    ON public.characters FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = characters.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete characters of own stories"
    ON public.characters FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = characters.story_id
        AND user_id = auth.uid()
    ));

-- Create policies for scenes
CREATE POLICY "Users can view scenes of own stories"
    ON public.scenes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = scenes.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can create scenes for own stories"
    ON public.scenes FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = scenes.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update scenes of own stories"
    ON public.scenes FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = scenes.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete scenes of own stories"
    ON public.scenes FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = scenes.story_id
        AND user_id = auth.uid()
    ));

-- Create policies for animations
CREATE POLICY "Users can view animations of own stories"
    ON public.animations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = animations.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can create animations for own stories"
    ON public.animations FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = animations.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update animations of own stories"
    ON public.animations FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = animations.story_id
        AND user_id = auth.uid()
    ));

-- Create policies for saved stories
CREATE POLICY "Users can view own saved stories"
    ON public.saved_stories FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = saved_stories.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can create saved stories for own stories"
    ON public.saved_stories FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = saved_stories.story_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update own saved stories"
    ON public.saved_stories FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = saved_stories.story_id
        AND user_id = auth.uid()
    ));

-- Create indexes for better performance
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_characters_story_id ON public.characters(story_id);
CREATE INDEX idx_scenes_story_id ON public.scenes(story_id);
CREATE INDEX idx_animations_story_id ON public.animations(story_id);
CREATE INDEX idx_animations_scene_id ON public.animations(scene_id);
CREATE INDEX idx_saved_stories_story_id ON public.saved_stories(story_id);
