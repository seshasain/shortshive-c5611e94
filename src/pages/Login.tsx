import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Film, Loader2, CheckCircle2 } from 'lucide-react';
import { signIn } from '@/lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if user just signed up successfully
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'success') {
      setShowSuccessMessage(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', '/login');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) throw signInError;

      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
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
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Account created successfully! Please check your email for verification.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-pixar-blue hover:text-pixar-darkblue"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pixar-blue/20"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pixar-blue hover:bg-pixar-darkblue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-pixar-blue hover:text-pixar-darkblue font-medium underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;