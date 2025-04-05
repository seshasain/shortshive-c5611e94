import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Sparkles, Edit, Trash2, Play, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/lib/auth';
import { toast } from 'sonner';
import { useTheme } from '@/lib/theme';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SavedStory {
  id: string;
  story_id: string;
  status: 'DRAFT' | 'SAVED_WITH_ERRORS' | 'COMPLETED';
  error_details?: any;
  generation_state?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  story: {
    title: string;
    description?: string;
    user_id: string;
  };
}

// Helper functions moved to the module level
const getStatusColor = (status: SavedStory['status']) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'SAVED_WITH_ERRORS':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: SavedStory['status']) => {
  switch (status) {
    case 'COMPLETED':
      return CheckCircle;
    case 'DRAFT':
      return Edit;
    case 'SAVED_WITH_ERRORS':
      return AlertCircle;
    default:
      return Book;
  }
};

// StoryDetailsDialog component moved outside the Stories component
const StoryDetailsDialog = ({ story }: { story: SavedStory }) => {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{story.story.title}</DialogTitle>
        <DialogDescription>
          Last updated: {new Date(story.updated_at).toLocaleString()}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Story Description</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {story.story.description || "No description provided"}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
            <div className="text-sm">{new Date(story.created_at).toLocaleString()}</div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">Updated</div>
            <div className="text-sm">{new Date(story.updated_at).toLocaleString()}</div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            <div className="text-sm">
              <Badge variant="secondary" className={getStatusColor(story.status)}>
                {React.createElement(getStatusIcon(story.status), { className: 'h-3 w-3 mr-1 inline-block' })}
                {story.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
        
        {story.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-700 dark:text-gray-300">{story.notes}</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

const Stories = () => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('saved_stories')
        .select(`
          *,
          story:stories(title, description, user_id)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStories(stories.filter(story => story.id !== id));
      toast.success('Story deleted successfully');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
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
                <Book className="h-5 w-5 text-pixar-purple" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Your Saved Stories</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight">
              Saved Stories
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
            } max-w-xl`}>
              View and manage your saved story drafts and completed stories
            </p>
          </div>
          <Button 
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90 mt-4 md:mt-0"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create New Story
          </Button>
        </motion.div>

        {/* Stories Grid */}
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
          ) : stories.length === 0 ? (
            <div className="col-span-full">
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/70 border-pixar-blue/10'
              } backdrop-blur-sm text-center p-8`}>
                <CardContent className="space-y-4">
                  <Book className={`h-12 w-12 mx-auto ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>No Stories Yet</h3>
                  <p className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }>
                    Start creating your first story using our intuitive story builder or AI generator.
                  </p>
                  <Button 
                    onClick={() => navigate('/create')}
                    className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Story
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            stories.map((story, index) => (
              <motion.div
                key={story.id}
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <CardTitle className={`line-clamp-1 cursor-pointer hover:text-pixar-blue transition-colors ${
                              theme === 'dark' ? 'text-white' : ''
                            }`}>{story.story.title}</CardTitle>
                          </DialogTrigger>
                          <StoryDetailsDialog story={story} />
                        </Dialog>
                        <CardDescription className={`line-clamp-2 mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : ''
                        }`}>
                          {story.story.description || 'No description provided'}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(story.status)} border`}
                      >
                        {React.createElement(getStatusIcon(story.status), { className: 'h-3 w-3 mr-1 inline-block' })}
                        {story.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {story.notes && (
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      } mb-4 line-clamp-3`}>
                        {story.notes}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <div>Last updated: {new Date(story.updated_at).toLocaleDateString()}</div>
                        <div>Created: {new Date(story.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className={`h-8 w-8 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-pixar-blue hover:bg-gray-700'
                              : 'text-gray-500 hover:text-pixar-blue'
                          }`}
                          onClick={() => {
                            // Stay on same page - no navigation
                            toast.info(`"${story.story.title}" - ${new Date(story.updated_at).toLocaleString()}`, {
                              description: story.story.description || "No description provided"
                            });
                          }}
                          title="View Story Details"
                        >
                          <Book className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className={`h-8 w-8 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                              : 'text-gray-500 hover:text-red-600'
                          }`}
                          onClick={() => handleDeleteStory(story.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="default"
                      className="w-full bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90"
                      onClick={() => navigate(`/review-story/${story.story_id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      <Play className="h-4 w-4 mr-2 fill-current" />
                      Edit & Generate Video
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Stories; 