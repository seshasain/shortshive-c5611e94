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
import { supabase } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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
  const [storyId, setStoryId] = useState<string | undefined>(useParams().id);
  
  // Default values for when there's no state
  const [storyText, setStoryText] = useState("");
  const [storyType, setStoryType] = useState<'ai-prompt' | 'manual'>('manual');
  const [promptText, setPromptText] = useState("");
  const [scenes, setScenes] = useState<Scene[]>(mockScenes);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [colorPalette, setColorPalette] = useState('pixar');
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
        if (data.generation_state) {
          const savedData = data.generation_state;
          setStoryTitle(savedData.title || '');
          setStoryText(savedData.logline || '');
          
          // Convert the scenes from the saved format to our Scene interface
          if (savedData.scenes && Array.isArray(savedData.scenes)) {
            const mappedScenes = savedData.scenes.map((scene, index) => ({
              id: String(scene.sceneNumber || index + 1),
              text: scene.dialogueOrNarration || '',
              visualDescription: scene.visualDescription || '',
              image: `https://source.unsplash.com/random/500x400?story=${index + 1}`
            }));
            setScenes(mappedScenes);
          }
          
          // Set visual settings if available, otherwise use defaults
          if (savedData.settings) {
            // You could map from emotion to color palette here if needed
          }
          
          toast({
            title: 'Story loaded',
            description: 'Successfully loaded your saved story. You can now edit it and generate a video.',
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
  
  // Add a health check function to verify server connectivity
  const checkServerHealth = async (apiUrl: string) => {
    try {
      console.log('Testing server connectivity with health check...');
      const response = await fetch(`${apiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Server health check successful:', data);
        return true;
      } else {
        console.error('Server health check failed with status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Server health check failed with error:', error);
      return false;
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Generate a story ID if one doesn't exist
      const generatedStoryId = storyId || uuidv4();
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Only store in stories table
      console.log('Creating/updating story record in stories table');
      const { error: storyError } = await supabase
        .from('stories')
        .upsert({
          id: generatedStoryId,
          title: storyTitle || 'Untitled Story',
          description: storyText.substring(0, 200) + (storyText.length > 200 ? '...' : ''),
          user_id: user.id
        });
      
      if (storyError) {
        console.error('Error creating/updating story record:', storyError);
        throw storyError;
      }
      
      // Update the URL without causing a page reload if we just created a new story
      if (!storyId) {
        const newUrl = `/review-story/${generatedStoryId}`;
        window.history.replaceState({ id: generatedStoryId }, '', newUrl);
        console.log('Updated URL to:', newUrl);
      }
      
      // Prepare the animation data
      const animationData = {
        story_id: generatedStoryId,
        storyContent: storyText,
        scenes: scenes.map(scene => ({
          sceneNumber: parseInt(scene.id),
          dialogueOrNarration: scene.text,
          visualDescription: scene.visualDescription || `A scene showing: ${scene.text.substring(0, 100)}...`,
          durationEstimate: 10
        })),
        visualSettings: {
          colorPalette,
          aspectRatio
        },
        originalStoryType: storyType,
        originalPrompt: storyType === 'ai-prompt' ? promptText : null,
        timestamp: new Date().toISOString()
      };

      // Navigate to the animation progress page
      navigate('/generating', { 
        state: { 
          storyId: generatedStoryId,
          title: storyTitle || 'Untitled Story',
          generationStarted: new Date().toISOString(),
          images: [],
          status: 'processing',
          progress: 0
        } 
      });
      
      toast({
        title: 'Animation generation started',
        description: 'Your animation is being created. You can safely close this window and check back later.',
        variant: 'default',
      });

      // Send the request to the server API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const isServerHealthy = await checkServerHealth(API_URL);
      if (!isServerHealthy) {
        throw new Error('Server appears to be offline or unreachable. Please check your connection and try again.');
      }
      
      const response = await fetch(`${API_URL}/api/generate-animation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animationData),
      });
      
      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || 'Failed to generate animation');
      }

    } catch (error) {
      console.error('Error generating animation:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Could not generate the animation. Please try again.',
        variant: 'destructive',
      });
      if (storyId) {
        navigate(`/review-story/${storyId}`);
      } else {
        navigate('/review-story');
      }
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
    // Show the save dialog with appropriate name
    setSaveName(storyTitle || 'My Story');
    setSaveDialogOpen(true);
  };
  
  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      let storyIdToUse = storyId;
      
      // Create or update story in stories table
      if (!storyIdToUse) {
        const { data: newStory, error: storyError } = await supabase
          .from('stories')
          .insert({
            title: saveName,
            description: storyText.substring(0, 200) + (storyText.length > 200 ? '...' : ''),
            user_id: user.id
          })
          .select()
          .single();
        
        if (storyError) throw storyError;
        storyIdToUse = newStory.id;
      } else {
        const { error: updateError } = await supabase
          .from('stories')
          .update({
            title: saveName,
            description: storyText.substring(0, 200) + (storyText.length > 200 ? '...' : '')
          })
          .eq('id', storyIdToUse);
        
        if (updateError) throw updateError;
      }
      
      // Format scenes for saved_stories table
      const formattedScenes = scenes.map(scene => ({
        sceneNumber: parseInt(scene.id),
        durationEstimate: 10,
        visualDescription: scene.visualDescription || 'Visual description placeholder',
        dialogueOrNarration: scene.text
      }));

      // Save to saved_stories table
      const { error: savedStoryError } = await saveStory(
        storyIdToUse,
        {
          title: storyTitle || saveName,
          logline: storyText,
          settings: {
            emotion: "Neutral",
            language: "English",
            voiceStyle: "Conversational",
            duration: formattedScenes.length * 10,
            addHook: true
          },
          characters: [
            {
              name: "Main Character",
              description: "Character from the story"
            }
          ],
          scenes: formattedScenes
        },
        `Updated on ${new Date().toLocaleString()}`
      );
      
      if (savedStoryError) throw savedStoryError;
      
      // Close dialog and show success message
      setSaveDialogOpen(false);
      setSaveSuccess(true);
      
      // Update local state and URL if needed
      if (!storyId) {
        setStoryId(storyIdToUse);
        navigate(`/review-story/${storyIdToUse}`, { replace: true });
      }
      
      toast({
        title: storyId ? "Story updated successfully" : "Story saved successfully",
        description: storyId 
          ? "Your story has been updated with the latest changes." 
          : "Your story has been saved to your account.",
        variant: "default",
      });
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving story:', error);
      toast({
        title: "Failed to save story",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
      setStoryText(generationState.logline || '');
      
      // Convert the scenes from the saved format to our Scene interface
      if (generationState.scenes && Array.isArray(generationState.scenes)) {
        const mappedScenes = generationState.scenes.map((scene, index) => ({
          id: String(scene.sceneNumber || index + 1),
          text: scene.dialogueOrNarration || '',
          visualDescription: scene.visualDescription || '',
          image: `https://source.unsplash.com/random/500x400?story=${index + 1}`
        }));
        setScenes(mappedScenes);
      }

      toast({
        title: 'Story resumed',
        description: 'Successfully restored your saved story. You can now edit it and generate a video.',
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
                  {/* Scene Cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
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

                  {/* Visual Settings Section */}
                  <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-100">
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
                    {storyId ? 'Update Story' : 'Save Story'}
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
              <p className="font-medium">
                {storyId ? "Story updated successfully!" : "Story saved successfully!"}
              </p>
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
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{storyId ? 'Update Story' : 'Save New Story'}</DialogTitle>
            <DialogDescription>
              {storyId 
                ? 'Update your story with the latest changes.' 
                : 'Enter a name for your story to save it for later.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input 
                id="name" 
                placeholder="My Amazing Story" 
                value={saveName} 
                onChange={(e) => setSaveName(e.target.value)} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} disabled={isSaving || !saveName.trim()}>
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (storyId ? 'Update Story' : 'Save Story')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoryReview;
