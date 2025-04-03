
import { toast } from "sonner";

// Type definitions
export interface StoryData {
  storyType: 'ai-prompt' | 'manual';
  storyContent: string;
  settings: {
    emotion: string;
    language: string;
    voiceStyle: string;
    duration: number;
    addHook: boolean;
  };
  timestamp: string;
}

export interface Scene {
  id: string;
  text: string;
  image: string;
}

export interface AnimationSettings {
  colorPalette: string;
  aspectRatio: string;
}

// API endpoints
const API_URL = "http://localhost:3000/api";

// Generate story from prompt
export const generateStoryFromPrompt = async (
  prompt: string,
  settings: StoryData['settings']
): Promise<string> => {
  console.log("Calling backend API to generate story with prompt:", prompt);
  console.log("Story settings:", settings);
  
  try {
    toast.info("Generating your story...");
    
    const response = await fetch(`${API_URL}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        settings
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Story generated successfully!");
    return data.story;
  } catch (error) {
    console.error("Error generating story:", error);
    toast.error("Failed to generate story. Please try again.");
    throw new Error("Failed to generate story");
  }
};

// Generate scenes from a complete story
export const generateScenes = async (
  story: string, 
  settings: AnimationSettings
): Promise<Scene[]> => {
  console.log("Calling backend API to generate scenes with settings:", settings);
  
  try {
    toast.info("Breaking story into scenes...");
    
    const response = await fetch(`${API_URL}/generate-scenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story,
        settings
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Scenes created successfully!");
    return data.scenes;
  } catch (error) {
    console.error("Error generating scenes:", error);
    toast.error("Failed to generate scenes. Please try again.");
    throw new Error("Failed to generate scenes");
  }
};

// Generate animation from scenes
export const generateAnimation = async (
  scenes: Scene[],
  settings: AnimationSettings
): Promise<string> => {
  console.log("Calling backend API to generate animation with settings:", settings);
  
  try {
    toast.info("Creating your animation...");
    
    const response = await fetch(`${API_URL}/generate-animation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenes,
        settings
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Animation generated successfully!");
    return data.animationUrl;
  } catch (error) {
    console.error("Error generating animation:", error);
    toast.error("Failed to generate animation. Please try again.");
    throw new Error("Failed to generate animation");
  }
};

// Track animation generation progress
export const getAnimationProgress = async (): Promise<{
  progress: number;
  currentStep: number;
  isComplete: boolean;
}> => {
  try {
    const response = await fetch(`${API_URL}/animation-progress`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching animation progress:", error);
    // Return default values if we can't reach the server
    return {
      progress: 0,
      currentStep: 1,
      isComplete: false
    };
  }
};
