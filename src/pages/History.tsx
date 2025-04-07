import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Edit2, Play } from 'lucide-react';
import { supabase } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';

interface Story {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch stories from stories table
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: 'Error loading stories',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStory = (storyId: string) => {
    navigate(`/review-story/${storyId}`);
  };

  const handleGenerateAnimation = (storyId: string) => {
    navigate(`/generating/${storyId}`);
  };

  return (
    <DashboardLayout>
      <div className="container-custom py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="inline-block mb-3 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-pixar-blue/10 dark:border-pixar-blue/20">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-pixar-purple dark:text-pixar-purple/80" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Story History</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight dark:text-white">
              Story History
            </h1>
            <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-xl">
              View your complete story history and manage your stories
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <Card className="border-pixar-blue/10 dark:border-pixar-blue/20 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stories yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start creating your first story to see it here
              </p>
              <Button onClick={() => navigate('/build-story')}>
                Create New Story
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="border-pixar-blue/10 dark:border-pixar-blue/20 bg-white/80 dark:bg-gray-800/80 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold dark:text-white">{story.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated {formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStory(story.id)}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateAnimation(story.id)}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History; 