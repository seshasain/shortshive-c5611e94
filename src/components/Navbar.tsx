import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/auth';
import { ThemeToggle } from './ui/theme-toggle';
import { useTheme } from '@/lib/theme';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const { theme } = useTheme();
  
  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  // Public navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Examples', path: '/examples' },
  ];

  // Dashboard navigation items - updated to match the routes in App.tsx
  const dashboardNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Saved Stories', path: '/saved-stories' },
    { name: 'My Animations', path: '/my-animations' },
    { name: 'Build Story', path: '/build-story' },
  ];

  // Redirect if user tries to access auth pages while logged in
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (session && (currentPath === '/login' || currentPath === '/signup')) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const currentPath = window.location.pathname;
  const isDashboard = currentPath.startsWith('/dashboard') || 
                     currentPath.startsWith('/saved-stories') || 
                     currentPath.startsWith('/my-animations') ||
                     currentPath.startsWith('/build-story') ||
                     currentPath.startsWith('/review-story') ||
                     currentPath.startsWith('/generating') ||
                     currentPath.startsWith('/settings');

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? theme === 'dark' 
            ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-800/20' 
            : 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to={session ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-pixar-blue via-blue-500 to-pixar-teal flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <span className="text-white font-bold text-xl">P</span>
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-bold text-2xl pixar-text-gradient"
          >
            PixarifyAI
          </motion.span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {(isDashboard ? dashboardNavItems : navItems).map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            >
              <Link 
                to={item.path} 
                className={`font-medium transition-all duration-300 relative group py-2 ${
                  currentPath === item.path 
                    ? 'text-pixar-blue' 
                    : theme === 'dark' ? 'text-gray-300 hover:text-pixar-blue' : 'text-gray-700 hover:text-pixar-blue'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-pixar-blue to-pixar-teal transition-all duration-300 rounded-full ${
                  currentPath === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <ThemeToggle />
          </motion.div>
          
          {session ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-xl hover:bg-pixar-blue/5 transition-all duration-300">
                    <Avatar className="h-9 w-9 ring-2 ring-pixar-blue ring-offset-2 transition-all duration-300 hover:ring-offset-4">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white font-semibold">
                        {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className={`w-64 mt-2 p-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-900/95 backdrop-blur-lg shadow-xl shadow-blue-900/10 border-gray-800'
                      : 'bg-white/95 backdrop-blur-lg shadow-xl shadow-blue-500/10 border-none'
                  } rounded-xl`} 
                  align="end"
                >
                  <div className="flex items-center space-x-3 p-2 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white">
                        {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{profile?.full_name}</span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} />
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={() => navigate('/dashboard')} 
                      className={`cursor-pointer rounded-lg mb-1 p-2 ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800/50 focus:text-pixar-blue focus:bg-gray-800/50'
                          : 'text-gray-700 hover:text-pixar-blue hover:bg-blue-50/50 focus:text-pixar-blue focus:bg-blue-50/50'
                      } transition-all duration-200 group flex items-center`}
                    >
                      <User className="mr-2 h-4 w-4 group-hover:text-pixar-blue transition-colors" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/saved-stories')} 
                      className={`cursor-pointer rounded-lg mb-1 p-2 ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800/50 focus:text-pixar-blue focus:bg-gray-800/50'
                          : 'text-gray-700 hover:text-pixar-blue hover:bg-blue-50/50 focus:text-pixar-blue focus:bg-blue-50/50'
                      } transition-all duration-200 group flex items-center`}
                    >
                      <User className="mr-2 h-4 w-4 group-hover:text-pixar-blue transition-colors" />
                      <span>Saved Stories</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-animations')} 
                      className={`cursor-pointer rounded-lg mb-1 p-2 ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800/50 focus:text-pixar-blue focus:bg-gray-800/50'
                          : 'text-gray-700 hover:text-pixar-blue hover:bg-blue-50/50 focus:text-pixar-blue focus:bg-blue-50/50'
                      } transition-all duration-200 group flex items-center`}
                    >
                      <User className="mr-2 h-4 w-4 group-hover:text-pixar-blue transition-colors" />
                      <span>My Animations</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')} 
                      className={`cursor-pointer rounded-lg mb-1 p-2 ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-pixar-blue hover:bg-gray-800/50 focus:text-pixar-blue focus:bg-gray-800/50'
                          : 'text-gray-700 hover:text-pixar-blue hover:bg-blue-50/50 focus:text-pixar-blue focus:bg-blue-50/50'
                      } transition-all duration-200 group flex items-center`}
                    >
                      <Settings className="mr-2 h-4 w-4 group-hover:text-pixar-blue transition-colors" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className={`cursor-pointer rounded-lg p-2 ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800/50 focus:text-red-400 focus:bg-gray-800/50'
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50 focus:text-red-600 focus:bg-red-50/50'
                      } transition-all duration-200 group flex items-center`}
                    >
                      <LogOut className="mr-2 h-4 w-4 group-hover:text-red-400 transition-colors" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <div className="flex items-center space-x-2">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Button
                  onClick={() => navigate("/login")}
                  className="font-medium hover:scale-105 transition-all duration-300 bg-pixar-blue hover:bg-pixar-darkblue text-white rounded-full px-6 py-5 h-9 shadow-md shadow-blue-500/20"
                >
                  Sign In
                </Button>
              </motion.div>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`ml-2 ${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200/50'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-100'}`}
          >
            <div className="container-custom py-4 space-y-4">
              <div className="space-y-3">
                {(isDashboard ? dashboardNavItems : navItems).map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                      currentPath === item.path 
                        ? 'bg-blue-50 text-pixar-blue'
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-pixar-blue'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Additional mobile menu items for dashboard */}
                {isDashboard && (
                  <>
                    <Link
                      to="/settings"
                      className={`block py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                        currentPath === '/settings' 
                          ? 'bg-blue-50 text-pixar-blue'
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-pixar-blue'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center">
                  <span className={`text-sm font-medium mr-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Theme:</span>
                  <ThemeToggle />
                </div>
                
                {!session && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        navigate("/signup");
                        setMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className={`rounded-full px-4 ${
                        theme === 'dark' 
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="bg-pixar-blue hover:bg-pixar-darkblue text-white rounded-full px-4 shadow-md shadow-blue-500/20"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
