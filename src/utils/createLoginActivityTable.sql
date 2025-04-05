-- Create login_activity table
CREATE TABLE IF NOT EXISTS public.login_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address TEXT,
    device_type TEXT,
    device_name TEXT,
    location TEXT,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    is_current BOOLEAN DEFAULT false,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Make sure we have the update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_login_activity_updated_at ON public.login_activity;
CREATE TRIGGER update_login_activity_updated_at
    BEFORE UPDATE ON public.login_activity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own login activity" ON public.login_activity;
DROP POLICY IF EXISTS "Users can create login activity records" ON public.login_activity;
DROP POLICY IF EXISTS "Users can update own login activity" ON public.login_activity;
DROP POLICY IF EXISTS "Users can delete own login activity" ON public.login_activity;

-- Create RLS policies for login_activity
CREATE POLICY "Users can view own login activity"
    ON public.login_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create login activity records"
    ON public.login_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own login activity"
    ON public.login_activity FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own login activity"
    ON public.login_activity FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for better performance
DROP INDEX IF EXISTS idx_login_activity_user_id;
CREATE INDEX idx_login_activity_user_id ON public.login_activity(user_id);

DROP INDEX IF EXISTS idx_login_activity_last_accessed;
CREATE INDEX idx_login_activity_last_accessed ON public.login_activity(last_accessed);

-- Make sure service roles and authenticated users have access
GRANT ALL ON public.login_activity TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.login_activity TO authenticated;

-- Make sure notification_settings table exists with correct structure
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT true,
    story_completion_notifications BOOLEAN DEFAULT true,
    promotional_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Add trigger for notification_settings updated_at
DROP TRIGGER IF EXISTS update_notification_settings_updated_at ON public.notification_settings;
CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON public.notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Enable RLS for notification_settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can create notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can update own notification settings" ON public.notification_settings;

-- Create policies for notification_settings
CREATE POLICY "Users can view own notification settings"
    ON public.notification_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create notification settings"
    ON public.notification_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
    ON public.notification_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Make sure service roles and authenticated users have access to notification_settings
GRANT ALL ON public.notification_settings TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_settings TO authenticated;

-- Create index for notification_settings
DROP INDEX IF EXISTS idx_notification_settings_user_id;
CREATE INDEX idx_notification_settings_user_id ON public.notification_settings(user_id); 