import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client (only for database access)
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

// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Helper function to verify password
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Helper function to generate verification token
const generateToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Sign up function
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    // Check if the email domain is approved
    if (!isApprovedDomain(email)) {
      return { 
        data: null, 
        error: new Error('Registration is restricted to approved email domains. Please use a different email address.')
      };
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { data: null, error: new Error('User with this email already exists') };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('Failed to create user');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          userId: userData.id,
          email,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (profileError) throw profileError;

    // Create verification token
    const token = generateToken();
    const { error: tokenError } = await supabase
      .from('verification_tokens')
      .insert([
        {
          token,
          email,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          createdAt: new Date().toISOString()
        }
      ]);

    if (tokenError) throw tokenError;

    return { data: { user: userData }, error: null };
  } catch (error) {
    console.error('Error during signup:', error);
    return { data: null, error };
  }
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return { error: new Error('Invalid credentials') };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: new Error('Invalid credentials') };
    }

    // Check if email is verified
    if (!user.isVerified) {
      return { error: new Error('Please verify your email before signing in') };
    }

    return { data: { user }, error: null };
  } catch (error) {
    console.error('Error during signin:', error);
    return { data: null, error };
  }
};

// Verify email function
export const verifyEmail = async (token: string) => {
  try {
    // Get verification token
    const { data: verificationToken, error: tokenError } = await supabase
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !verificationToken) {
      return { error: new Error('Invalid verification token') };
    }

    // Check if token is expired
    if (new Date(verificationToken.expires) < new Date()) {
      return { error: new Error('Verification token has expired') };
    }

    // Update user verification status
    const { error: updateError } = await supabase
      .from('users')
      .update({ isVerified: true })
      .eq('email', verificationToken.email);

    if (updateError) throw updateError;

    // Delete used token
    await supabase
      .from('verification_tokens')
      .delete()
      .eq('token', token);

    return { data: { message: 'Email verified successfully' }, error: null };
  } catch (error) {
    console.error('Error during email verification:', error);
    return { data: null, error };
  }
};

// Sign out function
export const signOut = async () => {
  // Clear any auth state from localStorage
  localStorage.removeItem('user');
  return { error: null };
}; 