import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Check, X, Eye, Film } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

type Scene = {
  id: string;
  text: string;
  image?: string; // Keep for backward compatibility
  visualDescription?: string;
};

interface SceneCardProps {
  scene: Scene;
  index: number;
  onEdit: (id: string, text: string) => void;
  delay?: number;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, index, onEdit, delay = 0 }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(scene.text);
  const [showDescription, setShowDescription] = useState(false);
  
  const handleSave = () => {
    onEdit(scene.id, editText);
    setEditing(false);
  };
  
  const handleCancel = () => {
    setEditText(scene.text);
    setEditing(false);
  };
  
  // Create a gradient background color based on the scene number
  const gradientColors = [
    'from-blue-50 to-indigo-50 border-blue-200',
    'from-purple-50 to-pink-50 border-purple-200',
    'from-green-50 to-teal-50 border-green-200',
    'from-orange-50 to-amber-50 border-orange-200',
    'from-red-50 to-pink-50 border-red-200',
  ];
  
  const bgGradient = gradientColors[index % gradientColors.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className={`overflow-hidden border hover:shadow-md transition-all duration-300 h-full bg-gradient-to-br ${bgGradient}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge variant="outline" className="bg-white/80">
              <Film className="h-3 w-3 mr-1" /> Scene {index + 1}
            </Badge>
          </div>
          
          {editing ? (
            <div>
              <Textarea 
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[120px] text-sm bg-white/80"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="h-8 px-3 bg-pixar-blue text-white hover:bg-pixar-darkblue"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[100px] bg-white/80 rounded-md p-3 shadow-sm">
              <p className="text-sm pr-6">{scene.text}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditing(true)}
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full hover:bg-gray-100"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              
              {scene.visualDescription && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-gray-500 line-clamp-2 flex-1 pr-2">
                      <span className="font-medium">Visual: </span>
                      {scene.visualDescription.substring(0, 120)}...
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowDescription(true)}
                      className="h-6 w-6 p-0 rounded-full flex-shrink-0 bg-gray-100 hover:bg-gray-200"
                    >
                      <Eye className="h-3.5 w-3.5 text-pixar-blue" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      
      {/* Visual Description Dialog */}
      <Dialog open={showDescription} onOpenChange={setShowDescription}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scene {index + 1} Visual Description</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              {scene.visualDescription}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SceneCard;
