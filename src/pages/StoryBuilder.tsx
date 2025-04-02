import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { VideoIcon, Clock, Languages, Music, Mic, Heart, ArrowRight, LayoutTemplate, Volume2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmotionSelector from '@/components/dashboard/EmotionSelector';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const emotions = [
  { name: 'Happiness', icon: '😊' },
  { name: 'Sadness', icon: '😢' },
  { name: 'Anger', icon: '😡' },
  { name: 'Fear', icon: '😨' },
  { name: 'Disgust', icon: '🤢' },
  { name: 'Surprise', icon: '😲' },
  { name: 'Joy', icon: '😄' },
  { name: 'Love', icon: '❤️' },
  { name: 'Shame', icon: '😳' }
];

const StoryBuilder = () => {
  const navigate = useNavigate();
  const [storyInput, setStoryInput] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [language, setLanguage] = useState('English');
  const [voiceStyle, setVoiceStyle] = useState('Friendly');
  const [duration, setDuration] = useState('60');
  
  const handleContinue = () => {
    navigate('/review-story');
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient">Create Your Animation</h1>
            <p className="text-muted-foreground">Craft your story and customize animation settings</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Story Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <VideoIcon className="mr-2 h-5 w-5 text-pixar-blue" />
                  Story Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Write your story in as much detail as possible for the best animation results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Animation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emotion Selection */}
                <div>
                  <Label className="block mb-2">Primary Emotion</Label>
                  <EmotionSelector 
                    emotions={emotions} 
                    selectedEmotion={selectedEmotion}
                    onChange={setSelectedEmotion}
                  />
                </div>
                
                {/* Aspect Ratio */}
                <div>
                  <Label className="block mb-2">Aspect Ratio</Label>
                  <div className="grid grid-cols-2 gap-3 max-w-xs">
                    <div 
                      className={`relative cursor-pointer rounded-lg border-2 ${
                        aspectRatio === '16:9' ? 'border-pixar-blue' : 'border-gray-200'
                      }`}
                      onClick={() => setAspectRatio('16:9')}
                    >
                      <AspectRatio ratio={16/9} className="bg-muted h-16">
                        <div className="flex items-center justify-center h-full">
                          <div className="w-8 h-5 border-2 border-gray-400 rounded-sm"></div>
                        </div>
                      </AspectRatio>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`px-2 py-0.5 text-xs rounded-md ${
                          aspectRatio === '16:9' ? 'bg-pixar-blue text-white' : 'bg-white/70'
                        }`}>
                          16:9
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`relative cursor-pointer rounded-lg border-2 ${
                        aspectRatio === '9:16' ? 'border-pixar-blue' : 'border-gray-200'
                      }`}
                      onClick={() => setAspectRatio('9:16')}
                    >
                      <AspectRatio ratio={9/16} className="bg-muted h-16">
                        <div className="flex items-center justify-center h-full">
                          <div className="w-5 h-8 border-2 border-gray-400 rounded-sm"></div>
                        </div>
                      </AspectRatio>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`px-2 py-0.5 text-xs rounded-md ${
                          aspectRatio === '9:16' ? 'bg-pixar-blue text-white' : 'bg-white/70'
                        }`}>
                          9:16
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Language Selection */}
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
                
                {/* Voice Style */}
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
                
                {/* Duration Slider */}
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
            
            {/* Continue Button */}
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={handleContinue} 
                disabled={!storyInput} 
                className="w-full bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
              >
                Continue to Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoryBuilder;
