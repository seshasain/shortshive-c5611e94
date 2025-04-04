import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Film, Loader2, Check, X } from 'lucide-react';
import { signUp, createProfile, isApprovedDomain } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// List of countries for the dropdown
const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "India", 
  "Germany", "France", "Japan", "China", "Brazil", "Mexico", "South Africa",
  "Nigeria", "Egypt", "Saudi Arabia", "UAE", "Singapore", "New Zealand",
  "Other"
];

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Validate email domain when email changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear previous errors
    setEmailError('');
    
    // Don't validate while user is still likely typing
    // Only validate when the email appears to be complete
  };

  // Validate email when user leaves the field (blur event)
  const handleEmailBlur = () => {
    if (!email) return;
    
    // Only validate if email looks like a complete email
    const emailParts = email.split('@');
    if (emailParts.length === 2 && emailParts[1]?.includes('.')) {
      const isValidDomain = isApprovedDomain(email);
      if (!isValidDomain) {
        setEmailError('Sorry, we don\'t accept registrations from this email domain.');
      }
    }
  };

  // Function to check for common domains that may be incomplete
  const isLikelyIncompleteCommonDomain = (email: string): boolean => {
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1].toLowerCase();
    
    // Check if it's a partial match for a common domain
    return commonDomains.some(commonDomain => 
      commonDomain.startsWith(domain) && domain.length >= 3
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!country) {
      setError('Country is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Email format basic validation
    if (!email.includes('@') || !email.split('@')[1]?.includes('.')) {
      // Check if it might be a partial domain that the user intended to complete
      if (isLikelyIncompleteCommonDomain(email)) {
        setError('Your email appears incomplete. Please enter a full email address.');
      } else {
        setError('Please enter a valid email address.');
      }
      return;
    }

    // Check if email domain is approved
    if (!isApprovedDomain(email)) {
      setError('Sorry, we don\'t accept registrations from this email domain.');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with email/password
      const { data: authData, error: signUpError } = await signUp(email, password);
      
      if (signUpError) throw signUpError;

      // Create profile with additional information
      if (authData && authData.user) {
        const { error: profileError } = await createProfile(authData.user.id, {
          name: name.trim(),
          phone_number: phoneNumber.trim() || null,
          country: country,
          profession: null // Set profession to null since we removed the field
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Continue with signup success even if profile creation fails
          // We could handle this more gracefully in a production app
        }
      }

      // Redirect to login page with success message
      navigate('/login?signup=success');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-pixar-blue to-pixar-purple flex items-center justify-center">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold pixar-text-gradient">PixarifyAI</span>
            </div>
          </Link>
        </div>

        <Card className="border-pixar-blue/10 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    required
                    className={`border-pixar-blue/20 pr-10 ${emailError ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {email && email.includes('@') && emailError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 123 456 7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-pixar-blue/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger className="border-pixar-blue/20">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password *</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pixar-blue hover:bg-pixar-darkblue"
                disabled={isLoading || !!emailError}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-pixar-blue hover:text-pixar-darkblue font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;