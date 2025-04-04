import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
export const signUp = async (email: string, password: string, fullName: string) => {
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
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't throw here - the user is still created
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error during signup:', error);
    return { data: null, error };
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
    return { data, error: null };
  } catch (error) {
    console.error('Error during signin:', error);
    return { data: null, error };
  }
};

// Sign out function
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};