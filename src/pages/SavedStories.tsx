import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Sparkles, Edit, Trash2, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/lib/auth';
import { toast } from 'sonner';

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

const Stories = () => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);

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
              className="inline-block mb-3 px-4 py-2 rounded-full bg-white shadow-lg backdrop-blur-sm border border-pixar-blue/10"
            >
              <div className="flex items-center space-x-2">
                <Book className="h-5 w-5 text-pixar-purple" />
                <span className="text-sm font-medium text-gray-700">Your Saved Stories</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight">
              Saved Stories
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              View and manage your saved story drafts and completed stories
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/create'}
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
              <Card key={i} className="bg-white/70 backdrop-blur-sm border-pixar-blue/10">
                <CardHeader className="space-y-2">
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : stories.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-white/70 backdrop-blur-sm border-pixar-blue/10 text-center p-8">
                <CardContent className="space-y-4">
                  <Book className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">No Stories Yet</h3>
                  <p className="text-gray-500">
                    Start creating your first story using our intuitive story builder or AI generator.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/create'}
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
                <Card className="group bg-white/70 hover:bg-white/90 backdrop-blur-sm border-pixar-blue/10 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{story.story.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
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
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {story.notes}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Last updated: {new Date(story.updated_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-gray-500 hover:text-pixar-blue"
                          onClick={() => window.location.href = `/story/${story.story_id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteStory(story.id)}
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

export default Stories; 