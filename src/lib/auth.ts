import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Profile type
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  country?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Login Activity type
export interface LoginActivity {
  id: string;
  user_id: string;
  ip_address: string;
  device_type: string;
  device_name: string;
  location: string;
  last_accessed: string;
  is_current: boolean;
  user_agent?: string;
}

// Hook to fetch and cache profile data
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });
};

// Hook to fetch and cache login activity
export const useLoginActivity = () => {
  return useQuery({
    queryKey: ['loginActivity'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('login_activity')
        .select('*')
        .eq('user_id', session.user.id)
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      return data as LoginActivity[];
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
  });
};

// Function to get device info from user agent
const getDeviceInfo = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  let deviceType = 'Unknown';
  let deviceName = 'Unknown Device';

  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    deviceType = 'Mobile';
    if (ua.includes('ipad')) {
      deviceName = 'iPad';
    } else if (ua.includes('ipod')) {
      deviceName = 'iPod';
    } else {
      deviceName = 'iPhone';
    }
  } else if (ua.includes('android')) {
    deviceType = 'Mobile';
    deviceName = 'Android Device';
  } else if (ua.includes('windows phone')) {
    deviceType = 'Mobile';
    deviceName = 'Windows Phone';
  } else {
    deviceType = 'Desktop';
    if (ua.includes('macintosh') || ua.includes('mac os x')) {
      deviceName = 'Mac';
    } else if (ua.includes('windows')) {
      deviceName = 'Windows PC';
    } else if (ua.includes('linux')) {
      deviceName = 'Linux';
    }
  }

  // Add browser info
  if (ua.includes('chrome')) {
    deviceName += ' - Chrome';
  } else if (ua.includes('firefox')) {
    deviceName += ' - Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    deviceName += ' - Safari';
  } else if (ua.includes('edge')) {
    deviceName += ' - Edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    deviceName += ' - Opera';
  }

  return { deviceType, deviceName };
};

// Function to get approximate location from IP
const getLocationFromIP = async (ip: string) => {
  try {
    // For privacy and demo purposes, we'll return a generic location
    // In a real app, you might use a geolocation API
    return 'United States';
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return 'Unknown Location';
  }
};

// List of approved domains for registration
const APPROVED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "protonmail.com",
  "mail.com",
  "zoho.com",
  // Add educational domains
  "edu",
  "ac.uk",
  // Add business domains
  "company.com",
  "enterprise.com",
  // Add your organization's domains
  "yourcompany.com",
  "yourdomain.com"
];

// Function to validate if an email domain is approved
export const isApprovedDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // Check direct matches first
  if (APPROVED_DOMAINS.includes(domain)) return true;
  
  // Check domain endings (like .edu)
  for (const approvedDomain of APPROVED_DOMAINS) {
    if (domain.endsWith(`.${approvedDomain}`)) return true;
  }
  
  return false;
};

// Sign up function using Supabase Auth
export const signUp = async (email: string, password: string, fullName: string, phoneNumber?: string, country?: string) => {
  try {
    // Check if the email domain is approved
    if (!isApprovedDomain(email)) {
      return { 
        data: null, 
        error: new Error('Registration is restricted to approved email domains. Please use a different email address.')
      };
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
          country: country
        },
        emailRedirectTo: `${window.location.origin}/login?confirmed=true`
      }
    });

    if (error) throw error;

    // Return success with verification pending status
    return { 
      data: { 
        ...data,
        verificationPending: true 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error during signup:', error);
    return { data: null, error };
  }
};

// Record login activity
const recordLoginActivity = async (userId: string) => {
  try {
    // First, mark all existing sessions as not current
    await supabase
      .from('login_activity')
      .update({ is_current: false })
      .eq('user_id', userId);

    // Get IP address (in a real implementation, you would use a service or server middleware)
    // Here we're using a dummy IP for demonstration
    const ipAddress = '192.168.1.1';
    
    // Get user agent
    const userAgent = window.navigator.userAgent;
    
    // Get device info
    const { deviceType, deviceName } = getDeviceInfo(userAgent);
    
    // Get location (simplified)
    const location = await getLocationFromIP(ipAddress);
    
    // Insert new login activity
    const { error } = await supabase
      .from('login_activity')
      .insert({
        user_id: userId,
        ip_address: ipAddress,
        device_type: deviceType,
        device_name: deviceName,
        location: location,
        is_current: true,
        user_agent: userAgent
      });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error recording login activity:', error);
    // Don't block the login process if recording fails
  }
};

// Sign in function using Supabase Auth
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    // Record login activity
    if (data.user) {
      await recordLoginActivity(data.user.id);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error during signin:', error);
    return { data: null, error };
  }
};

// Sign out device
export const signOutDevice = async (deviceId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user session found');

    // Update login activity to mark as signed out
    const { error } = await supabase
      .from('login_activity')
      .update({ is_current: false })
      .eq('id', deviceId)
      .eq('user_id', session.user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out device:', error);
    return { error };
  }
};

// Sign out current device and all other devices
export const signOutAllDevices = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user session found');

    // Sign out from auth
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;

    // Mark all devices as signed out
    const { error } = await supabase
      .from('login_activity')
      .update({ is_current: false })
      .eq('user_id', session.user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out all devices:', error);
    return { error };
  }
};

// Sign out function
export const signOut = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Mark current device as signed out
      await supabase
        .from('login_activity')
        .update({ is_current: false })
        .eq('user_id', session.user.id)
        .eq('is_current', true);
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error during signout:', error);
    return { error };
  }
};

// Get current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Get current user's profile
export const getProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { data: null, error: new Error('No user session found') };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return { data, error };
};

// Update user's profile
export const updateProfile = async (profile: { full_name?: string }) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { error: new Error('No user session found') };

  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', session.user.id);

  return { error };
};