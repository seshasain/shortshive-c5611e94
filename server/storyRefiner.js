// storyRefiner.js - Provides functions for refining story content using LLM APIs

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Refines a story based on provided settings
 * @param {string} storyContent - The original story content
 * @param {Object} settings - Settings for refining the story
 * @param {string} settings.emotion - The emotional tone of the story
 * @param {string} settings.language - The language to use
 * @param {string} settings.voiceStyle - Style of narration
 * @param {number} settings.duration - Target duration in seconds
 * @param {boolean} settings.addHook - Whether to add a hook at the beginning
 * @returns {Promise<Object>} - The refined story with scenes
 */
async function refineStory(storyContent, settings) {
  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in environment variables");
    throw new Error("API key is not configured");
  }

  try {
    // Calculate appropriate number of scenes based on duration
    const recommendedSceneCount = Math.max(5, Math.ceil(settings.duration / 10));
    
    // Calculate story complexity level based on duration
    const storyComplexity = settings.duration <= 30 ? "simple" : 
                           settings.duration <= 60 ? "moderate" : 
                           settings.duration <= 90 ? "detailed" : "complex";
    
    // Calculate target word count based on approx. 2.5 words per second
    const wordCount = Math.floor(settings.duration * 2.5);
    
    // Create the system prompt
    const systemPrompt = `You are an expert storyteller with expertise in creating engaging animated stories. 
Your task is to refine the provided story content into a well-structured animated story with ${recommendedSceneCount} scenes.
The story should have a ${storyComplexity} structure with a clear beginning, middle, and end.
The tone should be ${settings.emotion || 'neutral'} and the language should be ${settings.language || 'English'}.
The narration style should be ${settings.voiceStyle || 'conversational'}.
The target length is approximately ${wordCount} words (about ${settings.duration} seconds when narrated).
${settings.addHook ? 'Add a compelling hook at the beginning to capture attention.' : ''}

For each scene, provide:
1. A descriptive narrative text (what will be narrated)
2. A detailed visual description (what will be shown on screen)

Format the output as a JSON structure with these fields:
- title: A catchy title for the story
- logline: A brief one-sentence summary
- scenes: An array of scene objects, each with:
  - id: Sequential scene number
  - text: The narration text
  - visualDescription: Detailed description of what should be shown visually`;

    // Create the user prompt
    const userPrompt = `Please refine this story content into a ${recommendedSceneCount}-scene animated story:

${storyContent}`;

    console.log(`Making OpenRouter API call to refine story with ${wordCount} words target`);
    
    // Make the API call
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://shortshive.app"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus:beta",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from OpenRouter API:", errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Received response from OpenRouter API");

    // Extract the content from the response
    const content = responseData.choices[0].message.content;
    
    // Parse the JSON output from the LLM response
    try {
      // Find JSON content within the response
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                        content.match(/{[\s\S]*}/);
                        
      let jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      // Clean up any non-JSON text
      if (!jsonContent.trim().startsWith('{')) {
        jsonContent = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      }
      
      // Parse the JSON
      const refinedStory = JSON.parse(jsonContent);
      
      return {
        success: true,
        refinedStory
      };
    } catch (parseError) {
      console.error("Error parsing LLM response as JSON:", parseError);
      return {
        success: false,
        error: "Failed to parse refined story",
        rawContent: content
      };
    }
  } catch (error) {
    console.error("Error refining story:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred"
    };
  }
}

export default {
  refineStory
}; 