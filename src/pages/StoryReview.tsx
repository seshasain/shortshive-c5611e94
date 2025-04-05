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
import { Edit, Play, ArrowLeft, ArrowRight, Check, Wand2, Film, Smartphone, Palette, VideoIcon, Settings, Sparkles, Monitor, Gamepad2, Pencil, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import SceneCard from '@/components/dashboard/SceneCard';
import StoryLoadingAnimation from '@/components/StoryLoadingAnimation';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const mockScenes = [
 
];

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
    'Happy': 'vibrant',
    'Sad': 'pastel',
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
        {/* Animated background elements - match StoryBuilder */}
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
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Story Header Section */}
          {storyType === 'ai-prompt' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-pixar-blue/5 via-pixar-purple/5 to-transparent rounded-2xl border border-pixar-blue/10"
            >
              <div className="flex-shrink-0 p-3 bg-white/50 rounded-xl">
                <Sparkles className="h-6 w-6 text-pixar-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center text-lg">
                  AI-Generated Story
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Based on prompt: <span className="font-medium text-gray-800 bg-white/50 px-2 py-0.5 rounded-md">{promptText}</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Story Content */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              {/* Complete Story Section */}
              <Card className="border-pixar-blue/10 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pixar-blue/5 rounded-lg">
                        <Edit className="h-5 w-5 text-pixar-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Story Content</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {storyText.length > 0 ? `${storyText.split(' ').length} words` : 'Edit your narrative'}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-pixar-purple hover:text-pixar-purple/80">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Enhance
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className={`relative transition-all duration-300 ease-in-out ${
                    storyText.length > 1000 ? 'min-h-[300px] max-h-[600px]' :
                    storyText.length > 500 ? 'min-h-[250px] max-h-[500px]' :
                    'min-h-[200px] max-h-[400px]'
                  }`}>
                    <Textarea 
                      value={storyText} 
                      onChange={(e) => setStoryText(e.target.value)}
                      className="absolute inset-0 w-full h-full resize-none border-gray-200 focus:border-pixar-blue/20 bg-white/70 text-gray-700 text-base leading-relaxed overflow-auto scrollbar-thin scrollbar-thumb-pixar-blue/20 scrollbar-track-transparent hover:scrollbar-thumb-pixar-blue/30"
                      placeholder="Enter your story content here..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Scene Breakdown */}
            <div className="col-span-12 lg:col-span-7">
              <Card className="border-pixar-blue/10 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pixar-blue/5 rounded-lg">
                        <Film className="h-5 w-5 text-pixar-blue" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-semibold">Scene Breakdown</CardTitle>
                          <Badge variant="secondary" className="bg-gray-100/80 text-gray-600 font-medium">
                            {scenes.length} scenes
                          </Badge>
                        </div>
                        <CardDescription className="text-sm text-gray-500">Manage your animation scenes</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-pixar-purple hover:text-pixar-purple/80">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Visual Settings Section */}
                  <div className="mb-6 p-4 bg-gray-50/80 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-pixar-blue" />
                        <h3 className="text-sm font-medium text-gray-700">Visual Settings</h3>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Visual Style Selection */}
                      <div className="w-full md:w-2/3 space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <Palette className="h-4 w-4 text-pixar-blue" />
                          Choose Visual Style
                        </Label>
                        <Select value={colorPalette} onValueChange={setColorPalette}>
                          <SelectTrigger className="w-full bg-white border-pixar-blue/20 h-10">
                            <SelectValue>
                              {colorPalette === 'pixar' && (
                                <div className="flex items-center gap-2">
                                  <Film className="h-4 w-4 text-pixar-blue" />
                                  <span>3D Pixar / Disney Style</span>
                                </div>
                              )}
                              {colorPalette === 'cinematic' && (
                                <div className="flex items-center gap-2">
                                  <Gamepad2 className="h-4 w-4 text-purple-500" />
                                  <span>3D Cinematic</span>
                                </div>
                              )}
                              {colorPalette === 'anime' && (
                                <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-pink-500" />
                                  <span>Anime Style</span>
                                </div>
                              )}
                              {colorPalette === 'cartoon' && (
                                <div className="flex items-center gap-2">
                                  <Pencil className="h-4 w-4 text-orange-500" />
                                  <span>2D Cartoon Style</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pixar" className="py-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-md bg-pixar-blue/10">
                                    <Film className="h-4 w-4 text-pixar-blue" />
                                  </div>
                                  <span className="font-medium">3D Pixar / Disney Style</span>
                                </div>
                                <span className="text-xs text-gray-500 pl-9">Soft, colorful, expressive animation</span>
                              </div>
                            </SelectItem>

                            <SelectItem value="cinematic" className="py-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-md bg-purple-500/10">
                                    <Gamepad2 className="h-4 w-4 text-purple-500" />
                                  </div>
                                  <span className="font-medium">3D Cinematic</span>
                                </div>
                                <span className="text-xs text-gray-500 pl-9">Realistic or stylized game-like visuals</span>
                              </div>
                            </SelectItem>

                            <SelectItem value="anime" className="py-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-md bg-pink-500/10">
                                    <Sparkles className="h-4 w-4 text-pink-500" />
                                  </div>
                                  <span className="font-medium">Anime Style</span>
                                </div>
                                <span className="text-xs text-gray-500 pl-9">Modern anime look with high energy</span>
                              </div>
                            </SelectItem>

                            <SelectItem value="cartoon" className="py-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-md bg-orange-500/10">
                                    <Pencil className="h-4 w-4 text-orange-500" />
                                  </div>
                                  <span className="font-medium">2D Cartoon Style</span>
                                </div>
                                <span className="text-xs text-gray-500 pl-9">Simple, bold lines and fun style</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Video Format */}
                      <div className="w-full md:w-1/3 space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <VideoIcon className="h-4 w-4 text-pixar-orange" />
                          Video Format
                        </Label>
                        <div className="flex gap-2 h-10">
                          <div 
                            onClick={() => setAspectRatio('16:9')}
                            className={`flex-1 flex items-center justify-center gap-1.5 cursor-pointer rounded-md border transition-all
                                    ${aspectRatio === '16:9' 
                                      ? 'border-pixar-blue bg-pixar-blue/5' 
                                      : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <Monitor className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">16:9</span>
                          </div>
                          
                          <div 
                            onClick={() => setAspectRatio('9:16')}
                            className={`flex-1 flex items-center justify-center gap-1.5 cursor-pointer rounded-md border transition-all
                                    ${aspectRatio === '9:16'
                                      ? 'border-pixar-blue bg-pixar-blue/5'
                                      : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <Smartphone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">9:16</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scene Cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
              </Card>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
            <div className="container-custom py-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Story Builder
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveStory}
                    className="border-pixar-purple/20 text-pixar-purple hover:bg-pixar-purple/5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Progress
                  </Button>
                  <Button 
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90 shadow-md"
                  >
                    Generate Animation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-emerald-500" />
              <p className="font-medium">Story saved successfully!</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && <StoryLoadingAnimation />}
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
            } bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border border-gray-200`}
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
