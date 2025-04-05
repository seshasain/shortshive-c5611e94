import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Share2, Home, Pencil } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { resumeSavedStory } from '@/services/savedStory';

interface GeneratedImage {
  sceneNumber: number;
  imageUrl: string;
}

interface StoryData {
  storyId: string;
  title: string;
  logline: string;
  scenes: {
    id: string;
    text: string;
    visualDescription?: string;
  }[];
  images: GeneratedImage[];
}

const AnimationViewer = () => {
  const { id: storyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storyId) {
      toast({
        title: 'Error',
        description: 'No story ID provided',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    const fetchStoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch story details from saved stories
        const { data, error } = await resumeSavedStory(storyId);
        
        if (error || !data) {
          throw new Error(error?.message || 'Failed to load story data');
        }
        
        // Fetch generated images for this story
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const imagesResponse = await fetch(`${API_URL}/api/animation-status/${storyId}`);
        
        if (!imagesResponse.ok) {
          throw new Error('Failed to load generated images');
        }
        
        const imagesData = await imagesResponse.json();
        
        // Combine story data with images
        setStoryData({
          storyId,
          title: data.story.title || 'Untitled Story',
          logline: data.story.logline || '',
          scenes: data.story.scenes || [],
          images: imagesData.images || []
        });
      } catch (err) {
        console.error('Error fetching story data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to load story and images',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStoryData();
  }, [storyId, navigate]);

  const handlePrevImage = () => {
    if (storyData?.images.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? storyData.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (storyData?.images.length) {
      setCurrentImageIndex((prev) => 
        prev === storyData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleEditStory = () => {
    if (storyId) {
      navigate(`/review-story/${storyId}`);
    }
  };

  const handleDownload = () => {
    if (storyData?.images.length && storyData.images[currentImageIndex]) {
      const a = document.createElement('a');
      a.href = storyData.images[currentImageIndex].imageUrl;
      a.download = `scene-${storyData.images[currentImageIndex].sceneNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Image downloaded',
        description: 'The image has been downloaded to your device.',
      });
    }
  };

  const currentScene = storyData?.images[currentImageIndex]?.sceneNumber
    ? storyData.scenes.find(scene => scene.id === String(storyData.images[currentImageIndex].sceneNumber))
    : null;

  return (
    <DashboardLayout>
      <div className="container-custom py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {loading ? (
            <div className="space-y-5">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="aspect-video w-full rounded-xl mt-8" />
              <div className="flex justify-center gap-4 mt-6">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Error Loading Animation</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Card>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient text-center">
                {storyData?.title || 'Story Animation'}
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                {storyData?.logline?.substring(0, 120)}
                {storyData?.logline && storyData.logline.length > 120 ? '...' : ''}
              </p>

              <div className="relative overflow-hidden rounded-xl bg-black shadow-2xl mb-6">
                {storyData?.images.length ? (
                  <div className="aspect-video relative">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={storyData.images[currentImageIndex].imageUrl}
                        alt={`Scene ${storyData.images[currentImageIndex].sceneNumber}`}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </AnimatePresence>
                    
                    <div className="absolute top-4 right-4 px-3 py-2 bg-black/60 text-white rounded text-sm">
                      Scene {currentImageIndex + 1} of {storyData.images.length}
                    </div>
                    
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center bg-gray-900">
                    <p className="text-white/70">No images available for this story</p>
                  </div>
                )}
              </div>
              
              {currentScene && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-2">Scene {storyData?.images[currentImageIndex].sceneNumber}</h3>
                    <p className="text-muted-foreground">{currentScene.text}</p>
                    {currentScene.visualDescription && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="font-medium text-sm mb-1">Visual Description</h4>
                        <p className="text-sm text-muted-foreground">{currentScene.visualDescription}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={handleEditStory}
                  className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Story
                </Button>
                {storyData?.images.length ? (
                  <Button 
                    onClick={handleDownload}
                    variant="outline" 
                    className="pixar-button"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                ) : null}
                <Button 
                  onClick={() => navigate('/saved-stories')}
                  variant="outline" 
                  className="pixar-button"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Stories
                </Button>
              </div>
              
              {storyData?.images.length ? (
                <div className="mt-8 overflow-x-auto pb-4">
                  <div className="flex gap-3 px-2 min-w-0">
                    {storyData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 w-24 h-16 transition-all ${
                          index === currentImageIndex 
                            ? 'border-pixar-blue scale-105 shadow-lg' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={image.imageUrl} 
                          alt={`Thumbnail ${image.sceneNumber}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AnimationViewer; 