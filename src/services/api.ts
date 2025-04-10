const API_BASE_URL = 'http://localhost:3000/api';

interface StoryData {
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

interface Character {
    name: string;
    description: string;
}

interface Scene {
    sceneNumber: number;
    durationEstimate: number;
    visualDescription: string;
    dialogueOrNarration: string;
}

interface StoryResponse {
    title: string;
    logline: string;
    settings: {
        emotion: string;
        language: string;
        voiceStyle: string;
        duration: number;
        addHook: boolean;
    };
    characters: Character[];
    scenes: Scene[];
}

export async function refineStory(storyData: any, userId: string) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/refine-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                storyContent: storyData.storyContent,
                settings: storyData.settings,
                userId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to refine story');
        }

        return await response.json();
    } catch (error) {
        console.error('Error refining story:', error);
        throw error;
    }
}

export const generateAnimation = async (input: string) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/generate-animation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate animation');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating animation:', error);
        throw error;
    }
}; 