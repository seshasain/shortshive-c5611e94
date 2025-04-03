
import { toast } from "sonner";

// Types
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

export interface AnimationData {
  storyContent: string;
  scenes: Array<{
    id: string;
    text: string;
    image: string;
  }>;
  visualSettings: {
    colorPalette: string;
    aspectRatio: string;
  };
  originalStoryType: 'ai-prompt' | 'manual';
  originalPrompt: string | null;
  timestamp: string;
}

const API_ENDPOINT = "https://api.example.com/v1"; // Replace with your actual API endpoint

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  const errorMessage = error?.response?.data?.message || error.message || "An unexpected error occurred";
  toast.error(errorMessage);
  return Promise.reject(error);
};

/**
 * Generates a full story from a prompt
 */
export const generateStoryFromPrompt = async (prompt: string, settings: StoryData["settings"]): Promise<string> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        settings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error generating story: ${response.statusText}`);
    }

    const data = await response.json();
    return data.storyContent;
  } catch (error) {
    handleApiError(error);
    // Return a placeholder story in case of error
    return "Once upon a time in a colorful underwater world, there lived a curious little fish named Finn. Unlike other fish who were content to swim in the same coral reef, Finn dreamed of exploring the vast ocean beyond. One day, a strong current swept Finn far from home into an unfamiliar part of the ocean...";
  }
};

/**
 * Breaks down a story into scenes
 */
export const generateScenes = async (storyContent: string, settings: StoryData["settings"]): Promise<Array<{ id: string; text: string; image: string }>> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/generate-scenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyContent,
        settings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error generating scenes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.scenes;
  } catch (error) {
    handleApiError(error);
    // Return placeholder scenes in case of error
    return [
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
  }
};

/**
 * Generates the final animation
 */
export const generateAnimation = async (animationData: AnimationData): Promise<{ animationId: string }> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/generate-animation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animationData),
    });

    if (!response.ok) {
      throw new Error(`Error generating animation: ${response.statusText}`);
    }

    const data = await response.json();
    return { animationId: data.animationId };
  } catch (error) {
    handleApiError(error);
    // Return a placeholder animation ID in case of error
    return { animationId: "mock-animation-" + Date.now() };
  }
};

/**
 * Checks the status of an animation generation
 */
export const checkAnimationStatus = async (animationId: string): Promise<{ 
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: number;
  resultUrl?: string;
}> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/animation-status/${animationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error checking animation status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
    // Return a placeholder status in case of error
    return { 
      status: 'processing',
      progress: Math.floor(Math.random() * 100),
      currentStep: Math.floor(Math.random() * 6) + 1
    };
  }
};
