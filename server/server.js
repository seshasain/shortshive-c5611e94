import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Story Refinement endpoint
app.post('/api/refine-story', async (req, res) => {
    console.log('Received refine-story request with body:', req.body);
    try {
        const { storyContent, settings } = req.body;
        
        if (!storyContent) {
            console.error('No story content provided in request');
            return res.status(400).json({ success: false, error: 'No story content provided' });
        }

        console.log('Initializing OpenRouter call with settings:', settings);

        const prompt = `Create a short story based on this prompt: "${storyContent}"

Admin Rules: Create a short story tailored to the provided 'duration' (${settings.duration} seconds) and ensure the content aligns with the specified emotion (${settings.emotion}). If addHook is ${settings.addHook}, include a compelling hook in the opening scene to captivate the audience. Detail each character with vivid descriptions at the level of Pixar-quality 3D animation, ensuring they are engaging, dynamic, and relatable. The story should include well-structured scenes, each reflecting the core theme and emotion of the narrative. The scenes must be cinematic, visually rich, and emotionally resonant, providing both visual storytelling and engaging dialogue/narration that would fit in a short video format.

Return the story in this exact JSON format:
{
  "title": "Story title here",
  "logline": "One-line summary of the story",
  "settings": {
    "emotion": "${settings.emotion}",
    "language": "${settings.language}",
    "voiceStyle": "${settings.voiceStyle}",
    "duration": ${settings.duration},
    "addHook": ${settings.addHook}
  },
  "characters": [
    {
      "name": "Character name",
      "description": "Detailed physical and personality description"
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "durationEstimate": 10,
      "visualDescription": "Detailed cinematic description of the scene",
      "dialogueOrNarration": "Natural, conversational narration or dialogue"
    }
  ]
}

For visualDescription: This section is a detailed, cinematic depiction of how the scene should unfold visually, giving a clear picture of the characters, the setting, and their actions in a way that conveys the story through imagery. Think of it like the direction for a short film — how the characters interact with each other, their body language, the environment around them, and any movements that help convey the emotions and story. It should be vivid, engaging, and designed to capture the audience’s attention through visuals alone

For dialogueOrNarration: This section includes the voiceover or subtitles that narrate the story. It should be written in a natural, conversational tone, as though speaking directly to the audience. The narration should engage the listener by providing insight into the characters' emotions, thoughts, and actions, while complementing the visual elements of the scene. Keep the voiceover engaging, friendly, and easy to follow. Avoid using any stage directions or instructions (like "Friendly, warm Narrator"). The narration should flow smoothly, as if telling a story to a friend, and be suitable for text-to-speech conversion without additional commentary or context. This is essential for short-form content like YouTube or Instagram Reels, where the storytelling is brief but impactful.

Each activity should be a new scene, dont try to fit two activities in one scene.
Return ONLY the JSON without any additional text or explanation.`;

        console.log('Sending message to OpenRouter...');
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'ShortShive Story Generator'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-r1:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a creative story writer specializing in short-form content. You excel at creating structured, well-formatted JSON responses.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 1,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        const storyText = result.choices[0].message.content;
        const parsedResponse = JSON.parse(storyText);
        
        res.json({ success: true, data: parsedResponse });
    } catch (error) {
        console.error('Story refinement error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port)
    .on('listening', () => console.log(`Server is running on port ${port}`))
    .on('error', error => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use`);
            process.exit(1);
        }
        console.error('Server error:', error);
    }); 