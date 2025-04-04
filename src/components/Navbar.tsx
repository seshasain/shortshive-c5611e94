import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  
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
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Examples', path: '/examples' },
  ];

  const dashboardNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Stories', path: '/stories' },
    { name: 'Create New', path: '/create' },
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
                     currentPath.startsWith('/stories') || 
                     currentPath.startsWith('/create') ||
                     currentPath.startsWith('/settings');

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100/20' 
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
                    : 'text-gray-700 hover:text-pixar-blue'
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
                  className="w-64 mt-2 p-2 bg-white/95 backdrop-blur-lg shadow-xl shadow-blue-500/10 border-none rounded-xl" 
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
                      <span className="font-semibold text-gray-900">{profile?.full_name}</span>
                      <span className="text-sm text-gray-500">{profile?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200/50" />
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={() => navigate('/dashboard')} 
                      className="cursor-pointer rounded-lg mb-1 p-2 text-gray-700 hover:text-pixar-blue hover:bg-blue-50/50 focus:text-pixar-blue focus:bg-blue-50/50 transition-all duration-200 group flex items-center"
                    >
                      <User className="mr-2 h-4 w-4 group-hover:text-pixar-blue transition-colors" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')} 
                      className="cursor-pointer rounded-lg mb-1 p-2 text-gray-700 hover:text-pixar-blue hover:bg-blue-50/50 focus:text-pixar-blue focus:bg-blue-50/50 transition-all duration-200 group flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4 group-hover:text-pixar-blue transition-colors" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200/50" />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="cursor-pointer rounded-lg p-2 text-gray-700 hover:text-red-600 hover:bg-red-50/50 focus:text-red-600 focus:bg-red-50/50 transition-all duration-200 group flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4 group-hover:text-red-600 transition-colors" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="hidden md:block"
              >
                <Link to="/login" className="font-medium text-gray-700 hover:text-pixar-blue transition-all duration-300">
                  Sign in
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                className="shadow-lg shadow-blue-500/20"
              >
                <Link to="/signup">
                  <Button className="primary-button bg-gradient-to-r from-pixar-blue to-pixar-teal hover:opacity-90 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
          
          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800" />
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 mt-2"
          >
            <div className="container-custom py-4 space-y-4">
              {(isDashboard ? dashboardNavItems : navItems).map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link 
                    to={item.path} 
                    className="block py-2 font-medium text-gray-700 hover:text-pixar-blue transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              {!session && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Link 
                    to="/login" 
                    className="block py-2 font-medium text-gray-700 hover:text-pixar-blue transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
