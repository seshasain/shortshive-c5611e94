import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  VideoIcon, Clock, Languages, Music, Mic, Heart, 
  ArrowRight, Sparkles, Volume2, Anchor, Smile, Frown,
  FlameIcon, Zap, DumbbellIcon, Eye, Star, HeartHandshake, Coffee,
  Settings, Wand2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const emotions = [
  { name: 'Happy', color: '#FFD166', icon: <Smile className="h-3 w-3" /> },
  { name: 'Sad', color: '#118AB2', icon: <Frown className="h-3 w-3" /> },
  { name: 'Anger', color: '#EF476F', icon: <FlameIcon className="h-3 w-3" /> },
  { name: 'Fear', color: '#6B6B6B', icon: <Eye className="h-3 w-3" /> },
  { name: 'Surprise', color: '#06D6A0', icon: <Zap className="h-3 w-3" /> },
  { name: 'Love', color: '#E26CA5', icon: <Heart className="h-3 w-3" /> },
  { name: 'Wonder', color: '#3A86FF', icon: <Star className="h-3 w-3" /> },
  { name: 'Calm', color: '#8A6552', icon: <Coffee className="h-3 w-3" /> }
];

const storyPromptExamples = [
  "A curious fish explores the ocean beyond his coral reef",
  "A toy spaceship comes to life at night",
  "Two siblings discover a magical door in their backyard",
  "A shy robot learns to make friends at school"
];

// Add a throttle utility function at the top of the file after imports
const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
};

