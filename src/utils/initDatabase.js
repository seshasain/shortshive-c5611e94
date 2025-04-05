// Initialize database tables using SQL directly from the browser
import { supabase } from '../lib/auth';

// Check if the login_activity table exists
const checkLoginActivityTable = async () => {
  try {
    // Try to select from the table to see if it exists
    const { error } = await supabase
      .from('login_activity')
      .select('id')
      .limit(1);
    
    // If there's an error with code 42P01, the table doesn't exist
    if (error && error.code === '42P01') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking login_activity table:', error);
    return false;
  }
};

// Create the login_activity table if it doesn't exist
const createLoginActivityTable = async () => {
  const sql = `
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
    CREATE INDEX IF NOT EXISTS idx_login_activity_user_id ON public.login_activity(user_id);
    CREATE INDEX IF NOT EXISTS idx_login_activity_last_accessed ON public.login_activity(last_accessed);
  `;

  try {
    // Execute the SQL to create the table
    // Note: This requires a Supabase client with admin privileges
    // This won't work with the anon key, only for demonstration
    const { error } = await supabase.rpc('pgrest_sql', { query: sql });
    
    if (error) {
      console.error('Error creating login_activity table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error executing SQL:', error);
    return false;
  }
};

// Initialize login activity for the current user
export const initializeLoginActivity = async () => {
  try {
    // Check if login_activity table exists
    const tableExists = await checkLoginActivityTable();
    
    if (!tableExists) {
      console.log('Login activity table does not exist. Please run the SQL script in the Supabase SQL editor.');
      return false;
    }
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No session found');
      return false;
    }

    const userId = session.user.id;

    // Check if we already have login activity records
    const { data: existingData, error: checkError } = await supabase
      .from('login_activity')
      .select('id')
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking login activity:', checkError);
      return false;
    }

    // If we already have records, don't add more
    if (existingData && existingData.length > 0) {
      console.log('Login activity records already exist');
      return true;
    }

    // Create some sample login activity data
    const now = new Date();
    const deviceData = [
      {
        user_id: userId,
        ip_address: '192.168.1.1',
        device_type: 'Desktop',
        device_name: 'Chrome on MacOS',
        location: 'San Francisco, USA',
        last_accessed: now.toISOString(),
        is_current: true,
        user_agent: navigator.userAgent
      },
      {
        user_id: userId,
        ip_address: '192.168.1.2',
        device_type: 'Mobile',
        device_name: 'Safari on iOS',
        location: 'San Francisco, USA',
        last_accessed: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_current: false,
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      },
      {
        user_id: userId,
        ip_address: '172.16.0.1',
        device_type: 'Desktop',
        device_name: 'Firefox on Windows',
        location: 'New York, USA',
        last_accessed: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        is_current: false,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0'
      }
    ];

    // Insert the sample data
    const { error: insertError } = await supabase
      .from('login_activity')
      .insert(deviceData);

    if (insertError) {
      console.error('Error inserting login activity data:', insertError);
      return false;
    }

    console.log('Sample login activity data added successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error initializing login activity:', error);
    return false;
  }
};

// Function to initialize database (run in the browser console for testing)
export const initDatabase = async () => {
  console.log('Initializing database...');
  
  try {
    // We can't create tables from the browser with anon key
    // This is just for demonstration
    console.log('Please run the SQL script in the Supabase SQL editor to create necessary tables.');
    console.log('Check if we can add sample login activity data...');
    
    const success = await initializeLoginActivity();
    
    if (success) {
      console.log('Database initialization completed successfully');
    } else {
      console.warn('Database initialization had some issues. Check the console for details.');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Expose to window for debugging (can be called from console)
if (typeof window !== 'undefined') {
  window.initDatabase = initDatabase;
} 