
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Scene = {
  id: string;
  text: string;
  image: string;
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
  
  const handleSave = () => {
    onEdit(scene.id, editText);
    setEditing(false);
  };
  
  const handleCancel = () => {
    setEditText(scene.text);
    setEditing(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="relative">
          <img 
            src={scene.image} 
            alt={`Scene ${index + 1}`}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
            Scene {index + 1}
          </div>
        </div>
        
        <div className="p-3">
          {editing ? (
            <div>
              <Textarea 
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[100px] text-sm"
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
            <div className="flex">
              <p className="text-sm flex-1 line-clamp-3">{scene.text}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditing(true)}
                className="flex-shrink-0 h-6 w-6 p-0 ml-1"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default SceneCard;
