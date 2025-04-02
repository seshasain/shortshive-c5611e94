
import React from 'react';
import { motion } from 'framer-motion';

interface Emotion {
  name: string;
  icon: string;
}

interface EmotionSelectorProps {
  emotions: Emotion[];
  selectedEmotion: string;
  onChange: (emotion: string) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ emotions, selectedEmotion, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {emotions.map((emotion) => (
        <motion.div
          key={emotion.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(emotion.name)}
          className={`cursor-pointer p-2 rounded-md flex flex-col items-center justify-center text-center transition-colors ${
            selectedEmotion === emotion.name 
              ? 'bg-pixar-blue/10 border border-pixar-blue/30' 
              : 'border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-xl mb-1">{emotion.icon}</span>
          <span className={`text-xs font-medium ${
            selectedEmotion === emotion.name ? 'text-pixar-blue' : 'text-gray-600'
          }`}>
            {emotion.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default EmotionSelector;
