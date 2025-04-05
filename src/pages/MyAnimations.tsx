import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Sparkles, Play, Trash2, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/lib/auth';
import { toast } from 'sonner';
import { useTheme } from '@/lib/theme';

interface Animation {
  id: string;
  story_id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error_details?: string;
  output_url?: string;
  created_at: string;
  updated_at: string;
  story: {
    title: string;
    description?: string;
    user_id: string;
  };
}

const MyAnimations = () => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchAnimations();
    // Set up real-time subscription for animation updates
    const channel = supabase
      .channel('animations_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'animations'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setAnimations(prev => 
              prev.map(anim => 
                anim.id === payload.new.id ? { ...anim, ...payload.new } : anim
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setAnimations(prev => prev.filter(anim => anim.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnimations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('animations')
        .select(`
          *,
          story:stories(title, description, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimations(data || []);
    } catch (error) {
      console.error('Error fetching animations:', error);
      toast.error('Failed to load animations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnimation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('animations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAnimations(animations.filter(animation => animation.id !== id));
      toast.success('Animation deleted successfully');
    } catch (error) {
      console.error('Error deleting animation:', error);
      toast.error('Failed to delete animation');
    }
  };

  const getStatusColor = (status: Animation['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Animation['status']) => {
    switch (status) {
      case 'COMPLETED':
        return CheckCircle;
      case 'PROCESSING':
        return Film;
      case 'PENDING':
        return Clock;
      case 'FAILED':
        return AlertCircle;
      default:
        return Film;
    }
  };

  return (
    <DashboardLayout>
      <div className="container-custom py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`inline-block mb-3 px-4 py-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 shadow-lg backdrop-blur-sm border border-gray-700' 
                  : 'bg-white shadow-lg backdrop-blur-sm border border-pixar-blue/10'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Film className="h-5 w-5 text-pixar-purple" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Your Animations</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight">
              My Animations
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
            } max-w-xl`}>
              View and manage your generated animations
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/create'}
            className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90 mt-4 md:mt-0"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create New Animation
          </Button>
        </motion.div>

        {/* Animations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <Card key={i} className={`${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/70 border-pixar-blue/10'
              } backdrop-blur-sm`}>
                <CardHeader className="space-y-2">
                  <div className={`h-4 w-2/3 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded animate-pulse`} />
                  <div className={`h-3 w-1/2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded animate-pulse`} />
                </CardHeader>
                <CardContent>
                  <div className={`h-24 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded animate-pulse mb-4`} />
                  <div className={`h-3 w-full ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded animate-pulse`} />
                </CardContent>
              </Card>
            ))
          ) : animations.length === 0 ? (
            <div className="col-span-full">
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700 text-gray-300' 
                  : 'bg-white/70 border-pixar-blue/10 text-gray-700'
              } backdrop-blur-sm text-center p-8`}>
                <CardContent className="space-y-4">
                  <Film className={`h-12 w-12 mx-auto ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>No Animations Yet</h3>
                  <p className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }>
                    Start by creating a story and generating your first animation.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/create'}
                    className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Animation
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            animations.map((animation, index) => (
              <motion.div
                key={animation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`group ${
                  theme === 'dark'
                    ? 'bg-gray-800/70 hover:bg-gray-800/90 border-gray-700'
                    : 'bg-white/70 hover:bg-white/90 border-pixar-blue/10'
                } backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className={`line-clamp-1 ${
                          theme === 'dark' ? 'text-white' : ''
                        }`}>{animation.story.title}</CardTitle>
                        <CardDescription className={`line-clamp-2 mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : ''
                        }`}>
                          {animation.story.description || 'No description provided'}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(animation.status)} border`}
                      >
                        {React.createElement(getStatusIcon(animation.status), { className: 'h-3 w-3 mr-1 inline-block' })}
                        {animation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      {animation.status === 'FAILED' && animation.error_details && (
                        <p className="text-sm text-red-600 mb-2">
                          Error: {animation.error_details}
                        </p>
                      )}
                      {animation.status === 'PROCESSING' && (
                        <div className={`w-full ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        } rounded-full h-2.5 mb-2`}>
                          <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Created: {new Date(animation.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        {animation.status === 'COMPLETED' && animation.output_url && (
                          <>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-gray-500 hover:text-pixar-blue"
                              onClick={() => window.open(animation.output_url, '_blank')}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-gray-500 hover:text-pixar-blue"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = animation.output_url!;
                                link.download = `${animation.story.title}.mp4`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteAnimation(animation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyAnimations; 