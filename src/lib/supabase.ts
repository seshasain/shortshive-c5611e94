
import { createClient } from '@supabase/supabase-js';

// Get Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available, otherwise use development fallbacks
// IMPORTANT: This should only be used in development
const isMissingEnvVars = !supabaseUrl || !supabaseAnonKey;

// Create either a real or mock Supabase client
export const supabase = isMissingEnvVars
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey);

// Function to create a mock Supabase client for development
function createMockSupabaseClient() {
  console.warn('Using mock Supabase client. Connect to Supabase for full functionality.');
  
  // Return a mock client with the same API shape but with mock implementations
  return {
    auth: {
      signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: mockData[table], error: null }),
          order: () => ({ data: mockData[table], error: null }),
        }),
        order: () => ({ data: mockData[table], error: null }),
      }),
      insert: async () => ({ data: {}, error: null }),
      update: async () => ({ data: {}, error: null }),
    }),
  };
}

// Mock data for development
const mockData: Record<string, any> = {
  profiles: {
    id: 'mock-user-id',
    name: 'Mock User',
    country: 'United States',
    created_at: new Date().toISOString(),
  },
  animations: [
    {
      id: 'mock-animation-1',
      title: 'Mock Animation',
      description: 'This is a mock animation',
      status: 'completed',
      created_at: new Date().toISOString(),
    }
  ],
  stories: [
    {
      id: 'mock-story-1',
      title: 'Mock Story',
      content: 'Once upon a time...',
      created_at: new Date().toISOString(),
    }
  ],
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

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  // Check if the email domain is approved
  if (!isApprovedDomain(email)) {
    return { 
      data: null, 
      error: new Error('Registration is restricted to approved email domains. Please use a different email address.')
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// Create profile function - Updated to match our database schema
export const createProfile = async (userId: string, profileData: { 
  name: string, 
  phone_number?: string, 
  country: string, 
  profession?: string,
  avatar_url?: string
}) => {
  console.log('Creating profile for user:', userId, profileData);
  
  // Create the profile with required and optional fields
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      full_name: profileData.name, // Map to both name and full_name for compatibility
      name: profileData.name,
      country: profileData.country,
      phone_number: profileData.phone_number || null,
      profession: profileData.profession || null,
      avatar_url: profileData.avatar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  
  if (error) {
    console.error('Error creating profile:', error);
  } else {
    console.log('Profile created successfully:', data);
  }
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  // Always update the updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updatesWithTimestamp)
    .eq('id', userId);
  return { data, error };
};

// Animation helpers
export const getAnimations = async (userId: string) => {
  const { data, error } = await supabase
    .from('animations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Create animation function
export const createAnimation = async (userId: string, animationData: {
  title: string,
  description?: string,
  status?: string,
  thumbnail_url?: string
}) => {
  const { data, error } = await supabase
    .from('animations')
    .insert([{
      user_id: userId,
      title: animationData.title,
      description: animationData.description || null,
      status: animationData.status || 'draft',
      thumbnail_url: animationData.thumbnail_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  return { data, error };
};

// Story helpers
export const getStories = async (userId: string) => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Create story function
export const createStory = async (userId: string, storyData: {
  title: string,
  content?: string,
  settings?: any
}) => {
  const { data, error } = await supabase
    .from('stories')
    .insert([{
      user_id: userId,
      title: storyData.title,
      content: storyData.content || null,
      settings: storyData.settings || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  return { data, error };
};
