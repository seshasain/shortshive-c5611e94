import { motion } from 'framer-motion';
import { FC } from 'react';
import { Sparkles, Lightbulb, Palette, Book, MessageSquare } from 'lucide-react';

// Array of creative process steps
const storyCreationSteps = [
  { icon: Lightbulb, text: "Brainstorming ideas..." },
  { icon: Book, text: "Crafting the narrative..." },
  { icon: MessageSquare, text: "Writing dialogue..." },
  { icon: Palette, text: "Adding visual details..." },
];

const StoryLoadingAnimation: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl border border-pixar-blue/10"
      >
        <div className="flex flex-col items-center">
          {/* Main spinning animation */}
          <div className="relative w-28 h-28 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-t-4 border-pixar-blue"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-l-4 border-pixar-purple opacity-70"
              animate={{ rotate: -180 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <Sparkles className="absolute inset-0 m-auto h-12 w-12 text-pixar-blue" />
          </div>
          
          {/* Title */}
          <motion.h3 
            className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-pixar-blue to-pixar-purple bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Creating Your Story Magic
          </motion.h3>
          
          {/* Steps */}
          <div className="w-full space-y-3 mt-2 mb-4">
            {storyCreationSteps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  backgroundColor: ["rgba(59, 130, 246, 0.05)", "rgba(59, 130, 246, 0.15)", "rgba(59, 130, 246, 0.05)"] 
                }}
                transition={{ 
                  delay: index * 0.3,
                  backgroundColor: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: index * 0.5
                  }
                }}
                className="flex items-center p-2 rounded-lg"
              >
                <div className="bg-pixar-blue/10 p-2 rounded-lg mr-3">
                  <step.icon className="h-5 w-5 text-pixar-blue" />
                </div>
                <span className="text-gray-700">{step.text}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground text-center text-sm">
            We're using AI to transform your prompt into a captivating story. This creative process may take a moment, but the results will be worth it!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoryLoadingAnimation; 