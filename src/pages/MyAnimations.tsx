
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Film, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { getAnimations } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const MyAnimations = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  // Simulate getting the user ID (in a real app, this would come from an auth context)
  useEffect(() => {
    // This is a placeholder for where you'd get the actual user ID
    const mockUserId = 'mock-user-id'; 
    setUserId(mockUserId);
  }, []);

  const { data: animations, isLoading, error } = useQuery({
    queryKey: ['animations', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await getAnimations(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const handleCreateAnimation = () => {
    navigate('/build-story');
  };

  if (error) {
    toast({
      title: "Error loading animations",
      description: "There was a problem loading your animations. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Animations</h1>
          <Button onClick={handleCreateAnimation} className="bg-pixar-blue hover:bg-pixar-darkblue">
            <Plus className="mr-2 h-4 w-4" />
            Create Animation
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-pixar-blue" />
          </div>
        ) : animations && animations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animations.map((animation) => (
              <motion.div
                key={animation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard
                  id={animation.id}
                  title={animation.title}
                  description={animation.description || "No description"}
                  status={animation.status}
                  thumbnail={animation.thumbnail_url}
                  createdAt={animation.created_at}
                  type="animation"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Film className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No animations created yet</h3>
            <p className="text-gray-500 mb-4 text-center max-w-md">
              Create your first animation and bring your stories to life with Pixarify AI.
            </p>
            <Button onClick={handleCreateAnimation} className="bg-pixar-blue hover:bg-pixar-darkblue">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Animation
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAnimations;
