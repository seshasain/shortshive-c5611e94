import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

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
  try {
    // Check if the email domain is approved
    if (!isApprovedDomain(email)) {
      return { 
        data: null, 
        error: new Error('Registration is restricted to approved email domains. Please use a different email address.')
      };
    }

    console.log('Attempting to sign up user with email:', email);

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
        data: {
          email: email // Add email to user metadata
        }
      }
    });

    if (error) {
      console.error('Supabase auth error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        details: error
      });
      
      if (error.message.includes('Database error finding user')) {
        return {
          data: null,
          error: new Error('Unable to create account. Please try again later or contact support if the issue persists.')
        };
      }
      return { data: null, error };
    }

    console.log('Signup successful:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('An unexpected error occurred during signup')
    };
  }
};

// Create profile function
export const createProfile = async (userId: string, profileData: { 
  full_name: string, 
  phone_number?: string, 
  country?: string,
  email?: string,
  avatar_url?: string,
  date_of_birth?: Date
}) => {
  try {
    console.log('Creating profile with data:', { id: userId, ...profileData });

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating profile:', error);
      return { data: null, error };
    }

    console.log('Profile created successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating profile:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error creating profile') };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data, error };
    }

    // Check if there's pending signup data
    const pendingSignupData = localStorage.getItem('pendingSignupData');
    if (pendingSignupData) {
      const signupData = JSON.parse(pendingSignupData);
      
      // Create profile if it doesn't exist
      const { data: existingProfile } = await getProfile(data.user.id);
      if (!existingProfile) {
        // Remove userId from signupData since we'll pass it separately
        const { userId, ...profileData } = signupData;
        const { error: profileError } = await createProfile(data.user.id, profileData);
        if (profileError) {
          console.error('Error creating profile during first login:', profileError);
          return { data, error: profileError };
        }
      }
      
      // Clear pending signup data
      localStorage.removeItem('pendingSignupData');
    }

    return { data, error };
  } catch (err) {
    console.error('Error during sign in:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error during sign in') };
  }
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
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
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

// Story helpers
export const getStories = async (userId: string) => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};