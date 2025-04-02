
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Play, ArrowLeft, ArrowRight, Check, Wand2, Film } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const StoryReview = () => {
  const navigate = useNavigate();
  const [storyText, setStoryText] = useState("Once upon a time in a colorful underwater world, there lived a curious little fish named Finn. Unlike other fish who were content to swim in the same coral reef, Finn dreamed of exploring the vast ocean beyond. One day, a strong current swept Finn far from home into an unfamiliar part of the ocean...");
  const [scenes, setScenes] = useState(mockScenes);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleBack = () => {
    navigate('/build-story');
  };
  
  const handleGenerate = () => {
    navigate('/generating');
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
            <p className="text-muted-foreground">Review and edit your story and scenes before generating</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complete Story Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-6">
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
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Improve Text
                  </Button>
                  <Button size="sm" className="bg-pixar-blue text-white hover:bg-pixar-darkblue">
                    <Check className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Scene Breakdown */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
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
                <div className="mt-6 flex justify-between items-center">
                  <Button variant="outline">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Regenerate Scenes
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {scenes.length} scenes total
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Generate Button */}
            <motion.div 
              className="mt-6 flex justify-end"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={handleGenerate}
                className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button"
              >
                Generate Animation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Animation Preview</DialogTitle>
            <DialogDescription>
              This is a preview of how your animation might look
            </DialogDescription>
          </DialogHeader>
          
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
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
