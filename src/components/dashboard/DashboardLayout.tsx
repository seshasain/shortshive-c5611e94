import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home, Video, FileText, Settings, LogOut, HelpCircle, 
  Menu, X, ChevronRight, Bell, Film, User, CreditCard, PenSquare, Moon, Sun, Clock
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase, useProfile } from '@/lib/auth';
import { toast } from 'sonner';
import { useTheme } from '@/lib/theme';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
    { label: 'History', icon: Clock, href: '/history' },
  ];
  
  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r h-screen sticky top-0 w-64 transition-all duration-300`}>
        {/* Logo */}
        <div className={`p-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} border-b flex items-center`}>
          <Link to="/" className="flex items-center">
            <Film className="h-8 w-8 text-pixar-blue mr-2" />
            <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>Pixar.AI</span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link 
                to={item.href} 
                key={item.href}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-pixar-blue text-white' 
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800'
                      : 'text-gray-700 hover:text-pixar-blue hover:bg-pixar-blue/5'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Theme Toggle & User Section */}
        <div className={`p-4 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} border-t`}>
          {/* User Profile */}
          {!isLoading && profile && (
            <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="h-10 w-10 ring-2 ring-pixar-blue/20">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className={`font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{profile?.full_name}</span>
                  <span className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</span>
                </div>
              </div>
              
              {/* Plan type */}
              <div className={`flex items-center mt-2 p-2 rounded ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-pixar-blue to-pixar-teal"></div>
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pro Plan</span>
                <span className="text-xs ml-auto px-2 py-1 rounded-full bg-pixar-blue/10 text-pixar-blue font-medium">Active</span>
              </div>
            </div>
          )}

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`w-full justify-start ${
              theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue' 
                : 'text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue'
            }`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="mr-2 h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="mr-2 h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>
        </div>
      </aside>
      
      {/* Mobile Header and Sidebar */}
      <div className="md:hidden">
        <header className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-30 w-full`}>
          <div className="flex justify-between items-center h-16 px-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-pixar-blue/5 text-gray-700'}`}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className={`p-0 w-64 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                <div className={`p-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} border-b`}>
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                      <Film className="h-8 w-8 text-pixar-blue mr-2" />
                      <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>Pixar.AI</span>
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
                          className={`w-full justify-start ${
                            isActive 
                              ? 'bg-pixar-blue text-white' 
                              : theme === 'dark' 
                                ? 'hover:bg-gray-800 hover:text-pixar-blue text-gray-300' 
                                : 'hover:bg-pixar-blue/5 hover:text-pixar-blue text-gray-700'
                          }`}
                        >
                          <Icon className="mr-2 h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                  
                  {/* Theme toggle in mobile menu */}
                  <div className="mt-2 pt-2 border-t border-gray-700 flex items-center">
                    <Button
                      variant="ghost"
                      onClick={toggleTheme}
                      className={`w-full justify-start ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue' 
                          : 'text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue'
                      }`}
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="mr-2 h-5 w-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-5 w-5" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </Button>
                  </div>
                </nav>
                <div className="mt-auto p-4 border-t">
                  {/* User profile in mobile menu */}
                  {!isLoading && profile && (
                    <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-10 w-10 ring-2 ring-pixar-blue/20">
                          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white">
                            {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <span className={`font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{profile?.full_name}</span>
                          <span className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</span>
                        </div>
                      </div>
                      
                      {/* Plan type */}
                      <div className={`flex items-center mt-2 p-2 rounded ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-pixar-blue to-pixar-teal"></div>
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pro Plan</span>
                        <span className="text-xs ml-auto px-2 py-1 rounded-full bg-pixar-blue/10 text-pixar-blue font-medium">Active</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Settings Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start mb-2 text-sm ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue' 
                        : 'text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue'
                    }`}
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Button>
                  
                  {/* Logout Button */}
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${theme === 'dark' ? 'text-red-400 hover:bg-gray-800 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Brand logo */}
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-pixar-blue mr-2" />
              <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>Pixar.AI</span>
            </Link>
            
            {/* User menu mobile */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue'
                    : 'text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue'
                }`}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-pixar-blue/20 transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className={`h-9 w-9 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
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
                  className={`w-64 mt-2 p-2 backdrop-blur-lg shadow-xl ${
                    theme === 'dark'
                      ? 'bg-gray-900/95 shadow-blue-900/10 border-gray-800'
                      : 'bg-white/95 shadow-blue-500/10 border-pixar-blue/10'
                  }`}
                  align="end"
                >
                  <div className="flex items-center space-x-3 p-2 mb-2">
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                        <div className="space-y-2">
                          <div className={`h-4 w-24 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`} />
                          <div className={`h-3 w-32 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`} />
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
                          <span className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{profile?.full_name}</span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-pixar-blue/10'} />
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')}
                      className={`cursor-pointer rounded-lg mb-1 p-2 transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800 focus:text-pixar-blue focus:bg-gray-800'
                          : 'text-gray-700 hover:text-pixar-blue hover:bg-pixar-blue/5 focus:text-pixar-blue focus:bg-pixar-blue/5'
                      }`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-pixar-blue/10'} />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800 focus:text-red-400 focus:bg-gray-800'
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50'
                      }`}
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
      </div>
      
      {/* Main Content Area with Top Navigation */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Top Navigation */}
        <header className={`hidden md:block ${theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} border-b sticky top-0 z-30 backdrop-blur-sm`}>
          <div className="flex justify-between items-center h-16 px-6">
            <div className="flex-1">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {navItems.find(item => item.href === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle button */}
              <div className="md:block">
                <ThemeToggle />
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue'
                    : 'text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue'
                }`}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue'
                    : 'text-gray-700 hover:bg-pixar-blue/5 hover:text-pixar-blue'
                }`}
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
                      <div className={`h-9 w-9 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
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
                  className={`w-64 mt-2 p-2 backdrop-blur-lg shadow-xl ${
                    theme === 'dark'
                      ? 'bg-gray-900/95 shadow-blue-900/10 border-gray-800'
                      : 'bg-white/95 shadow-blue-500/10 border-pixar-blue/10'
                  }`}
                  align="end"
                >
                  <div className="flex items-center space-x-3 p-2 mb-2">
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                        <div className="space-y-2">
                          <div className={`h-4 w-24 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`} />
                          <div className={`h-3 w-32 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`} />
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
                          <span className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{profile?.full_name}</span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-pixar-blue/10'} />
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')}
                      className={`cursor-pointer rounded-lg mb-1 p-2 transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800 focus:text-pixar-blue focus:bg-gray-800'
                          : 'text-gray-700 hover:text-pixar-blue hover:bg-pixar-blue/5 focus:text-pixar-blue focus:bg-pixar-blue/5'
                      }`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-pixar-blue/10'} />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800 focus:text-red-400 focus:bg-gray-800'
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50'
                      }`}
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
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
