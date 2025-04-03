
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { refineStory } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Play, ArrowLeft, ArrowRight, Check, Wand2, Film, Smartphone, Palette, VideoIcon, Settings, Sparkles, Save, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import SceneCard from '@/components/dashboard/SceneCard';

const mockScenes = [
  {
    id: '1',
    text: "Once upon a time in a colorful underwater world, there lived a curious little fish named Finn.",
    image: "https://source.unsplash.com/random/500x400?underwater=1"
  },
  {
    id: '2',
    text: "Unlike other fish who were content to swim in the same coral reef, Finn dreamed of exploring the vast ocean beyond.",
    image: "https://source.unsplash.com/random/500x400?reef=1"
  },
  {
    id: '3',
    text: "One day, a strong current swept Finn far from home into an unfamiliar part of the ocean.",
    image: "https://source.unsplash.com/random/500x400?ocean=1"
  }
];

const colorPalettes = [
  { id: 'auto', name: 'Auto', colors: ['#55A4F3', '#60C8DC', '#8BE0CB', '#ACECBE', '#F2F7C4'] },
  { id: 'vibrant', name: 'Vibrant', colors: ['#FF5F6D', '#FFC371', '#3CAEA3', '#F8B195', '#6639A6'] },
  { id: 'pastel', name: 'Pastel', colors: ['#F9DFDC', '#E3BAC6', '#BCABAE', '#8896AB', '#5B5F97'] },
  { id: 'retro', name: 'Retro', colors: ['#2B303A', '#D64933', '#EEE5E9', '#7D8491', '#92DCE5'] },
  { id: 'fantasy', name: 'Fantasy', colors: ['#7400B8', '#5E60CE', '#4EA8DE', '#56CFE1', '#80FFDB'] },
  { id: 'nature', name: 'Nature', colors: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2', '#D8F3DC'] },
  { id: 'dream', name: 'Dream', colors: ['#8E82FE', '#B693FE', '#E2B4FF', '#FFC6FF', '#FDFFB6'] }
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

interface SavedStory {
  id: string;
  title: string;
  logline: string;
  scenes: any[];
  colorPalette: string;
  aspectRatio: string;
  createdAt: string;
}

const StoryReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Default values for when there's no state
  const [storyText, setStoryText] = useState("Once upon a time in a colorful underwater world, there lived a curious little fish named Finn. Unlike other fish who were content to swim in the same coral reef, Finn dreamed of exploring the vast ocean beyond. One day, a strong current swept Finn far from home into an unfamiliar part of the ocean...");
  const [storyType, setStoryType] = useState<'ai-prompt' | 'manual'>('manual');
  const [promptText, setPromptText] = useState("");
  const [scenes, setScenes] = useState(mockScenes);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [colorPalette, setColorPalette] = useState('auto');
  const [activeTab, setActiveTab] = useState('story');
  const [isLoading, setIsLoading] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saving, setSaving] = useState(false);
  
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
      setStoryTitle(state.generatedStory.title || 'My Story');
      setSaveTitle(state.generatedStory.title || 'My Story');
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
              setStoryTitle(response.data.title || 'My Story');
              setSaveTitle(response.data.title || 'My Story');
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
  
  const handleBack = () => {
    navigate('/build-story');
  };
  
  const handleGenerate = () => {
    // Prepare the final data for animation generation
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
    
    // Log the complete data being sent for animation generation
    console.log('Sending animation data to generation service:');
    console.log(JSON.stringify(animationData, null, 2));
    
    // In a real implementation, you might make an API call here
    // For now, just navigate to the next page
    navigate('/generating');
  };
  
  const handleEditScene = (id: string, newText: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, text: newText } : scene
    ));
  };

  const handleSaveStory = () => {
    if (!saveTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your story",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    // Create story object to save
    const storyToSave: SavedStory = {
      id: Date.now().toString(),
      title: saveTitle,
      logline: storyText,
      scenes: scenes,
      colorPalette: colorPalette,
      aspectRatio: aspectRatio,
      createdAt: new Date().toISOString()
    };

    // Simulate saving to local storage
    setTimeout(() => {
      // Get existing stories or initialize empty array
      const existingStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
      
      // Add new story
      const updatedStories = [...existingStories, storyToSave];
      
      // Save back to local storage
      localStorage.setItem('savedStories', JSON.stringify(updatedStories));
      
      setSaving(false);
      setShowSaveDialog(false);
      
      toast({
        title: "Story Saved!",
        description: `"${saveTitle}" has been saved to your collection`,
        variant: "default"
      });
    }, 800);
  };
  
  return (
    <DashboardLayout>
      <div className="container-custom py-10">
        {/* Header Section with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-10 px-6 py-8 rounded-2xl bg-gradient-to-r from-pixar-blue/10 to-pixar-teal/5 overflow-hidden border border-pixar-blue/10"
        >
          {/* Decorative Elements */}
          <motion.div 
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-pixar-orange/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-pixar-purple/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient">
                {storyTitle ? `"${storyTitle}"` : 'Review Your Story'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Refine your narrative and customize the visual style for your animation
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center bg-white/70 hover:bg-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="flex items-center bg-white/70 hover:bg-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center bg-pixar-purple text-white hover:bg-pixar-purple/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Story
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Loading Animation */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl p-10 max-w-md w-full shadow-2xl border border-pixar-blue/20">
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-t-4 border-pixar-blue"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <Sparkles className="absolute inset-0 m-auto h-12 w-12 text-pixar-blue" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-pixar-blue">Crafting your story...</h3>
                <p className="text-muted-foreground text-center">
                  Our AI is creating a magical story just for you. This might take a moment as we craft characters, scenes, and dialogue.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Main Tabs Navigation with enhanced styling */}
        <Tabs 
          defaultValue="story" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-8 space-y-8"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 rounded-xl bg-muted/50">
            <TabsTrigger 
              value="story" 
              className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Edit className="h-5 w-5 text-pixar-blue" />
              Story Content
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Settings className="h-5 w-5 text-pixar-orange" />
              Visual Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Story Content Tab */}
          <TabsContent value="story" className="space-y-10">
            {/* Info Banner */}
            {storyType === 'ai-prompt' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-pixar-blue/10 to-pixar-purple/5 backdrop-blur-sm rounded-xl p-6 flex items-start gap-5 border border-pixar-blue/20"
              >
                <Sparkles className="h-7 w-7 text-pixar-purple flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg text-pixar-purple mb-1">AI Story Generation</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    We've used your prompt: <span className="font-medium text-black">{promptText}</span> to generate a complete story. 
                    Feel free to edit this story and its scenes before proceeding to animation. 
                    Our AI has also suggested a {colorPalette} color palette based on your selected emotion.
                  </p>
                </div>
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
                <Card className="h-full rounded-xl overflow-hidden border-pixar-blue/10 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-pixar-blue/5 to-transparent border-b">
                    <CardTitle className="flex items-center text-xl">
                      <Edit className="mr-2 h-5 w-5 text-pixar-blue" />
                      Complete Story
                    </CardTitle>
                    <CardDescription>
                      Edit your full story text
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Textarea 
                      value={storyText} 
                      onChange={(e) => setStoryText(e.target.value)}
                      className="min-h-[400px] resize-none border-pixar-blue/10 focus-visible:ring-pixar-blue/30"
                      placeholder="Once upon a time..."
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-3 border-t pt-4 bg-gradient-to-r from-transparent to-pixar-blue/5">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-pixar-purple/20 hover:bg-pixar-purple/5 text-pixar-purple"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Improve Text
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-pixar-blue text-white hover:bg-pixar-darkblue"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save
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
                <Card className="h-full rounded-xl overflow-hidden border-pixar-blue/10 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-pixar-teal/5 to-transparent border-b">
                    <CardTitle className="flex items-center text-xl">
                      <Film className="mr-2 h-5 w-5 text-pixar-teal" />
                      Scene Breakdown
                    </CardTitle>
                    <CardDescription>
                      Review and edit individual scenes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
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
                  <CardFooter className="flex justify-between items-center border-t pt-4 bg-gradient-to-r from-transparent to-pixar-teal/5">
                    <Button 
                      variant="outline"
                      className="border-pixar-teal/20 hover:bg-pixar-teal/5 text-pixar-teal"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Regenerate Scenes
                    </Button>
                    <div className="text-sm text-muted-foreground font-medium">
                      {scenes.length} scenes total
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab('settings')}
                className="gap-2 bg-gradient-to-r from-pixar-blue to-pixar-teal text-white rounded-xl px-8 py-6 h-auto font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Continue to Visual Settings
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </TabsContent>
          
          {/* Visual Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                {/* Animation Settings Card */}
                <Card className="rounded-xl overflow-hidden border-pixar-blue/10 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-pixar-purple/5 to-transparent border-b">
                    <CardTitle className="flex items-center text-xl">
                      <Sparkles className="mr-2 h-5 w-5 text-pixar-purple" />
                      Visual Style
                    </CardTitle>
                    <CardDescription>
                      Customize the visual aesthetic of your animation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-10 pt-6">
                    {/* Color Palette */}
                    <div>
                      <Label className="text-base mb-4 flex items-center font-medium">
                        <Palette className="mr-2 h-4 w-4 text-pixar-purple" />
                        Color Palette
                      </Label>
                      <RadioGroup value={colorPalette} onValueChange={setColorPalette}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {colorPalettes.map((palette) => (
                            <div 
                              key={palette.id}
                              onClick={() => setColorPalette(palette.id)}
                              className={`cursor-pointer rounded-xl p-4 transition-all hover:scale-105 
                                      ${colorPalette === palette.id 
                                        ? 'ring-2 ring-pixar-blue bg-pixar-blue/5' 
                                        : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                            >
                              <div className="flex h-6 rounded-md overflow-hidden mb-3 shadow-sm">
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
                                  className="h-3.5 w-3.5"
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
                      </RadioGroup>
                    </div>
                    
                    {/* Aspect Ratio */}
                    <div>
                      <Label className="text-base mb-4 flex items-center font-medium">
                        <VideoIcon className="mr-2 h-4 w-4 text-pixar-purple" />
                        Output Format
                      </Label>
                      <RadioGroup value={aspectRatio} onValueChange={setAspectRatio}>
                        <div className="grid grid-cols-2 gap-6">
                          <div 
                            className={`relative cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md
                              ${aspectRatio === '16:9' 
                                ? 'border-pixar-blue bg-pixar-blue/5 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setAspectRatio('16:9')}
                          >
                            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center shadow-inner">
                              <VideoIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Landscape</p>
                                <p className="text-xs text-muted-foreground">16:9 ratio</p>
                              </div>
                              <RadioGroupItem 
                                value="16:9" 
                                id="ratio-landscape"
                                className="h-3.5 w-3.5"
                              />
                            </div>
                          </div>
                          
                          <div 
                            className={`relative cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md
                              ${aspectRatio === '9:16' 
                                ? 'border-pixar-blue bg-pixar-blue/5 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setAspectRatio('9:16')}
                          >
                            <div className="relative mx-auto w-1/2">
                              <div className="aspect-[9/16] bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center shadow-inner">
                                <Smartphone className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Portrait</p>
                                <p className="text-xs text-muted-foreground">9:16 ratio</p>
                              </div>
                              <RadioGroupItem 
                                value="9:16" 
                                id="ratio-portrait"
                                className="h-3.5 w-3.5"
                              />
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Animation Preview Card */}
                <Card className="rounded-xl overflow-hidden border-pixar-blue/10 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-pixar-red/5 to-transparent border-b">
                    <CardTitle className="flex items-center text-xl">
                      <Film className="mr-2 h-5 w-5 text-pixar-red" />
                      Animation Preview
                    </CardTitle>
                    <CardDescription>
                      See how your animation might appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <div 
                      className={`${
                        aspectRatio === '16:9' ? 'aspect-video w-full' : 'aspect-[9/16] w-2/3'
                      } bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md overflow-hidden flex items-center justify-center mb-6`}
                    >
                      <div className="text-center p-6">
                        <div className="bg-white/70 p-4 rounded-xl shadow-sm">
                          <Film className="mx-auto h-12 w-12 text-pixar-blue mb-3" />
                          <p className="text-gray-700 font-medium">Preview will be generated soon</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Your animation will use the {colorPalette} color palette
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 w-full mt-6">
                      {scenes.slice(0, 3).map((scene, index) => (
                        <div key={index} className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative shadow-sm">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs bg-white/70 px-3 py-1 rounded-full shadow-sm font-medium text-gray-700">Scene {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 bg-gradient-to-r from-transparent to-pixar-red/5">
                    <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)}>
                      <Play className="mr-2 h-4 w-4" />
                      Open Full Preview
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
            
            {/* Generate Button */}
            <motion.div 
              className="flex justify-end gap-4 mt-12"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="outline"
                onClick={() => setActiveTab('story')}
                className="rounded-xl px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Story
              </Button>
              <Button 
                onClick={handleGenerate}
                className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white hover:opacity-90 pixar-button rounded-xl px-8 py-6 h-auto font-medium shadow-lg"
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
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-pixar-blue">Animation Preview</DialogTitle>
            <DialogDescription className="text-base">
              This is a preview of how your animation might look
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className={`${
              aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-xs mx-auto'
            } bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center shadow-md`}
          >
            <div className="text-center p-8 bg-white/80 rounded-xl shadow-sm backdrop-blur-sm">
              <Film className="mx-auto h-14 w-14 text-pixar-blue mb-3" />
              <p className="text-gray-700 font-medium text-lg">Preview will be available after generation</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your animation will use the {colorPalette} color palette in {aspectRatio} format
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button 
              onClick={handleGenerate}
              className="bg-pixar-blue text-white hover:bg-pixar-darkblue"
            >
              Generate Animation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Story Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-pixar-purple">Save Your Story</DialogTitle>
            <DialogDescription className="text-base">
              Give your story a title to save it for later
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="story-title" className="font-medium">Story Title</Label>
              <Input 
                id="story-title" 
                value={saveTitle} 
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Enter a title for your story" 
                className="border-pixar-purple/20 focus-visible:ring-pixar-purple/30"
              />
            </div>
            
            <div className="bg-pixar-purple/5 rounded-lg p-4 border border-pixar-purple/10">
              <h4 className="font-medium text-pixar-purple mb-1 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                What will be saved:
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Complete story text</li>
                <li>• {scenes.length} individual scenes</li>
                <li>• Visual settings ({colorPalette} palette, {aspectRatio} format)</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveStory}
              className="bg-pixar-purple text-white hover:bg-pixar-purple/90"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Story'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoryReview;
