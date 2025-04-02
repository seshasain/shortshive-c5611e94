
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 pixar-text-gradient text-center">Login</h1>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pixar-blue"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pixar-blue"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-pixar-blue focus:ring-pixar-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <a href="#" className="text-sm text-pixar-blue hover:text-pixar-teal">
                Forgot password?
              </a>
            </div>
            
            <Button className="w-full">
              Sign in
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-pixar-blue hover:text-pixar-teal">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
