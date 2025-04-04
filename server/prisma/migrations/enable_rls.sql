-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Users table policies
CREATE POLICY "Allow public read for users" ON public.users
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow insert during signup" ON public.users
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow users to update own record" ON public.users
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Verification tokens policies
CREATE POLICY "Allow token creation" ON public.verification_tokens
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow token verification" ON public.verification_tokens
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow token deletion" ON public.verification_tokens
    FOR DELETE TO public
    USING (true);

-- Profiles policies
CREATE POLICY "Allow profile creation" ON public.profiles
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow users to read profiles" ON public.profiles
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow users to update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (userId = auth.uid())
    WITH CHECK (userId = auth.uid());

-- Stories policies
CREATE POLICY "Allow users to read own stories" ON public.stories
    FOR SELECT TO authenticated
    USING (userId = auth.uid());

CREATE POLICY "Allow users to create stories" ON public.stories
    FOR INSERT TO authenticated
    WITH CHECK (userId = auth.uid());

CREATE POLICY "Allow users to update own stories" ON public.stories
    FOR UPDATE TO authenticated
    USING (userId = auth.uid())
    WITH CHECK (userId = auth.uid());

CREATE POLICY "Allow users to delete own stories" ON public.stories
    FOR DELETE TO authenticated
    USING (userId = auth.uid());

-- Characters policies
CREATE POLICY "Allow users to read own characters" ON public.characters
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

CREATE POLICY "Allow users to create characters" ON public.characters
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

-- Scenes policies
CREATE POLICY "Allow users to read own scenes" ON public.scenes
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

CREATE POLICY "Allow users to create scenes" ON public.scenes
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

-- Animations policies
CREATE POLICY "Allow users to read own animations" ON public.animations
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

CREATE POLICY "Allow users to create animations" ON public.animations
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

-- Saved stories policies
CREATE POLICY "Allow users to read own saved stories" ON public.saved_stories
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

CREATE POLICY "Allow users to create saved stories" ON public.saved_stories
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = storyId AND s.userId = auth.uid()
    ));

-- Grant necessary table permissions to roles
GRANT SELECT, INSERT ON public.users TO anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;

GRANT SELECT, INSERT, DELETE ON public.verification_tokens TO anon;
GRANT SELECT, DELETE ON public.verification_tokens TO authenticated;

GRANT SELECT, INSERT ON public.profiles TO anon;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.characters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.animations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_stories TO authenticated; 