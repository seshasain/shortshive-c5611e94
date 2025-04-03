
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

const emotions = [
  { name: 'Happiness', color: '#FFD166', icon: <Smile className="h-3 w-3" /> },
  { name: 'Sadness', color: '#118AB2', icon: <Frown className="h-3 w-3" /> },
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
  
  const handleContinue = () => {
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
  };
  
  // Cycle through prompt examples for the placeholder
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % storyPromptExamples.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
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
                <span className="text-sm font-medium text-gray-700">Create Animations in Minutes</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 pixar-text-gradient tracking-tight">Create Your Animation</h1>
            <p className="text-lg text-muted-foreground max-w-xl">Craft your story and customize animation settings with our intuitive editor</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Story Input Section - 3 columns */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="mb-6 overflow-hidden border-pixar-blue/10 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent pb-4 pt-6">
                <CardTitle className="flex items-center text-2xl">
                  <VideoIcon className="mr-3 h-6 w-6 text-pixar-blue" />
                  Story Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full mb-8 p-1 bg-gray-100/80 rounded-xl">
                    <TabsTrigger value="generate" className="data-[state=active]:bg-pixar-blue data-[state=active]:text-white rounded-lg py-3 transition-all">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Prompt
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="data-[state=active]:bg-pixar-blue data-[state=active]:text-white rounded-lg py-3 transition-all">
                      <Heart className="mr-2 h-4 w-4" />
                      Write Manually
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="generate" className="space-y-6 mt-2">
                    <div className="bg-gradient-to-br from-pixar-blue/5 to-pixar-purple/5 rounded-xl p-6 border border-pixar-blue/10 shadow-sm">
                      <h3 className="font-semibold text-pixar-blue flex items-center mb-3 text-lg">
                        <Sparkles className="h-5 w-5 mr-2" />
                        AI Story Prompt
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Enter a simple prompt about your story idea. Our AI will generate a full story from your prompt in the next step.
                      </p>
                      
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="story-prompt" className="text-sm font-medium mb-2 block">Your Story Idea</Label>
                          <div>
                            <Input
                              id="story-prompt"
                              placeholder={storyPromptExamples[currentExample]}
                              value={promptInput}
                              onChange={(e) => setPromptInput(e.target.value)}
                              className="border-pixar-blue/20 focus:border-pixar-blue transition-all duration-300 shadow-sm text-base"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Example: "A shy robot learns to make friends"
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <div className="flex items-start p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <Zap className="h-6 w-6 text-pixar-orange mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          In the next step, our AI will transform your prompt into a complete story that you can review and edit before animation.
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
                          Write your story in as much detail as possible for the best animation results.
                        </p>
                        <div className="px-3 py-1 bg-pixar-blue/10 rounded-full">
                          <p className="text-xs text-pixar-blue font-medium">
                            {storyInput.length} characters
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Settings Panel - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border-pixar-blue/10 mb-6">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-xl">Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-7 p-6">
                {/* Emotion Selection */}
                <div>
                  <Label className="block mb-3 flex items-center font-medium">
                    <Heart className="mr-2 h-4 w-4 text-pixar-red" />
                    Primary Emotion
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        type="button"
                        onClick={() => setSelectedEmotion(emotion.name)}
                        className={`px-3 py-2 rounded-full text-sm transition-all ${
                          selectedEmotion === emotion.name
                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium shadow-md transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: emotion.color }}
                          />
                          <span>{emotion.name}</span>
                          <span className="ml-1 opacity-70">{emotion.icon}</span>
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
                    className="data-[state=checked]:bg-pixar-blue"
                  />
                </div>
                
                {/* Language Selection */}
                <div>
                  <Label htmlFor="language" className="flex items-center font-medium mb-2">
                    <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-white border-pixar-blue/20">
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
                    <Mic className="mr-2 h-4 w-4 text-muted-foreground" />
                    Voice Style
                  </Label>
                  <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                    <SelectTrigger className="bg-white border-pixar-blue/20">
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
                
                {/* Duration Slider */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-pixar-orange/5 to-transparent border border-pixar-orange/10">
                  <Label className="flex items-center font-medium mb-3">
                    <Clock className="mr-2 h-4 w-4 text-pixar-orange" />
                    Duration: {duration} seconds
                  </Label>
                  <div className="pt-1">
                    <RadioGroup value={duration} onValueChange={setDuration} className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="duration-30" className="text-pixar-orange" />
                        <Label htmlFor="duration-30" className="font-medium">30s</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60" id="duration-60" className="text-pixar-orange" />
                        <Label htmlFor="duration-60" className="font-medium">1m</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="120" id="duration-120" className="text-pixar-orange" />
                        <Label htmlFor="duration-120" className="font-medium">2m</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary Card */}
            <Card className="mb-6 bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-xl shadow-xl rounded-2xl border-pixar-blue/20">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-xl flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-pixar-blue" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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
                      {selectedEmotion ? (
                        <span className="flex items-center">
                          <span 
                            className="w-2 h-2 rounded-full mr-1.5" 
                            style={{ 
                              backgroundColor: emotions.find(e => e.name === selectedEmotion)?.color 
                            }}
                          />
                          {selectedEmotion}
                        </span>
                      ) : 'Not selected'}
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
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl mt-5 border border-blue-200/50">
                    <div className="text-pixar-blue font-medium mb-1 text-xs">Next Step Preview:</div>
                    <div className="text-sm text-gray-700">
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
            
            {/* Continue Button */}
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={handleContinue} 
                disabled={!promptInput && !storyInput} 
                className="w-full bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:from-pixar-darkblue hover:to-pixar-purple pixar-button rounded-xl py-6 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Continue to Story Refinement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!promptInput && !storyInput && (
                <p className="text-center text-red-500 text-xs mt-3">
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
