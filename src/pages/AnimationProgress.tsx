import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FilmIcon, 
  CheckCircle, 
  ArrowRight, 
  Download, 
  Share2, 
  ArrowLeft, 
  CameraIcon, 
  PenToolIcon, 
  PanelTopIcon, 
  SparklesIcon, 
  LightbulbIcon 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/lib/theme';

const animationMessages = [
  "Brewing up your story magic...",
  "Crafting beautiful scenes...",
  "Building your characters...",
  "Adding that Pixar sparkle...",
  "Creating visual wonders...",
  "Making storytelling magic...",
  "Designing your world...",
  "Adding perfect lighting...",
  "Framing each scene..."
];

interface GeneratedImage {
  sceneNumber: number;
  imageUrl: string;
  b2Url?: string;
}

interface AnimationState {
  storyId: string;
  title: string;
  status: 'processing' | 'complete' | 'error' | 'partial';
  progress: number;
  currentStep: number;
  images: GeneratedImage[];
  error?: string;
  storageType?: 'local' | 'b2';
  failedScenes?: number[];
}

const AnimationProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [animationState, setAnimationState] = useState<AnimationState>({
    storyId: location.state?.storyId || '',
    title: location.state?.title || 'Your Story',
    status: location.state?.status || 'processing',
    progress: location.state?.progress || 10,
    currentStep: location.state?.currentStep || 1,
    images: location.state?.images || [],
    error: location.state?.error || undefined,
    storageType: location.state?.storageType || 'local',
    failedScenes: location.state?.failedScenes || []
  });
  
  // For rotating animation messages
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Rotate through animation messages
  useEffect(() => {
    if (animationState.status === 'processing') {
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % animationMessages.length);
      }, 3500);
      
      return () => clearInterval(interval);
    }
  }, [animationState.status]);
  
  useEffect(() => {
    // If no story ID in state, navigate back to dashboard
    if (!animationState.storyId && !location.state?.images) {
      toast({
        title: 'Error',
        description: 'No story found to generate animation',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    // Initial images might be provided from the previous page
    if (location.state?.images && location.state.images.length > 0) {
      setAnimationState(prev => ({
        ...prev,
        images: location.state.images,
        progress: location.state.progress || 100,
        currentStep: location.state.currentStep || 5,
        status: location.state.status || 'complete',
        storageType: location.state.storageType || 'local'
      }));
      return;
    }

    // Show a toast notification to let users know they can leave
    toast({
      title: "Animation is processing",
      description: "You can close this window and come back later. Your animation will continue processing.",
    });

    // Poll the server for animation status
    const pollInterval = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/animation-status/${animationState.storyId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch animation status');
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          setAnimationState(prev => ({
            ...prev,
            status: 'error',
            error: data.message || 'Failed to generate animation'
          }));
          clearInterval(pollInterval);
          return;
        }
        
        // Update animation state
        setAnimationState(prev => {
          const newState = {
            ...prev,
            status: data.status,
            progress: data.progress,
            currentStep: mapProgressToStep(data.progress),
            images: data.images || prev.images,
            storageType: data.storageType || prev.storageType
          };
          
          // If complete, stop polling
          if (data.status === 'complete') {
            clearInterval(pollInterval);
          }
          
          return newState;
        });
      } catch (error) {
        console.error('Error polling animation status:', error);
      }
    }, 5000); // Longer interval to reduce server load
    
    return () => clearInterval(pollInterval);
  }, [location.state, navigate, animationState.storyId]);
  
  const handleViewAnimation = () => {
    navigate(`/story/${animationState.storyId}`);
  };
  
  const handleBackToStory = () => {
    navigate(`/review-story/${animationState.storyId}`);
  };
  
  const isComplete = animationState.status === 'complete';
  const hasError = animationState.status === 'error';
  const isPartial = animationState.status === 'partial';
  
  // Step icons for the animation process
  const StepIcon = ({ step }: { step: number }) => {
    const currentStep = animationState.currentStep;
    const isActive = step <= currentStep;
    const iconClass = isActive 
      ? 'text-pixar-blue' 
      : theme === 'dark' ? 'text-gray-600' : 'text-gray-300';
    
    switch(step) {
      case 1:
        return <LightbulbIcon className={`h-5 w-5 ${iconClass}`} />;
      case 2:
        return <PenToolIcon className={`h-5 w-5 ${iconClass}`} />;
      case 3:
        return <PanelTopIcon className={`h-5 w-5 ${iconClass}`} />;
      case 4:
        return <CameraIcon className={`h-5 w-5 ${iconClass}`} />;
      case 5:
        return <SparklesIcon className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <FilmIcon className={`h-5 w-5 ${iconClass}`} />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container-custom py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient">
            {isComplete ? 'Your Animation is Ready!' : 
             isPartial ? 'Animation Partially Generated' :
             hasError ? 'Error Occurred' : 'Creating Your Animation'}
          </h1>
          <p className="text-muted-foreground">
            {isComplete 
              ? `"${animationState.title}" has been transformed into a visual story` 
              : isPartial
                ? 'Some scenes were generated successfully, but others failed'
                : hasError
                  ? 'There was an error generating your animation'
                  : 'Our AI is working to bring your story to life'}
          </p>
          {animationState.storageType === 'b2' && (
            <span className="inline-block mt-2 text-xs px-2 py-1 bg-pixar-blue/10 text-pixar-blue rounded-full">
              Images stored in cloud
            </span>
          )}
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Card className={`overflow-hidden border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'} shadow-xl`}>
            <CardContent className="p-0">
              {isComplete ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center p-8"
                >
                  <div className="mb-6">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }}
                      className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Animation Complete!</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                    Your story has been transformed into beautiful visuals. Explore your new animation!
                  </p>
                  
                  {animationState.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {animationState.images.slice(0, 4).map((image, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="overflow-hidden rounded-lg border dark:border-gray-700"
                        >
                          <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                            <img 
                              src={image.imageUrl} 
                              alt={`Scene ${image.sceneNumber}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                              Scene {image.sceneNumber}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video max-w-lg mx-auto mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                      <div className="p-10 text-center">
                        <FilmIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">No images available</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleViewAnimation}
                      className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white hover:opacity-90 pixar-button"
                    >
                      View Full Animation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="pixar-button"
                      onClick={handleBackToStory}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Story
                    </Button>
                  </div>
                </motion.div>
              ) : hasError ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-10 p-8"
                >
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl text-red-600 dark:text-red-400">!</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Generation Error</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                    {animationState.error || "There was an error generating your animation."}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="pixar-button"
                    onClick={handleBackToStory}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Story
                  </Button>
                </motion.div>
              ) : (
                <div>
                  {/* Hero Animation Section */}
                  <div className="relative w-full aspect-video bg-gradient-to-b from-pixar-blue/10 to-pixar-teal/5 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="relative w-48 h-48"
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 40, 
                          ease: "linear", 
                          repeat: Infinity 
                        }}
                      >
                        <div className="absolute w-full h-full rounded-full border-4 border-dashed border-pixar-blue/20 dark:border-pixar-blue/15"></div>
                      </motion.div>
                      
                      <motion.div
                        className="absolute w-36 h-36"
                        animate={{ rotate: -360 }}
                        transition={{ 
                          duration: 30, 
                          ease: "linear", 
                          repeat: Infinity 
                        }}
                      >
                        <div className="absolute w-full h-full rounded-full border-4 border-dashed border-pixar-teal/30 dark:border-pixar-teal/20"></div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl shadow-pixar-blue/10 z-10"
                        animate={{ 
                          scale: [0.9, 1.1, 0.9],
                        }}
                        transition={{ 
                          duration: 6, 
                          ease: "easeInOut", 
                          repeat: Infinity,
                        }}
                      >
                        <FilmIcon className="h-12 w-12 text-pixar-blue" />
                      </motion.div>
                      
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={messageIndex}
                          className="absolute bottom-6 left-0 right-0 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h2 className="font-bold text-xl text-pixar-blue dark:text-pixar-teal">
                            {animationMessages[messageIndex]}
                          </h2>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Floating particles */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-pixar-blue/20 dark:bg-pixar-blue/30"
                        initial={{ 
                          x: Math.random() * 100 - 50 + "%", 
                          y: Math.random() * 100 + "%",
                          opacity: 0.2 
                        }}
                        animate={{ 
                          x: Math.random() * 100 - 50 + "%", 
                          y: Math.random() * 100 + "%",
                          opacity: [0.2, 0.6, 0.2],
                          scale: [1, 1.5, 1]
                        }}
                        transition={{ 
                          duration: 15 + Math.random() * 20, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Status Section */}
                  <div className="p-8">
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-medium">{animationState.progress}%</span>
                      </div>
                      <Progress value={animationState.progress} className="h-2 bg-gray-100 dark:bg-gray-700" />
                    </div>
                    
                    <div className="mb-10">
                      <div className="relative">
                        <div className="absolute left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 top-5"></div>
                        <div className="relative z-10 flex justify-between">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                step <= animationState.currentStep 
                                  ? 'bg-pixar-blue/20 dark:bg-pixar-blue/30' 
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                <StepIcon step={step} />
                              </div>
                              <span className={`mt-2 text-xs ${
                                step <= animationState.currentStep 
                                  ? 'text-pixar-blue dark:text-pixar-teal' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                {getStepDescription(step)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Generating your animation may take a few minutes. You can safely close this window and check back later.
                        We'll send you a notification when it's ready!
                      </p>
                      
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Processing "{animationState.title}" • Story ID: {animationState.storyId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const getStepDescription = (stepId: number): string => {
  switch (stepId) {
    case 1:
      return 'Ideas';
    case 2:
      return 'Story';
    case 3:
      return 'Scenes';
    case 4:
      return 'Visuals';
    case 5:
      return 'Finalize';
    default:
      return '';
  }
};

const mapProgressToStep = (progress: number): number => {
  if (progress < 20) return 1;
  if (progress < 40) return 2;
  if (progress < 60) return 3;
  if (progress < 80) return 4;
  return 5;
};

const getStepProgress = (stepId: number, overallProgress: number) => {
  const stepStart = (stepId - 1) * 20;
  const stepEnd = stepId * 20;
  
  if (overallProgress < stepStart) return 0;
  if (overallProgress > stepEnd) return 100;
  
  return ((overallProgress - stepStart) / 20) * 100;
};

export default AnimationProgress;
