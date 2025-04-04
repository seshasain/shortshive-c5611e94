import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = false }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentPath = window.location.pathname;

      if (requireAuth && !session) {
        // If auth is required but user is not logged in
        navigate('/login', { 
          state: { 
            returnUrl: currentPath,
            message: 'Please sign in to access this page.' 
          }
        });
      } else if (!requireAuth && session) {
        // If auth pages are accessed while logged in
        if (currentPath === '/login' || currentPath === '/signup') {
          navigate('/dashboard');
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (requireAuth && !session) {
        navigate('/login');
      } else if (!requireAuth && session) {
        if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
          navigate('/dashboard');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth]);

  return <>{children}</>;
};

export default AuthGuard; 