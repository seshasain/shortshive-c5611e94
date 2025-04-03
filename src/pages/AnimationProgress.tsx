import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FilmIcon, CheckCircle, ArrowRight, Download, Share2 } from 'lucide-react';
import { getAnimationProgress } from '@/services/animationService';

const steps = [
  { id: 1, name: 'Processing Story' },
  { id: 2, name: 'Creating Characters' },
  { id: 3, name: 'Building Scenes' },
  { id: 4, name: 'Generating Animation' },
  { id: 5, name: 'Adding Audio' },
  { id: 6, name: 'Final Touches' }
];

const AnimationProgress = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(10);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        
        if (prev === 25) setCurrentStep(2);
        if (prev === 40) setCurrentStep(3);
        if (prev === 55) setCurrentStep(4);
        if (prev === 70) setCurrentStep(5);
        if (prev === 85) setCurrentStep(6);
        
        return prev + 1;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleViewAnimation = () => {
    navigate('/dashboard');
  };
  
  const getStepDescription = (stepId: number) => {
    switch(stepId) {
      case 1:
        return "Analyzing your story and breaking it down into scenes...";
      case 2:
        return "Creating characters based on your story description...";
      case 3:
        return "Building scenery and environments for each scene...";
      case 4:
        return "Generating animation frames and adding motion...";
      case 5:
        return "Adding voiceovers and soundtrack to your animation...";
      case 6:
        return "Applying final touches and optimizing video quality...";
      default:
        return "";
    }
  };

  const getStepProgress = (stepId: number, overallProgress: number) => {
    const stepRanges = {
      1: { start: 0, end: 25 },
      2: { start: 25, end: 40 },
      3: { start: 40, end: 55 },
      4: { start: 55, end: 70 },
      5: { start: 70, end: 85 },
      6: { start: 85, end: 100 }
    };
    
    const range = stepRanges[stepId as keyof typeof stepRanges];
    if (!range) return 0;
    
    if (overallProgress < range.start) return 0;
    if (overallProgress >= range.end) return 100;
    
    return ((overallProgress - range.start) / (range.end - range.start)) * 100;
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
            {isComplete ? 'Animation Complete!' : 'Creating Your Animation'}
          </h1>
          <p className="text-muted-foreground">
            {isComplete 
              ? 'Your Pixar-quality animation has been created successfully' 
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
                  
                  <h2 className="text-2xl font-bold mb-4">Animation Generated Successfully!</h2>
                  <p className="text-gray-600 mb-8">
                    Your animation is now ready to view, download or share.
                  </p>
                  
                  <div className="aspect-video max-w-lg mx-auto mb-8 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="p-10 text-center">
                      <FilmIcon className="h-16 w-16 mx-auto mb-4 text-white opacity-60" />
                      <p className="text-white opacity-70">Animation preview</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleViewAnimation}
                      className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
                    >
                      View Animation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="pixar-button">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="pixar-button">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
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
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  
                  <div className="flex flex-col space-y-6">
                    {steps.map((step) => {
                      const isActive = step.id === currentStep;
                      const isCompleted = step.id < currentStep;
                      
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
                                    animate={{ width: getStepProgress(step.id, progress) + '%' }}
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
                      This process typically takes 1-2 minutes. Please don't close this window.
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

export default AnimationProgress;
