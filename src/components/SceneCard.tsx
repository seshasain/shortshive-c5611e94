import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Scene {
  id: string;
  content: string;
  visualDescription: string;
  visualSettings?: {
    colorPalette?: string;
    aspectRatio?: string;
  };
}

interface SceneCardProps {
  scene: Scene;
  index: number;
  onEdit: (id: string, newText: string) => void;
  delay?: number;
  theme?: 'light' | 'dark';
}

export function SceneCard({ scene, index, onEdit, delay = 0, theme = 'light' }: SceneCardProps) {
  // ... existing code ...
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative rounded-lg border p-4",
        theme === 'dark' 
          ? "bg-gray-800/50 border-gray-700" 
          : "bg-white border-gray-200"
      )}
    >
      // ... rest of the component code ...
    </motion.div>
  );
}