const StoryBuilder = React.memo(() => {
  const navigate = useNavigate();
  const [storyInput, setStoryInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [language, setLanguage] = useState('English');
  const [voiceStyle, setVoiceStyle] = useState('Friendly');
  const [duration, setDuration] = useState('60');
  const [currentExample, setCurrentExample] = useState(0);
  const [addHook, setAddHook] = useState(true);
  
  // Add a state to track if user is scrolling
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef(null);
  
  const handleContinue = useCallback(() => {
    // Prepare the data to be sent to the next view
    const storyData = {
      storyType: promptInput ? 'ai-prompt' : 'manual',
      storyContent: promptInput || storyInput,
      settings: {
        emotion: selectedEmotion,
        language,
        voiceStyle,
        duration: parseInt(duration),
        addHook
      },
      timestamp: new Date().toISOString()
    };
    
    // Log the data as formatted JSON
    console.log('Data being sent to Story Refinement:');
    console.log(JSON.stringify(storyData, null, 2));
    
    // Pass the data to the next view using React Router's state
    navigate('/review-story', { state: { storyData } });
  }, [promptInput, storyInput, selectedEmotion, language, voiceStyle, duration, addHook, navigate]);
  
  // Cycle through prompt examples for the placeholder
  // Only if user hasn't entered any text
  useEffect(() => {
    if (promptInput.length === 0) {
      const interval = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % storyPromptExamples.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [promptInput]);
  
  // Optimize emotion buttons to prevent unnecessary re-renders
  const emotionButtons = useMemo(() => (
    <div className="flex flex-wrap gap-2">
      {emotions.map((emotion) => (
        <button
          key={emotion.name}
          type="button"
          onClick={() => setSelectedEmotion(emotion.name)}
          className={`px-3 py-2 rounded-full text-sm ${
            selectedEmotion === emotion.name
              ? 'bg-gray-800 text-white font-medium shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: emotion.color }}
            />
            <span>{emotion.name}</span>
          </div>
        </button>
      ))}
    </div>
  ), [selectedEmotion, setSelectedEmotion]);
  
  // Enhance scroll optimization - pause animations during scroll
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!isScrolling) {
        setIsScrolling(true);
      }
      
      // Clear previous timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      
      // Set a timer to turn off isScrolling state after scrolling stops
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }, 50); // Reduced throttle time for more responsive handling

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set CSS optimizations for smoother scrolling
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'auto';
      // Add GPU acceleration for the entire page
      document.body.style.transform = 'translateZ(0)';
    }
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.transform = '';
      }
    };
  }, [isScrolling]);
  
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
          initial={{ opacity: 0, y: 20 }}
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
                <span className="text-sm font-medium text-gray-700">Create Your Story</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight">
              Story Builder
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Craft your story with our intuitive editor or AI-powered generator
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area - 8 columns */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card className="border-pixar-blue/10 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pixar-blue/5 rounded-lg">
                      <VideoIcon className="h-5 w-5 text-pixar-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Story Creation</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Choose your preferred method to create your story
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 rounded-lg h-11">
                    <TabsTrigger 
                      value="generate" 
                      className="rounded-md ring-offset-white transition-all data-[state=active]:bg-white data-[state=active]:text-pixar-blue data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">AI Generator</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manual" 
                      className="rounded-md ring-offset-white transition-all data-[state=active]:bg-white data-[state=active]:text-pixar-blue data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        <span className="font-medium">Write Manually</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="generate" className="mt-6 outline-none">
                    <div className="bg-gradient-to-br from-pixar-blue/5 to-pixar-purple/5 rounded-xl p-6 border border-pixar-blue/10 shadow-sm">
                      <h3 className="font-semibold text-pixar-blue flex items-center mb-3 text-lg">
                        <Sparkles className="h-5 w-5 mr-2" />
                        AI Story Generator
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Enter a simple prompt and let our AI create a complete story for you.
                      </p>

                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="story-prompt" className="text-sm font-medium mb-2 block">Your Story Idea</Label>
                          <Input
                            id="story-prompt"
                            value={promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            placeholder={storyPromptExamples[currentExample]}
                            className="border-pixar-blue/20 focus:border-pixar-blue transition-all duration-300 shadow-sm text-base"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Example: "{storyPromptExamples[currentExample]}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="flex items-start p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <Wand2 className="h-6 w-6 text-pixar-orange mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Our AI will transform your prompt into a complete story with scenes, characters, and dialogue.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="manual-story" className="flex items-center text-lg mb-2">
                        <Heart className="mr-2 h-5 w-5 text-pixar-red" />
                        Your Story
                      </Label>
                      <Textarea 
                        id="manual-story" 
                        placeholder="Once upon a time..." 
                        className="min-h-[300px] mt-1.5 border-pixar-blue/20 focus:border-pixar-blue shadow-sm text-base"
                        value={storyInput}
                        onChange={(e) => setStoryInput(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm text-muted-foreground">
                          Write your story in detail for the best animation results.
                        </p>
                        <Badge variant="secondary" className="bg-pixar-blue/10 text-pixar-blue">
                          {storyInput.length} characters
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <Button 
              onClick={handleContinue} 
              disabled={!promptInput && !storyInput}
              className="w-full bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Story Review
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Settings Panel - 4 columns */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="border-pixar-blue/10 bg-white/80 backdrop-blur-sm shadow-lg sticky top-24">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pixar-blue/5 rounded-lg">
                    <Settings className="h-5 w-5 text-pixar-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Story Settings</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Customize your story's characteristics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Emotion Selection */}
                <div>
                  <Label className="block mb-3 flex items-center font-medium">
                    <Heart className="mr-2 h-4 w-4 text-pixar-red" />
                    Primary Emotion
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        type="button"
                        onClick={() => setSelectedEmotion(emotion.name)}
                        className={`min-w-[80px] h-9 rounded-lg text-sm flex items-center justify-center transition-all duration-200 ${
                          selectedEmotion === emotion.name
                            ? 'bg-pixar-blue text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 px-2">
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: emotion.color }}
                          />
                          <span>{emotion.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hook Option */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pixar-blue/5 to-transparent border border-pixar-blue/10">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center font-medium">
                      <Anchor className="mr-2 h-4 w-4 text-pixar-blue" />
                      Attention Hook
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an engaging intro
                    </p>
                  </div>
                  <Switch
                    checked={addHook}
                    onCheckedChange={setAddHook}
                    className="data-[state=checked]:bg-pixar-blue"
                  />
                </div>

                {/* Language Selection */}
                <div>
                  <Label htmlFor="language" className="flex items-center font-medium mb-2">
                    <Languages className="mr-2 h-4 w-4 text-gray-500" />
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full bg-white border-pixar-blue/20">
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

                {/* Voice Style */}
                <div>
                  <Label htmlFor="voice" className="flex items-center font-medium mb-2">
                    <Mic className="mr-2 h-4 w-4 text-gray-500" />
                    Voice Style
                  </Label>
                  <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                    <SelectTrigger className="w-full bg-white border-pixar-blue/20">
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

                {/* Duration */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-pixar-orange/5 to-transparent border border-pixar-orange/10">
                  <Label className="flex items-center font-medium mb-3">
                    <Clock className="mr-2 h-4 w-4 text-pixar-orange" />
                    Duration
                  </Label>
                  <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-center p-2 rounded-lg bg-white border border-gray-200">
                      <RadioGroupItem value="30" id="duration-30" className="peer sr-only" />
                      <Label htmlFor="duration-30" className="text-sm font-medium cursor-pointer peer-data-[state=checked]:text-pixar-orange">
                        30s
                      </Label>
                    </div>
                    <div className="flex items-center justify-center p-2 rounded-lg bg-white border border-gray-200">
                      <RadioGroupItem value="60" id="duration-60" className="peer sr-only" />
                      <Label htmlFor="duration-60" className="text-sm font-medium cursor-pointer peer-data-[state=checked]:text-pixar-orange">
                        1m
                      </Label>
                    </div>
                    <div className="flex items-center justify-center p-2 rounded-lg bg-white border border-gray-200">
                      <RadioGroupItem value="120" id="duration-120" className="peer sr-only" />
                      <Label htmlFor="duration-120" className="text-sm font-medium cursor-pointer peer-data-[state=checked]:text-pixar-orange">
                        2m
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
});

StoryBuilder.displayName = "StoryBuilder";

export default StoryBuilder;
