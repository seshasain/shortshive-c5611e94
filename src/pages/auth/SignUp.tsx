import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Film, Loader2, Check, X } from 'lucide-react';
import { signUp, isApprovedDomain } from '@/lib/auth';
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
  const [fullName, setFullName] = useState('');
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
    if (!fullName.trim()) {
      setError('Full name is required');
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

    // Email validation
    if (!email.includes('@') || !email.split('@')[1]?.includes('.')) {
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
      const { data, error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        return;
      }

      // Show success message and redirect to login
      navigate('/login?verification=pending', { 
        state: { 
          message: 'Please check your email for a verification link.' 
        }
      });
      
    } catch (err: any) {
      console.error('Signup process error:', err);
      setError('An unexpected error occurred. Please try again later.');
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
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                  className="border-pixar-blue/20"
                />
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select 
                  value={country} 
                  onValueChange={setCountry} 
                  name="country"
                  required
                >
                  <SelectTrigger id="country" className="w-full bg-background border-pixar-blue/20 text-foreground">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-pixar-blue/20"
                />
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
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-pixar-blue hover:underline">
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