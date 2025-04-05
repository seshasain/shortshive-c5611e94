
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { refineStory } from '@/services/api';
import { saveStory, checkSavedStory, resumeSavedStory } from '@/services/savedStory';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Play, ArrowLeft, ArrowRight, Check, Wand2, Film, Smartphone, Palette, VideoIcon, Settings, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import SceneCard from '@/components/dashboard/SceneCard';
import StoryLoadingAnimation from '@/components/StoryLoadingAnimation';
import { supabase } from '@/integrations/supabase/client';

const mockScenes = [];

const colorPalettes = [
  { id: 'auto', name: 'Auto', colors: ['#55A4F3', '#60C8DC', '#8BE0CB', '#ACECBE', '#F2F7C4'] },
  { id: 'vibrant', name: 'Vibrant', colors: ['#FF5F6D', '#FFC371', '#3CAEA3', '#F8B195', '#6639A6'] },
  { id: 'pastel', name: 'Pastel', colors: ['#F9DFDC', '#E3BAC6', '#BCABAE', '#8896AB', '#5B5F97'] },
  { id: 'retro', name: 'Retro', colors: ['#2B303A', '#D64933', '#EEE5E9', '#7D8491', '#92DCE5'] },
  { id: 'fantasy', name: 'Fantasy', colors: ['#7400B8', '#5E60CE', '#4EA8DE', '#56CFE1', '#80FFDB'] },
  { id: 'nature', name: 'Nature', colors: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2', '#D8F3DC'] }
];

// Type definitions for the incoming data
interface StoryData {
  storyType: 'ai-prompt' | 'manual';
  storyContent: string;
  settings: {
    emotion: string;
    language: string;
    voiceStyle: string;
    duration: number;
    addHook: boolean;
  };
  timestamp: string;
}

// Add Scene interface
interface Scene {
  id: string;
  text: string;
  image?: string;
  visualDescription?: string;
}

const StoryReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { id: storyId } = useParams();
  
  // Default values for when there's no state
  const [storyText, setStoryText] = useState("");
  const [storyType, setStoryType] = useState<'ai-prompt' | 'manual'>('manual');
  const [promptText, setPromptText] = useState("");
  const [scenes, setScenes] = useState<Scene[]>(mockScenes);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [colorPalette, setColorPalette] = useState('auto');
  const [activeTab, setActiveTab] = useState('story');
  const [isLoading, setIsLoading] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedState, setHasSavedState] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  
  // Define emotionToColorMap outside of useEffect to avoid duplication
  const emotionToColorMap: Record<string, string> = {
    'Happiness': 'vibrant',
    'Sadness': 'pastel',
    'Anger': 'retro',
    'Fear': 'fantasy',
    'Love': 'nature',
  };
  
  // Process data from StoryBuilder when component mounts
  useEffect(() => {
    const state = location.state as { storyData?: StoryData; generatedStory?: any } | null;
    
    // If we already have generated story data in the router state, use that
    if (state?.generatedStory) {
      setStoryTitle(state.generatedStory.title);
      setStoryText(state.generatedStory.logline);
      setScenes(state.generatedStory.scenes.map((scene, index) => ({
        id: String(index + 1),
        text: scene.dialogueOrNarration,
        image: `https://source.unsplash.com/random/500x400?story=${index + 1}`,
        visualDescription: scene.visualDescription
      })));
      setStoryType(state.storyData?.storyType || 'ai-prompt');
      setPromptText(state.storyData?.storyContent || '');
      if (state.storyData?.settings?.emotion) {
        const suggestedPalette = emotionToColorMap[state.storyData.settings.emotion] || 'auto';
        setColorPalette(suggestedPalette);
      }
      console.log('Using existing story data from navigation state');
      return;
    }

    if (state?.storyData) {
      console.log('Received data from StoryBuilder:', JSON.stringify(state.storyData, null, 2));
      
      // Update state based on the received data
      const { storyType, storyContent, settings } = state.storyData;
      
      setStoryType(storyType);
      
      if (storyType === 'ai-prompt') {
        setPromptText(storyContent);
        // Make API call to refine the story
        const refineStoryData = async () => {
          setIsLoading(true);
          try {
            const response = await refineStory(state.storyData);
            if (response.success && response.data) {
              setStoryTitle(response.data.title);
              setStoryText(response.data.logline);
              setScenes(response.data.scenes.map((scene, index) => ({
                id: String(index + 1),
                text: scene.dialogueOrNarration,
                image: `https://source.unsplash.com/random/500x400?story=${index + 1}`,
                visualDescription: scene.visualDescription
              })));
              
              // Update the router state to include the generated story
              // This will prevent API calls on refresh without using localStorage
              const newState = {
                ...state,
                generatedStory: response.data
              };
              
              // Replace current state with updated one that includes generated story
              navigate('', { state: newState, replace: true });
            }
          } catch (error) {
            console.error('Error refining story:', error);
          } finally {
            setIsLoading(false);
          }
        };
        refineStoryData();
      } else {
        setStoryText(storyContent);
      }
      
      // Use settings to inform the UI
      if (settings.emotion) {
        const suggestedPalette = emotionToColorMap[settings.emotion] || 'auto';
        setColorPalette(suggestedPalette);
        console.log(`Set color palette to ${suggestedPalette} based on emotion: ${settings.emotion}`);
      }
    } else {
      console.log('No data received from StoryBuilder, using default values');
    }
  }, [location.state, navigate]);
  
  // Check for saved story on mount
  useEffect(() => {
    const checkForSavedStory = async () => {
      if (!storyId) return;

      const { data, error } = await checkSavedStory(storyId);
      if (error) {
        console.error('Error checking saved story:', error);
        return;
      }

      if (data) {
        setHasSavedState(true);
        // If there's generation state, restore it
        if (data.generationState) {
          setStoryTitle(data.generationState.title || '');
          setStoryText(data.generationState.storyContent || '');
          setScenes(data.generationState.scenes || []);
          setColorPalette(data.generationState.visualSettings?.colorPalette || 'auto');
          setAspectRatio(data.generationState.visualSettings?.aspectRatio || '16:9');
          
          toast({
            title: 'Story loaded',
            description: 'Successfully loaded your saved story.',
            variant: 'default',
          });
        }
      }
    };

    checkForSavedStory();
  }, [storyId, toast]);
  
  const handleBack = () => {
    navigate('/build-story');
  };
  
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Prepare the animation data
      const animationData = {
        storyContent: storyText,
        scenes: scenes,
        visualSettings: {
          colorPalette,
          aspectRatio
        },
        originalStoryType: storyType,
        originalPrompt: storyType === 'ai-prompt' ? promptText : null,
        timestamp: new Date().toISOString()
      };

      // Save the current state before generating
      if (storyId) {
        const { error: saveError } = await saveStory(
          storyId,
          {
            title: storyTitle,
            storyContent: storyText,
            scenes,
            visualSettings: {
              colorPalette,
              aspectRatio
            }
          }
        );

        if (saveError) {
          toast({
            title: 'Error saving story',
            description: 'Could not save story state. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }

      // Proceed with generation
      const response = await fetch('/api/generate-animation', {
        method: 'POST',
        body: JSON.stringify(animationData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate animation');
      }

      // If successful, navigate to generating page
      navigate('/generating');
    } catch (error) {
      console.error('Error generating animation:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate the animation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditScene = (id: string, newText: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, text: newText } : scene
    ));
  };
  
  const handleSaveStory = () => {
    // Show the save dialog
    setSaveName(storyTitle || 'My Story');
    setSaveDialogOpen(true);
  };
  
  const handleConfirmSave = () => {
    // Get existing saved stories or initialize an empty array
    const existingSavedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    
    // Create story object to save
    const storyToSave = {
      id: Date.now().toString(),
      title: saveName,
      timestamp: new Date().toISOString(),
      data: {
        title: storyTitle,
        logline: storyText,
        scenes: scenes.map(scene => ({
          sceneNumber: parseInt(scene.id),
          durationEstimate: 10,
          visualDescription: scene.visualDescription || '',
          dialogueOrNarration: scene.text
        })),
        storyType,
        originalPrompt: promptText,
        colorPalette,
        aspectRatio
      }
    };
    
    // Add the new story to the array
    existingSavedStories.push(storyToSave);
    
    // Save back to localStorage
    localStorage.setItem('savedStories', JSON.stringify(existingSavedStories));
    
    // Close the dialog and show success message
    setSaveDialogOpen(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  // Add resume functionality
  const handleResume = async () => {
    if (!storyId) return;

    const { data, error } = await resumeSavedStory(storyId);
    if (error) {
      toast({
        title: 'Error resuming story',
        description: 'Could not resume the saved story. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      // Restore the generation state
      const { generationState, story } = data;
      setStoryTitle(generationState.title || '');
      setStoryText(generationState.storyContent || '');
      setScenes(generationState.scenes || []);
      setColorPalette(generationState.visualSettings?.colorPalette || 'auto');
      setAspectRatio(generationState.visualSettings?.aspectRatio || '16:9');

      toast({
        title: 'Story resumed',
        description: 'Successfully restored your saved story.',
        variant: 'default',
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container-custom py-16">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden">
          <motion.div 
            animate={{ 
              y: [0, -25, 0],
              opacity: [0.08, 0.15, 0.08]
            }} 
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-10 w-96 h-96 rounded-full bg-pixar-orange/20 blur-3xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 25, 0],
              opacity: [0.07, 0.12, 0.07]
            }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full bg-pixar-blue/20 blur-3xl"
          />
        </div>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
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
                <Sparkles className="h-5 w-5 text-pixar-purple" />
                <span className="text-sm font-medium text-gray-700">Refine Your Animation</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight">
              {storyTitle ? `"${storyTitle}"` : 'Review Your Story'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Review, edit, and customize your masterpiece before bringing it to life with animation
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 md:mt-0">
            <Button 
              onClick={handleSaveStory}
              variant="outline"
              className="flex items-center border border-pixar-purple/20 text-pixar-purple hover:bg-pixar-purple/5 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Story
            </Button>
          </div>
        </motion.div>
        
        {/* Success toast notification */}
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 bg-pixar-green/20 border-l-4 border-pixar-green text-green-800 p-4 rounded shadow-lg"
          >
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium">Story saved successfully!</p>
            </div>
          </motion.div>
        )}
        
        {/* Loading Animation */}
        {isLoading && (
          <StoryLoadingAnimation />
        )}
        
        {/* Main Tabs Navigation */}
        <Tabs defaultValue="story" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-gray-100/80 rounded-xl">
            <TabsTrigger value="story" className="data-[state=active]:bg-pixar-blue data-[state=active]:text-white rounded-lg py-3 transition-all">
              <Edit className="mr-2 h-4 w-4" />
              Story Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-pixar-blue data-[state=active]:text-white rounded-lg py-3 transition-all">
              <Settings className="mr-2 h-4 w-4" />
              Visual Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Story Content Tab */}
          <TabsContent value="story" className="space-y-8">
            {/* Info Banner */}
            {storyType === 'ai-prompt' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-pixar-blue/5 to-pixar-purple/5 rounded-xl p-6 border border-pixar-blue/10 shadow-sm"
              >
                <h3 className="font-semibold text-pixar-blue flex items-center mb-3 text-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Story Generation
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  We've used your prompt: <span className="font-medium text-gray-900 bg-pixar-blue/10 px-2 py-1 rounded">{promptText}</span> to generate a complete story. 
                  You can edit story and its scenes before proceeding to animation. 
                </p>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Complete Story Section */}
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full overflow-hidden border-pixar-blue/10 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent pb-3 pt-6">
                    <CardTitle className="flex items-center text-xl">
                      <Edit className="mr-3 h-5 w-5 text-pixar-blue" />
                      Complete Story
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Edit your full story text
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Textarea 
                      value={storyText} 
                      onChange={(e) => setStoryText(e.target.value)}
                      className="min-h-[450px] border-pixar-blue/20 focus:border-pixar-blue focus-visible:ring-pixar-blue/40 text-gray-700 text-base shadow-sm"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-3 border-t pt-5 bg-gray-50">
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 transition-colors">
                      <Wand2 className="mr-2 h-4 w-4 text-pixar-purple" />
                      Improve Text
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Scene Breakdown */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full overflow-hidden border-pixar-blue/10 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent pb-3 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Film className="mr-3 h-5 w-5 text-pixar-blue" />
                        <CardTitle className="text-xl">Scene Breakdown</CardTitle>
                      </div>
                      <div className="text-sm font-medium text-gray-600 bg-gray-100 py-1.5 px-3 rounded-full">
                        {scenes.length} scenes total
                      </div>
                    </div>
                    <CardDescription className="text-gray-500">
                      Review and edit individual scenes for your animation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {scenes.map((scene, index) => (
                        <SceneCard 
                          key={scene.id}
                          scene={scene}
                          index={index}
                          onEdit={handleEditScene}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-5 bg-gray-50">
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-100 transition-colors">
                      <Wand2 className="mr-2 h-4 w-4 text-pixar-blue" />
                      Regenerate Scenes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('settings')}
                      className="gap-2 border border-pixar-blue/20 text-pixar-blue hover:bg-pixar-blue/5 transition-all"
                    >
                      Continue to Visual Settings
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          {/* Visual Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Combined Visual Settings Card */}
                <Card className="overflow-hidden border-pixar-blue/10 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent pb-3 pt-6">
                    <CardTitle className="flex items-center text-xl">
                      <Sparkles className="mr-3 h-5 w-5 text-pixar-blue" />
                      Animation Style & Format
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Define the visual aesthetic and format of your animation
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-8 p-6">
                    {/* Color Palette */}
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium flex items-center">
                          <Palette className="mr-2 h-4 w-4 text-pixar-blue" />
                          Color Palette
                        </Label>
                        
                        <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                          Selected: {colorPalettes.find(p => p.id === colorPalette)?.name || 'Auto'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {colorPalettes.map((palette) => (
                          <div 
                            key={palette.id}
                            onClick={() => setColorPalette(palette.id)}
                            className={`cursor-pointer rounded-lg p-3 transition-all hover:scale-105 
                                ${colorPalette === palette.id 
                                  ? 'ring-2 ring-pixar-blue bg-pixar-blue/5' 
                                  : 'border border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="flex h-6 rounded-md overflow-hidden mb-2 shadow-sm">
                              {palette.colors.map((color, index) => (
                                <div 
                                  key={index}
                                  style={{ 
                                    backgroundColor: color,
                                    width: `${100 / palette.colors.length}%` 
                                  }}
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{palette.name}</p>
                              <RadioGroupItem 
                                value={palette.id} 
                                id={`palette-${palette.id}`}
                                className="h-3.5 w-3.5 text-pixar-blue"
                              />
                            </div>
                            {palette.id === 'auto' && (
                              <p className="text-xs text-muted-foreground mt-1">
                                AI-selected based on story emotion
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    {/* Aspect Ratio / Format */}
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium flex items-center">
                          <VideoIcon className="mr-2 h-4 w-4 text-pixar-orange" />
                          Output Format
                        </Label>
                        
                        <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                          {aspectRatio === '16:9' ? 'Landscape' : 'Portrait'} ({aspectRatio})
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-center gap-x-12 pt-2">
                        <div className="flex flex-col items-center space-y-3">
                          <div 
                            className={`relative cursor-pointer transition-all 
                              ${aspectRatio === '16:9' ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                            onClick={() => setAspectRatio('16:9')}
                          >
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center w-40 border-2 
                              border-gray-200 shadow-md">
                              <VideoIcon className="h-8 w-8 text-pixar-blue opacity-50" />
                            </div>
                            {aspectRatio === '16:9' && (
                              <div className="absolute -top-2 -right-2 bg-pixar-blue text-white rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="ratio-landscape"
                              checked={aspectRatio === '16:9'}
                              onChange={() => setAspectRatio('16:9')}
                              className="sr-only"
                            />
                            <Label htmlFor="ratio-landscape" className="font-medium cursor-pointer">
                              Landscape (16:9)
                              <p className="text-xs text-muted-foreground">Best for YouTube, TV</p>
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-3">
                          <div 
                            className={`relative cursor-pointer transition-all 
                              ${aspectRatio === '9:16' ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                            onClick={() => setAspectRatio('9:16')}
                          >
                            <div className="w-[90px] aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center border-2 
                              border-gray-200 shadow-md">
                              <Smartphone className="h-7 w-7 text-pixar-purple opacity-50" />
                            </div>
                            {aspectRatio === '9:16' && (
                              <div className="absolute -top-2 -right-2 bg-pixar-blue text-white rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="ratio-portrait" 
                              checked={aspectRatio === '9:16'}
                              onChange={() => setAspectRatio('9:16')}
                              className="sr-only"
                            />
                            <Label htmlFor="ratio-portrait" className="font-medium cursor-pointer">
                              Portrait (9:16)
                              <p className="text-xs text-muted-foreground">Best for mobile, TikTok</p>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Animation Preview Card */}
                <Card className="overflow-hidden border-pixar-blue/10 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent pb-3 pt-6">
                    <CardTitle className="flex items-center text-xl">
                      <Film className="mr-3 h-5 w-5 text-pixar-blue" />
                      Animation Preview
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      See how your animation might appear with selected settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div 
                      className={`
                        ${aspectRatio === '16:9' ? 'aspect-video w-full' : 'aspect-[9/16] w-2/3'}
                        bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md overflow-hidden flex items-center justify-center mb-6 border border-gray-200
                      `}
                    >
                      <div className="text-center p-6">
                        <Film className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 font-medium">Preview will be generated soon</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Your animation will use the {colorPalettes.find(p => p.id === colorPalette)?.name || 'Auto'} color palette
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Scene Previews</h4>
                        <span className="text-xs text-muted-foreground">{scenes.length} scenes total</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 w-full">
                        {scenes.slice(0, 3).map((scene, index) => (
                          <div 
                            key={index} 
                            className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden relative border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedScene(scene.id)}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                              <p className="text-xs font-medium bg-white/70 backdrop-blur-sm py-1 px-2 rounded-full shadow-sm">Scene {index + 1}</p>
                              <p className="text-[10px] text-center text-gray-500 mt-1 line-clamp-2 hidden sm:block">
                                {scene.text.substring(0, 30)}...
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t pt-5 bg-gray-50">
                    <Button 
                      variant="outline" 
                      className="border-gray-300 hover:bg-gray-100 transition-colors w-full flex items-center justify-center" 
                      onClick={() => setShowPreview(true)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Open Full Preview
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
            
            {/* Generate Button */}
            <motion.div 
              className="flex justify-end gap-4 mt-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="outline"
                onClick={() => setActiveTab('story')}
                className="border border-pixar-blue/20 text-pixar-blue hover:bg-pixar-blue/5 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Story
              </Button>
              <Button 
                onClick={handleGenerate}
                className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:from-pixar-darkblue hover:to-pixar-purple pixar-button rounded-xl py-6 px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Generate Animation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-pixar-blue/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Animation Preview</DialogTitle>
            <DialogDescription>
              This is a preview of how your animation might look
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className={`${
              aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-xs mx-auto'
            } bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden flex items-center justify-center border border-gray-200`}
          >
            <div className="text-center">
              <Film className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Preview will be available after generation</p>
            </div>
          </div>
          
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)} className="border-gray-300">
              Close
            </Button>
            <Button 
              onClick={handleGenerate} 
              className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:from-pixar-darkblue hover:to-pixar-purple"
            >
              Generate Animation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Save Story Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-pixar-blue/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Save Your Story</DialogTitle>
            <DialogDescription>
              Save your story to access it later from your library
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="save-name" className="text-gray-700 mb-2 block font-medium">Story Name</Label>
            <Input 
              id="save-name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter a name for your story"
              className="border-pixar-blue/20 focus-visible:ring-pixar-blue/40 focus:border-pixar-blue shadow-sm"
            />
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/50">
            <p className="flex items-start text-sm text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pixar-blue mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Your story will be saved locally in your browser. You can access all your saved stories from the Library section.
            </p>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSave}
              className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:from-pixar-darkblue hover:to-pixar-purple"
            >
              Save Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {hasSavedState && (
        <Card className="mb-4 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-600">Resume Saved Story</CardTitle>
            <CardDescription>
              You have a saved version of this story. Would you like to resume from where you left off?
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleResume}
              disabled={isSaving}
              className="border-blue-200 hover:bg-blue-50"
            >
              Resume Saved Story
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isSaving}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Start Fresh
            </Button>
          </CardFooter>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default StoryReview;
