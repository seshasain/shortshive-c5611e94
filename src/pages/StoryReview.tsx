import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { toast } from 'sonner';
import { 
  StoryData as ImportedStoryData,
  Scene,
  generateScenes,
  generateAnimation
} from '@/services/animationService';

type StoryData = ImportedStoryData;

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
  { id: 'nature', name: 'Nature', colors: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2', '#D8F3DC'] }
];

const StoryReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [storyText, setStoryText] = useState("Once upon a time in a colorful underwater world...");
  const [storyType, setStoryType] = useState<'ai-prompt' | 'manual'>('manual');
  const [promptText, setPromptText] = useState("");
  const [scenes, setScenes] = useState<Scene[]>(mockScenes);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [colorPalette, setColorPalette] = useState('auto');
  const [activeTab, setActiveTab] = useState('story');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const state = location.state as { storyData?: StoryData } | null;
    if (state && state.storyData) {
      console.log('Received data from StoryBuilder:', JSON.stringify(state.storyData, null, 2));
      
      const { storyType, storyContent, settings } = state.storyData;
      
      setStoryType(storyType);
      setStoryText(storyContent);
      
      if (storyType === 'ai-prompt') {
        setPromptText(state.storyData.storyContent);
      }
      
      handleGenerateScenes(storyContent);
      
      if (settings.emotion) {
        const emotionToColorMap: Record<string, string> = {
          'Happiness': 'vibrant',
          'Sadness': 'pastel',
          'Anger': 'retro',
          'Fear': 'fantasy',
          'Love': 'nature',
          // Default to auto for other emotions
        };
        
        const suggestedPalette = emotionToColorMap[settings.emotion] || 'auto';
        setColorPalette(suggestedPalette);
        console.log(`Set color palette to ${suggestedPalette} based on emotion: ${settings.emotion}`);
      }
    } else {
      console.log('No data received from StoryBuilder, using default values');
    }
  }, [location.state]);
  
  const handleGenerateScenes = async (story: string) => {
    try {
      const generatedScenes = await generateScenes(story, { colorPalette, aspectRatio });
      setScenes(generatedScenes);
    } catch (error) {
      console.error("Error generating scenes:", error);
    }
  };
  
  const handleBack = () => {
    navigate('/build-story');
  };
  
  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
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
      
      console.log('Sending animation data to generation service:');
      console.log(JSON.stringify(animationData, null, 2));
      
      await generateAnimation(scenes, { colorPalette, aspectRatio });
      
      navigate('/generating');
    } catch (error) {
      console.error("Error generating animation:", error);
      toast.error("Failed to generate animation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditScene = (id: string, newText: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, text: newText } : scene
    ));
  };
  
  return (
    <DashboardLayout>
      <div className="container-custom py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient">Review Your Story</h1>
            <p className="text-muted-foreground">Review, edit, and customize before generating your animation</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </motion.div>
        
        <Tabs defaultValue="story" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="story" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Story Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Visual Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="story" className="space-y-6">
            {storyType === 'ai-prompt' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-pixar-blue/10 border border-pixar-blue/20 rounded-lg p-4 flex items-start gap-4"
              >
                <Sparkles className="h-6 w-6 text-pixar-blue flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-pixar-blue">AI Story Generation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've used your prompt: <span className="font-medium text-black">{promptText}</span> to generate a complete story. 
                    You can edit this story and its scenes before proceeding to animation. 
                    Our AI has also suggested a {colorPalette} color palette based on your selected emotion.
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Edit className="mr-2 h-5 w-5 text-pixar-blue" />
                      Complete Story
                    </CardTitle>
                    <CardDescription>
                      Edit your full story text
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={storyText} 
                      onChange={(e) => setStoryText(e.target.value)}
                      className="min-h-[400px]"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                    <Button variant="outline" size="sm">
                      <Wand2 className="mr-2 h-4 w-4" />
                      Improve Text
                    </Button>
                    <Button size="sm" className="bg-pixar-blue text-white hover:bg-pixar-darkblue">
                      <Check className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Film className="mr-2 h-5 w-5 text-pixar-blue" />
                      Scene Breakdown
                    </CardTitle>
                    <CardDescription>
                      Review and edit individual scenes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <Button variant="outline">
                      <Wand2 className="mr-2 h-4 w-4" />
                      Regenerate Scenes
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {scenes.length} scenes total
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => setActiveTab('settings')}
                className="gap-2"
              >
                Continue to Visual Settings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-pixar-blue" />
                      Visual Style
                    </CardTitle>
                    <CardDescription>
                      Customize the visual aesthetic of your animation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <Label className="text-base mb-4 flex items-center">
                        <Palette className="mr-2 h-4 w-4 text-pixar-blue" />
                        Color Palette
                      </Label>
                      <RadioGroup value={colorPalette} onValueChange={setColorPalette}>
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
                    
                    <div>
                      <Label className="text-base mb-4 flex items-center">
                        <VideoIcon className="mr-2 h-4 w-4 text-pixar-blue" />
                        Output Format
                      </Label>
                      <RadioGroup value={aspectRatio} onValueChange={setAspectRatio}>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50
                              ${aspectRatio === '16:9' ? 'border-pixar-blue bg-pixar-blue/5' : 'border-gray-200'}`}
                            onClick={() => setAspectRatio('16:9')}
                          >
                            <div className="aspect-video bg-gray-100 rounded-md mb-3 overflow-hidden flex items-center justify-center">
                              <VideoIcon className="h-6 w-6 text-gray-400" />
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
                            className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50
                              ${aspectRatio === '9:16' ? 'border-pixar-blue bg-pixar-blue/5' : 'border-gray-200'}`}
                            onClick={() => setAspectRatio('9:16')}
                          >
                            <div className="relative mx-auto w-1/2">
                              <div className="aspect-[9/16] bg-gray-100 rounded-md mb-3 overflow-hidden flex items-center justify-center">
                                <Smartphone className="h-5 w-5 text-gray-400" />
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
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Film className="mr-2 h-5 w-5 text-pixar-blue" />
                      Animation Preview
                    </CardTitle>
                    <CardDescription>
                      See how your animation might appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    <div 
                      className={`${
                        aspectRatio === '16:9' ? 'aspect-video w-full' : 'aspect-[9/16] w-2/3'
                      } bg-gray-100 rounded-lg shadow-md overflow-hidden flex items-center justify-center mb-4`}
                    >
                      <div className="text-center p-6">
                        <Film className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 font-medium">Preview will be generated soon</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Your animation will use the {colorPalette} color palette
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 w-full mt-4">
                      {scenes.slice(0, 3).map((scene, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">Scene {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)}>
                      <Play className="mr-2 h-4 w-4" />
                      Open Full Preview
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-end gap-4 mt-8"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="outline"
                onClick={() => setActiveTab('story')}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Story
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    Generate Animation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Animation Preview</DialogTitle>
            <DialogDescription>
              This is a preview of how your animation might look
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className={`${
              aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-xs mx-auto'
            } bg-gray-100 rounded-md overflow-hidden flex items-center justify-center`}
          >
            <div className="text-center">
              <Film className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Preview will be available after generation</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={handleGenerate}>
              Generate Animation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoryReview;
