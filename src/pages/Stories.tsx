
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getStories } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface Story {
  id: string;
  title: string;
  content: string;
  settings: any;
  created_at: string;
}

const Stories = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  // Simulate getting the user ID (in a real app, this would come from an auth context)
  useEffect(() => {
    // This is a placeholder for where you'd get the actual user ID
    // For example, from localStorage or an auth context
    const mockUserId = 'mock-user-id'; 
    setUserId(mockUserId);
  }, []);

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await getStories(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const handleCreateStory = () => {
    navigate('/build-story');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (error) {
    toast({
      title: "Error loading stories",
      description: "There was a problem loading your stories. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Stories</h1>
          <Button onClick={handleCreateStory} className="bg-pixar-blue hover:bg-pixar-darkblue">
            <Plus className="mr-2 h-4 w-4" />
            Create Story
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-pixar-blue" />
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: Story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="truncate">{story.title || "Untitled Story"}</CardTitle>
                    <CardDescription>Created on {formatDate(story.created_at)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">
                      {story.content || "No content yet"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/review-story?id=${story.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Review
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/build-story?id=${story.id}`)}>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No stories created yet</h3>
            <p className="text-gray-500 mb-4 text-center max-w-md">
              Create your first story and bring your imagination to life with Pixarify AI.
            </p>
            <Button onClick={handleCreateStory} className="bg-pixar-blue hover:bg-pixar-darkblue">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Story
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Stories;
