
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="py-4 bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pixar-blue to-pixar-teal flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-2xl pixar-text-gradient">PixarifyAI</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium text-gray-700 hover:text-pixar-blue transition-colors">Home</Link>
          <Link to="/features" className="font-medium text-gray-700 hover:text-pixar-blue transition-colors">Features</Link>
          <Link to="/pricing" className="font-medium text-gray-700 hover:text-pixar-blue transition-colors">Pricing</Link>
          <Link to="/examples" className="font-medium text-gray-700 hover:text-pixar-blue transition-colors">Examples</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login" className="font-medium text-gray-700 hover:text-pixar-blue hidden md:inline-block transition-colors">Login</Link>
          <Button className="primary-button">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
