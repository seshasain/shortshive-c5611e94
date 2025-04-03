import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  VideoIcon, Clock, Languages, Music, Mic, Heart, 
  ArrowRight, Sparkles, Volume2, Anchor, Smile, Frown,
  FlameIcon, Zap, DumbbellIcon, Eye, Star, HeartHandshake, Coffee
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { generateStoryFromPrompt } from '@/services/animationService';

const emotions = [
  { name: 'Happiness', color: '#FFD166' },
  { name: 'Sadness', color: '#118AB2' },
  { name: 'Anger', color: '#EF476F' },
  { name: 'Fear', color: '#6B6B6B' },
  { name: 'Surprise', color: '#06D6A0' },
  { name: 'Love', color: '#E26CA5' },
  { name: 'Wonder', color: '#3A86FF' },
  { name: 'Calm', color: '#8A6552' }
];

const storyPromptExamples = [
  "A curious fish explores the ocean beyond his coral reef",
  "A toy spaceship comes to life at night",
  "Two siblings discover a magical door in their backyard",
  "A shy robot learns to make friends at school"
];

const StoryBuilder = () => {
  const navigate = useNavigate();
  const [storyInput, setStoryInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [language, setLanguage] = useState('English');
  const [voiceStyle, setVoiceStyle] = useState('Friendly');
  const [duration, setDuration] = useState('60');
  const [currentExample, setCurrentExample] = useState(0);
  const [addHook, setAddHook] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      let finalStoryContent = storyInput;
      
      if (promptInput) {
        toast.info("Generating your story...");
        const settings = {
          emotion: selectedEmotion,
          language,
          voiceStyle,
          duration: parseInt(duration),
          addHook
        };
        
        finalStoryContent = await generateStoryFromPrompt(promptInput, settings);
      }
      
      const storyData = {
        storyType: promptInput ? 'ai-prompt' : 'manual',
        storyContent: finalStoryContent,
        settings: {
          emotion: selectedEmotion,
          language,
          voiceStyle,
          duration: parseInt(duration),
          addHook
        },
        timestamp: new Date().toISOString()
      };
      
      console.log('Data being sent to Story Refinement:');
      console.log(JSON.stringify(storyData, null, 2));
      
      navigate('/review-story', { state: { storyData } });
    } catch (error) {
      toast.error('Error preparing your story. Please try again.');
      console.error('Error in story generation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % storyPromptExamples.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient">Create Your Animation</h1>
            <p className="text-muted-foreground">Craft your story and customize animation settings</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-6 overflow-hidden border-pixar-blue/10">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/5 to-transparent">
                <CardTitle className="flex items-center">
                  <VideoIcon className="mr-2 h-5 w-5 text-pixar-blue" />
                  Story Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full mb-6">
                    <TabsTrigger value="generate" className="data-[state=active]:bg-pixar-blue data-[state=active]:text-white rounded-md">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Prompt
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="data-[state=active]:bg-pixar-blue data-[state=active]:text-white rounded-md">
                      <Heart className="mr-2 h-4 w-4" />
                      Write Manually
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="generate" className="space-y-4 mt-2">
                    <div className="bg-pixar-blue/5 rounded-lg p-4 border border-pixar-blue/10">
                      <h3 className="font-medium text-pixar-blue flex items-center mb-2">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Story Prompt
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter a simple prompt about your story idea. You'll be able to generate the full story in the next step.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="story-prompt" className="text-sm font-medium">Your Story Idea</Label>
                          <div className="mt-1.5">
                            <Input
                              id="story-prompt"
                              placeholder={storyPromptExamples[currentExample]}
                              value={promptInput}
                              onChange={(e) => setPromptInput(e.target.value)}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            Example: "A shy robot learns to make friends"
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 px-1">
                      <p className="text-sm text-muted-foreground">
                        <span className="inline-block bg-pixar-blue/10 px-2 py-1 rounded text-pixar-blue mr-1">Tip:</span>
                        In the next step, our AI will transform your prompt into a complete story that you can review and edit before animation.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manual" className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="manual-story" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-pixar-red" />
                        Your Story
                      </Label>
                      <Textarea 
                        id="manual-story" 
                        placeholder="Once upon a time..." 
                        className="min-h-[250px] mt-1.5"
                        value={storyInput}
                        onChange={(e) => setStoryInput(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-muted-foreground">
                          Write your story in as much detail as possible for the best animation results.
                        </p>
                        <p className="text-xs text-pixar-blue">
                          {storyInput.length} characters
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="block mb-2 flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-pixar-blue" />
                    Primary Emotion
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        type="button"
                        onClick={() => setSelectedEmotion(emotion.name)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedEmotion === emotion.name
                            ? 'bg-gray-900 text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: emotion.color }}
                          />
                          {emotion.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center">
                      <Anchor className="mr-2 h-4 w-4 text-muted-foreground" />
                      Add Attention Hook
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Start with a short attention-grabbing intro
                    </p>
                  </div>
                  <Switch
                    checked={addHook}
                    onCheckedChange={setAddHook}
                    aria-label="Add hook to video"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language" className="flex items-center">
                    <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="voice" className="flex items-center">
                    <Mic className="mr-2 h-4 w-4 text-muted-foreground" />
                    Voice Style
                  </Label>
                  <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select voice style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Energetic">Energetic</SelectItem>
                      <SelectItem value="Calm">Calm</SelectItem>
                      <SelectItem value="Dramatic">Dramatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Duration: {duration} seconds
                  </Label>
                  <div className="pt-2">
                    <RadioGroup value={duration} onValueChange={setDuration} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="duration-30" />
                        <Label htmlFor="duration-30">30s</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60" id="duration-60" />
                        <Label htmlFor="duration-60">1m</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="120" id="duration-120" />
                        <Label htmlFor="duration-120">2m</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6 border-pixar-blue/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-pixar-blue" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="text-muted-foreground">Story Type:</div>
                    <div className="font-medium">
                      {promptInput ? 'AI-Assisted' : storyInput ? 'Manual' : 'Not started'}
                    </div>
                    
                    <div className="text-muted-foreground">Story Length:</div>
                    <div className="font-medium">
                      {promptInput 
                        ? `${promptInput.length} chars (prompt)`
                        : storyInput 
                          ? `${storyInput.length} chars` 
                          : 'No content yet'}
                    </div>
                    
                    <div className="text-muted-foreground">Primary Emotion:</div>
                    <div className="font-medium">
                      {selectedEmotion ? selectedEmotion : 'Not selected'}
                    </div>
                    
                    <div className="text-muted-foreground">Language:</div>
                    <div className="font-medium">{language}</div>
                    
                    <div className="text-muted-foreground">Voice Style:</div>
                    <div className="font-medium">{voiceStyle}</div>
                    
                    <div className="text-muted-foreground">Duration:</div>
                    <div className="font-medium">{duration} seconds</div>
                    
                    <div className="text-muted-foreground">Add Hook:</div>
                    <div className="font-medium">{addHook ? 'Yes' : 'No'}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md mt-4 border border-gray-200">
                    <div className="text-muted-foreground mb-1 text-xs">Next Step Preview:</div>
                    <div className="text-xs">
                      {promptInput 
                        ? `Your prompt "${promptInput.substring(0, 40)}${promptInput.length > 40 ? '...' : ''}" will be used to generate a full story.`
                        : storyInput
                          ? `Your story (${storyInput.length} characters) will be divided into scenes for animation.`
                          : 'Please enter a story prompt or write a story manually to continue.'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={handleContinue} 
                disabled={(!promptInput && !storyInput) || isLoading} 
                className="w-full bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
              >
                {isLoading ? (
                  <>
                    <span className="animate-pulse">Generating...</span>
                  </>
                ) : (
                  <>
                    Continue to Story Refinement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {!promptInput && !storyInput && (
                <p className="text-center text-red-500 text-xs mt-2">
                  Please enter a story prompt or write a story manually to continue
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoryBuilder;
