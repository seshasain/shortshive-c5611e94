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

export const refineStory = async (storyData: StoryData): Promise<{ success: boolean; data: StoryResponse }> => {
    console.log('Attempting to call refineStory API with data:', storyData);
    try {
        console.log('Making fetch request to:', `${API_BASE_URL}/refine-story`);
        const response = await fetch(`${API_BASE_URL}/refine-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(storyData),
        });

        if (!response.ok) {
            throw new Error('Failed to refine story');
        }

        const data = await response.json();
        console.log('Received response from refineStory API:', data);
        return data;
    } catch (error) {
        console.error('Error refining story:', error);
        throw error;
    }
};

export const generateAnimation = async (input: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-animation`, {
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