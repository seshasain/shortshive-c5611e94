import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Check, X, Eye, Film, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

export const SceneCard = ({ scene, index, onEdit, delay = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(scene.text);
  const [showVisualDescription, setShowVisualDescription] = useState(false);
  
  const handleSave = () => {
    onEdit(scene.id, editText);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditText(scene.text);
    setIsEditing(false);
  };
  
  // Update gradientColors to use Pixar theme
  const gradientColors = [
    'from-pixar-blue/10 to-pixar-purple/10 border-pixar-blue/20',
    'from-pixar-orange/10 to-pixar-purple/10 border-pixar-orange/20',
    'from-pixar-purple/10 to-pixar-blue/10 border-pixar-purple/20',
    'from-pixar-blue/10 to-pixar-orange/10 border-pixar-blue/20',
  ];
  
  const colorIndex = index % gradientColors.length;
  const gradientColor = gradientColors[colorIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + delay }}
      className="h-full"
    >
      <Card className={`bg-gradient-to-br ${gradientColor} overflow-hidden h-full shadow-md rounded-xl border transition-all hover:shadow-lg`}>
        <CardContent className="p-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 h-full shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm text-pixar-blue border border-pixar-blue/20">
                Scene {index + 1}
              </span>
              <div className="flex space-x-1">
                {scene.visualDescription && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full bg-pixar-purple/10 hover:bg-pixar-purple/20 text-pixar-purple"
                    onClick={() => setShowVisualDescription(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full bg-pixar-blue/10 hover:bg-pixar-blue/20 text-pixar-blue"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-grow">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{scene.text}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-pixar-blue/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Edit className="mr-2 h-5 w-5 text-pixar-blue" />
              Edit Scene {index + 1}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={6}
            className="border-pixar-blue/20 focus:border-pixar-blue focus-visible:ring-pixar-blue/40 text-gray-700 text-base shadow-sm"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:from-pixar-darkblue hover:to-pixar-purple shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visual Description Dialog */}
      {scene.visualDescription && (
        <Dialog open={showVisualDescription} onOpenChange={setShowVisualDescription}>
          <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-pixar-blue/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <Eye className="mr-2 h-5 w-5 text-pixar-purple" />
                Visual Description
              </DialogTitle>
              <DialogDescription>
                How this scene will appear visually in your animation
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gradient-to-br from-pixar-purple/5 to-pixar-blue/5 rounded-xl p-4 border border-pixar-purple/10">
              <p className="text-gray-700 whitespace-pre-wrap">{scene.visualDescription}</p>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => setShowVisualDescription(false)}
                className="bg-gradient-to-r from-pixar-blue to-pixar-purple text-white hover:from-pixar-darkblue hover:to-pixar-purple shadow-sm"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default SceneCard;
