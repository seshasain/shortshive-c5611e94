// Script to initialize login activity data for testing
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (use browser environment variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Initialize login activity for the current user
 */
export const initializeLoginActivity = async () => {
  try {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No session found');
      return;
    }

    const userId = session.user.id;

    // Check if we already have login activity records
    const { data: existingData, error: checkError } = await supabase
      .from('login_activity')
      .select('id')
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking login activity:', checkError);
      return;
    }

    // If we already have records, don't add more
    if (existingData && existingData.length > 0) {
      console.log('Login activity records already exist');
      return;
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
      return;
    }

    console.log('Sample login activity data added successfully');
  } catch (error) {
    console.error('Unexpected error initializing login activity:', error);
  }
}; 