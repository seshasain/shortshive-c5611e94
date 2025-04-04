import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home, Video, FileText, Settings, LogOut, HelpCircle, 
  Menu, X, ChevronRight, Bell, Film, User, CreditCard
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase, useProfile } from '@/lib/auth';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'My Animations', icon: Video, href: '/my-animations' },
    { label: 'Saved Stories', icon: FileText, href: '/saved-stories' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container-custom flex justify-between items-center h-16">
          {/* Mobile menu trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-pixar-blue/5">
                  <Menu className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="p-6 border-b">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                      <Film className="h-8 w-8 text-pixar-blue mr-2" />
                      <span className="font-bold text-xl">Pixar.AI</span>
                    </Link>
                  </div>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link to={item.href} key={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start ${isActive ? 'bg-pixar-blue text-white' : 'hover:bg-pixar-blue/5 hover:text-pixar-blue'}`}
                        >
                          <Icon className="mr-2 h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-auto p-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Brand logo */}
          <Link to="/" className="flex items-center">
            <Film className="h-8 w-8 text-pixar-blue mr-2" />
            <span className="font-bold text-xl hidden sm:inline-block">Pixar.AI</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link 
                  to={item.href} 
                  key={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-pixar-blue/10 text-pixar-blue' 
                      : 'text-gray-700 hover:text-pixar-blue hover:bg-pixar-blue/5'
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue transition-colors"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-pixar-blue/20 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white">
                        {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 mt-2 p-2 bg-white/95 backdrop-blur-lg shadow-xl shadow-blue-500/10 border-pixar-blue/10" 
                align="end"
              >
                <div className="flex items-center space-x-3 p-2 mb-2">
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Avatar className="h-10 w-10 ring-2 ring-pixar-blue/20">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{profile?.full_name}</span>
                        <span className="text-sm text-gray-500">{profile?.email}</span>
                      </div>
                    </>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-pixar-blue/10" />
                <div className="p-1">
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer rounded-lg mb-1 p-2 text-gray-700 hover:text-pixar-blue hover:bg-pixar-blue/5 focus:text-pixar-blue focus:bg-pixar-blue/5 transition-all duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer rounded-lg mb-1 p-2 text-gray-700 hover:text-pixar-blue hover:bg-pixar-blue/5 focus:text-pixar-blue focus:bg-pixar-blue/5 transition-all duration-200"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg p-2 text-gray-700 hover:text-red-600 hover:bg-red-50/50 focus:text-red-600 focus:bg-red-50/50 transition-all duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
