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

export const refineStory = async (storyData: StoryData): Promise<{ 
    success: boolean; 
    data?: StoryResponse;
    error?: string;
    rawContent?: string;
}> => {
    console.log('Attempting to call refineStory API with data:', storyData);
    
    // Maximum number of retry attempts
    const MAX_RETRIES = 2;
    let retryCount = 0;
    
    while (retryCount <= MAX_RETRIES) {
        try {
            console.log(`Making fetch request to ${API_BASE_URL}/refine-story (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
            const response = await fetch(`${API_BASE_URL}/refine-story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storyData),
            });

            const data = await response.json();
            console.log('Received response from refineStory API:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to refine story');
            }
            
            // Check if the response indicates a parsing failure
            if (!data.success && data.error === 'Failed to parse story content') {
                if (retryCount < MAX_RETRIES) {
                    console.log('Server failed to parse story content, retrying...');
                    retryCount++;
                    // Wait a bit before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                } else {
                    // We tried the maximum number of times, try to handle the raw content
                    console.log('Maximum retries reached, attempting to handle raw content');
                    if (data.rawContent) {
                        try {
                            // Try to manually extract and parse the JSON from rawContent
                            const extractedJson = extractJsonFromText(data.rawContent);
                            if (extractedJson) {
                                return { success: true, data: extractedJson };
                            }
                        } catch (extractError) {
                            console.error('Failed to extract JSON from raw content:', extractError);
                        }
                    }
                    throw new Error('Failed to parse story after multiple attempts');
                }
            }

            return data;
        } catch (error) {
            console.error(`Error refining story (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);
            
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                throw error;
            }
        }
    }
    
    // This should be unreachable but TypeScript needs a return
    throw new Error('Failed to refine story after exhausting all retries');
};

// Helper function to extract JSON from text
function extractJsonFromText(text: string): any {
    try {
        // Try to extract JSON object from markdown code blocks
        const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (markdownMatch && markdownMatch[1]) {
            const jsonContent = markdownMatch[1].trim();
            return JSON.parse(jsonContent);
        }
        
        // Try to find JSON object directly
        const jsonMatch = text.match(/(\{[\s\S]*\})/);
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        }
        
        // Try to find the first { and match it with the appropriate closing }
        const firstBrace = text.indexOf('{');
        if (firstBrace !== -1) {
            let braceCount = 0;
            let lastMatchingBrace = -1;
            
            for (let i = firstBrace; i < text.length; i++) {
                if (text[i] === '{') braceCount++;
                else if (text[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        lastMatchingBrace = i;
                        break;
                    }
                }
            }
            
            if (lastMatchingBrace !== -1) {
                const jsonContent = text.substring(firstBrace, lastMatchingBrace + 1);
                return JSON.parse(jsonContent);
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting JSON from text:', error);
        return null;
    }
}

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