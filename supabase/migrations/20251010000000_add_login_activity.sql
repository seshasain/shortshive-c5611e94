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

-- Add trigger for updated_at
CREATE TRIGGER update_login_activity_updated_at
    BEFORE UPDATE ON public.login_activity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

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
CREATE INDEX idx_login_activity_user_id ON public.login_activity(user_id);
CREATE INDEX idx_login_activity_last_accessed ON public.login_activity(last_accessed);

-- If notification_settings table doesn't exist, create it
-- This ensures we have all needed tables in place
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

-- Add trigger for updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_notification_settings_updated_at'
    ) THEN
        CREATE TRIGGER update_notification_settings_updated_at
            BEFORE UPDATE ON public.notification_settings
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at();
    END IF;
END
$$;

-- Enable RLS if not already enabled
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_settings if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can view own notification settings'
    ) THEN
        CREATE POLICY "Users can view own notification settings"
            ON public.notification_settings FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can create notification settings'
    ) THEN
        CREATE POLICY "Users can create notification settings"
            ON public.notification_settings FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can update own notification settings'
    ) THEN
        CREATE POLICY "Users can update own notification settings"
            ON public.notification_settings FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Create index for notification_settings if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_notification_settings_user_id'
    ) THEN
        CREATE INDEX idx_notification_settings_user_id ON public.notification_settings(user_id);
    END IF;
END
$$; 