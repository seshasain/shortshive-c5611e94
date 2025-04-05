import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FilmIcon, CheckCircle, ArrowRight, Download, Share2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const steps = [
  { id: 1, name: 'Processing Story' },
  { id: 2, name: 'Creating Characters' },
  { id: 3, name: 'Building Scenes' },
  { id: 4, name: 'Generating Animation' },
  { id: 5, name: 'Finalizing Images' }
];

interface GeneratedImage {
  sceneNumber: number;
  imageUrl: string;
}

interface AnimationState {
  storyId: string;
  title: string;
  status: 'processing' | 'complete' | 'error';
  progress: number;
  currentStep: number;
  images: GeneratedImage[];
  error?: string;
}

const AnimationProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationState, setAnimationState] = useState<AnimationState>({
    storyId: location.state?.storyId || '',
    title: location.state?.title || 'Your Story',
    status: 'processing',
    progress: 10,
    currentStep: 1,
    images: location.state?.images || []
  });
  
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
        progress: 85,
        currentStep: 5,
        status: 'complete'
      }));
      return;
    }

    // Poll the server for animation status
    const pollInterval = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
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
            images: data.images || prev.images
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
    }, 3000);
    
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
            {isComplete ? 'Images Generated!' : hasError ? 'Error Occurred' : 'Creating Your Images'}
          </h1>
          <p className="text-muted-foreground">
            {isComplete 
              ? `Your images for "${animationState.title}" have been created successfully` 
              : hasError
                ? 'There was an error generating your images'
                : 'Please wait while we bring your story to life'}
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              {isComplete ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Images Generated Successfully!</h2>
                  <p className="text-gray-600 mb-8">
                    Your story has been visualized. Here are the generated images:
                  </p>
                  
                  {animationState.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {animationState.images.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg border">
                          <div className="aspect-video bg-gray-100 relative">
                            <img 
                              src={image.imageUrl} 
                              alt={`Scene ${image.sceneNumber}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                              Scene {image.sceneNumber}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video max-w-lg mx-auto mb-8 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <div className="p-10 text-center">
                        <FilmIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No images available</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleViewAnimation}
                      className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
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
                  className="text-center py-10"
                >
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl text-red-600">!</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Generation Error</h2>
                  <p className="text-gray-600 mb-8">
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
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-medium">{animationState.progress}%</span>
                    </div>
                    <Progress value={animationState.progress} className="h-3" />
                  </div>
                  
                  <div className="flex flex-col space-y-6">
                    {steps.map((step) => {
                      const isActive = step.id === animationState.currentStep;
                      const isCompleted = step.id < animationState.currentStep;
                      
                      return (
                        <motion.div 
                          key={step.id}
                          animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                          className={`flex items-center p-4 rounded-lg border ${
                            isActive 
                              ? 'bg-pixar-blue/5 border-pixar-blue' 
                              : isCompleted 
                                ? 'bg-green-50 border-green-200' 
                                : 'border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-green-100' 
                              : isActive 
                                ? 'bg-pixar-blue/10' 
                                : 'bg-gray-100'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <span className={`text-sm font-bold ${
                                isActive ? 'text-pixar-blue' : 'text-gray-500'
                              }`}>
                                {step.id}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              isActive ? 'text-pixar-blue' : isCompleted ? 'text-green-700' : 'text-gray-700'
                            }`}>
                              {step.name}
                            </h3>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2"
                              >
                                <p className="text-sm text-gray-600">
                                  {getStepDescription(step.id)}
                                </p>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: '0%' }}
                                    animate={{ width: getStepProgress(step.id, animationState.progress) + '%' }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full bg-pixar-blue"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      This process typically takes 1-3 minutes. Please don't close this window.
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper functions
const getStepDescription = (stepId: number) => {
  switch(stepId) {
    case 1:
      return "Analyzing your story and breaking it down into scenes...";
    case 2:
      return "Creating character concepts based on your story description...";
    case 3:
      return "Building scenery and environments for each scene...";
    case 4:
      return "Generating images for each scene of your story...";
    case 5:
      return "Finalizing and optimizing image quality...";
    default:
      return "";
  }
};

// Map progress percentage to step number
const mapProgressToStep = (progress: number): number => {
  if (progress < 20) return 1;
  if (progress < 40) return 2;
  if (progress < 60) return 3;
  if (progress < 80) return 4;
  return 5;
};

const getStepProgress = (stepId: number, overallProgress: number) => {
  // Calculate progress within the current step
  const stepRanges = {
    1: { start: 0, end: 20 },
    2: { start: 20, end: 40 },
    3: { start: 40, end: 60 },
    4: { start: 60, end: 80 },
    5: { start: 80, end: 100 }
  };
  
  const range = stepRanges[stepId as keyof typeof stepRanges];
  if (!range) return 0;
  
  if (overallProgress < range.start) return 0;
  if (overallProgress >= range.end) return 100;
  
  // Calculate percentage within this step's range
  return ((overallProgress - range.start) / (range.end - range.start)) * 100;
};

export default AnimationProgress;
