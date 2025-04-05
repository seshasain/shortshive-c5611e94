const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const path = require("path");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");

// Load environment variables
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

// Exit if API key is not available
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["image", "text"],
  responseMimeType: "text/plain",
};

// Ensure output directories exist
const outputDir = path.join(__dirname, 'output');
const tempDir = path.join(__dirname, 'temp');

// Create directories if they don't exist
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

/**
 * Generate an image for a scene based on its description
 * @param {string} storyId - The ID of the story
 * @param {Object} scene - The scene data
 * @param {Object} visualSettings - The visual settings for the scene
 * @returns {Promise<{sceneNumber: number, imageUrl: string, success: boolean, error?: string}>}
 */
async function generateSceneImage(storyId, scene, visualSettings) {
  try {
    console.log(`Generating image for scene ${scene.sceneNumber}...`);
    
    // Prepare a detailed prompt for the image generation
    const visualDesc = scene.visualDescription || '';
    const dialogue = scene.dialogueOrNarration || '';
    
    // Extract visual style from visualSettings
    let visualStyle = 'Pixar-style 3D animation';
    let styleDetails = 'Soft, colorful, expressive 3D animation with high quality rendering';
    
    // Map the visual style based on user selection
    if (visualSettings?.colorPalette) {
      switch(visualSettings.colorPalette) {
        case 'pixar':
          visualStyle = 'Pixar-style 3D animation';
          styleDetails = 'Soft, colorful, expressive 3D animation with high quality rendering';
          break;
        case 'cinematic':
          visualStyle = 'Cinematic 3D rendering';
          styleDetails = 'Dramatic lighting, realistic textures, cinematic composition';
          break;
        case 'anime':
          visualStyle = 'Anime-inspired 3D style';
          styleDetails = 'Vibrant colors, expressive characters, stylized features';
          break;
        case 'cartoon':
          visualStyle = '2D cartoon style';
          styleDetails = 'Bold outlines, flat colors, exaggerated expressions, cartoon-like';
          break;
        default:
          // Keep defaults for unknown styles
          break;
      }
    }
    
    const aspectRatio = visualSettings?.aspectRatio || '16:9';
    
    // Extract title and characters from visualSettings if available
    const title = visualSettings?.title || "Story Title";
    const characters = visualSettings?.characters || [];
    
    // Create a representation of the story with this scene
    const storyData = {
      title: title,
      characters: characters,
      settings: {
        emotion: visualSettings?.emotion || "Neutral",
        language: "English",
        voiceStyle: visualSettings?.voiceStyle || "Conversational",
        duration: 10,
        addHook: true
      },
      scenes: [{
        sceneNumber: scene.sceneNumber,
        durationEstimate: scene.durationEstimate || 10,
        visualDescription: visualDesc,
        dialogueOrNarration: dialogue
      }]
    };
    
    // Create the complete image prompt
    const imagePrompt = `Story:"${JSON.stringify(storyData)}"

Admin Rules: generat img in ${visualStyle} cinematic style, ensure you generate meaningful visual for undstand whats hapening in this scene,

Create a high-quality, ${visualStyle} image for the following scene:
      
${visualDesc.length > 0 ? visualDesc : dialogue}
      
Style specifications:
- ${visualStyle}
- ${styleDetails}
- Aspect ratio: ${aspectRatio}
- Clear, detailed characters with expressive features
- Beautiful lighting and composition
- High level of detail and polish
      
Make sure the image clearly conveys the scene's emotion and story context.`;
    
    // Configure generation parameters
    const genConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
    console.log("imagePrompt ", imagePrompt);
    // Send the request to Gemini for image generation
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
      generationConfig: genConfig,
    });
    
    // Process the response
    const response = result.response;
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No image generated');
    }
    
    // Check if we received image data
    const parts = response.candidates[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error('No content in response');
    }
    
    // Find the first part that contains an image
    const imagePart = parts.find(part => part.inlineData?.mimeType?.startsWith('image/'));
    
    if (!imagePart || !imagePart.inlineData) {
      // If no image, use the text to create a placeholder image
      console.warn('No image data found in response for scene', scene.sceneNumber);
      
      // Create a fallback base64 placeholder image
      // (in a real app, this would be a better fallback)
      const base64Placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      
      // Save the placeholder
      const imageUrl = await saveBase64Image(base64Placeholder, storyId, scene.sceneNumber);
      
      return {
        sceneNumber: scene.sceneNumber,
        imageUrl,
        success: false,
        error: 'No image data in response'
      };
    }
    
    // Extract image data
    const base64ImageData = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    
    // Save the image to disk
    const imageUrl = await saveBase64Image(base64ImageData, storyId, scene.sceneNumber);
    
    if (!imageUrl) {
      throw new Error('Failed to save image');
    }
    
    return {
      sceneNumber: scene.sceneNumber,
      imageUrl,
      success: true
    };
  } catch (error) {
    console.error(`Error generating image for scene ${scene.sceneNumber}:`, error);
    return {
      sceneNumber: scene.sceneNumber,
      imageUrl: null,
      success: false,
      error: error.message
    };
  }
}

/**
 * Process multiple images from a single batch image generation response
 * @param {Object} response - The Gemini API response
 * @param {string} storyId - The ID of the story
 * @param {Array} scenes - Array of scene objects 
 * @returns {Promise<Array>} Array of processed image results
 */
async function processMultipleImages(response, storyId, scenes) {
  const results = [];
  
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('No images generated in response');
  }
  
  const parts = response.candidates[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('No content parts in response');
  }
  
  // Filter only image parts
  const imageParts = parts.filter(part => part.inlineData?.mimeType?.startsWith('image/'));
  
  console.log(`Received ${imageParts.length} images from Gemini for ${scenes.length} scenes`);
  
  // Map images to scenes, handling cases where count doesn't match
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneNumber = scene.sceneNumber;
    
    // Use matching image if available, otherwise use placeholder
    if (i < imageParts.length && imageParts[i]?.inlineData) {
      const imagePart = imageParts[i];
      const base64ImageData = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      const imageUrl = await saveBase64Image(base64ImageData, storyId, sceneNumber);
      
      if (imageUrl) {
        results.push({
          sceneNumber: sceneNumber,
          imageUrl: imageUrl,
          success: true
        });
      } else {
        throw new Error(`Failed to save image for scene ${sceneNumber}`);
      }
    } else {
      // No matching image, use placeholder
      console.warn(`No image data found for scene ${sceneNumber}`);
      const base64Placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const imageUrl = await saveBase64Image(base64Placeholder, storyId, sceneNumber);
      
      results.push({
        sceneNumber: sceneNumber,
        imageUrl: imageUrl,
        success: false,
        error: 'No image data in response'
      });
    }
  }
  
  return results;
}

/**
 * Generate images for all scenes in a story using a single batch prompt
 * @param {string} storyId - The ID of the story
 * @param {Array} scenes - Array of scene objects
 * @param {Object} visualSettings - Object containing visual preferences
 * @returns {Promise<{images: Array, success: boolean, error?: string}>}
 */
async function generateStoryImages(storyId, scenes, visualSettings) {
  try {
    console.log(`Generating images for story ${storyId} with ${scenes.length} scenes as a batch`);
    
    // Validate inputs
    if (!storyId || !scenes || !Array.isArray(scenes) || scenes.length === 0) {
      throw new Error('Invalid input: story ID and scenes array are required');
    }
    
    // Sort scenes by scene number to ensure proper order
    const sortedScenes = [...scenes].sort((a, b) => a.sceneNumber - b.sceneNumber);
    
    // Extract title and characters from visualSettings if available
    const title = visualSettings?.title || "Story Title";
    const characters = visualSettings?.characters || [];
    
    // Create a JSON representation of all scenes
    const storyData = {
      title: title,
      characters: characters,
      settings: {
        emotion: visualSettings?.emotion || "Neutral",
        language: "English",
        voiceStyle: visualSettings?.voiceStyle || "Conversational",
        duration: sortedScenes.length * 10,
        addHook: true
      },
      scenes: sortedScenes.map(scene => ({
        sceneNumber: scene.sceneNumber,
        durationEstimate: scene.durationEstimate || 10,
        visualDescription: scene.visualDescription || '',
        dialogueOrNarration: scene.dialogueOrNarration || ''
      }))
    };
    
    // Get visual settings
    const aspectRatio = visualSettings?.aspectRatio || '16:9';
    
    // Extract visual style from visualSettings
    let visualStyle = 'Pixar-style 3D animation';
    let styleDetails = 'Soft, colorful, expressive 3D animation with high quality rendering';
    
    // Map the visual style based on user selection
    if (visualSettings?.colorPalette) {
      switch(visualSettings.colorPalette) {
        case 'pixar':
          visualStyle = 'Pixar-style 3D animation';
          styleDetails = 'Soft, colorful, expressive 3D animation with high quality rendering';
          break;
        case 'cinematic':
          visualStyle = 'Cinematic 3D rendering';
          styleDetails = 'Dramatic lighting, realistic textures, cinematic composition';
          break;
        case 'anime':
          visualStyle = 'Anime-inspired 3D style';
          styleDetails = 'Vibrant colors, expressive characters, stylized features';
          break;
        case 'cartoon':
          visualStyle = '2D cartoon style';
          styleDetails = 'Bold outlines, flat colors, exaggerated expressions, cartoon-like';
          break;
        default:
          // Keep defaults for unknown styles
          break;
      }
    }
    
    // Create a single prompt for all scenes
    const batchPrompt = `Story:"${JSON.stringify(storyData)}"

Admin Rules: generat imgs for each scene in ${visualStyle} cinematic style, ensure you generate meaningful visual for undstand whats hapening in story,

I need you to generate a series of images for a story with ${scenes.length} scenes. Each scene should be illustrated in the same visual style with consistent characters and settings.

Style specifications:
- ${visualStyle}
- ${styleDetails}
- Aspect ratio: ${aspectRatio}
- Clear, detailed characters with expressive features
- Beautiful lighting and composition
- No text or captions in the images
- Consistent character appearance across scenes

IMPORTANT: Generate exactly ${scenes.length} images, one for each scene in the correct order.
Each image should clearly represent the scene's visual description and dialogue.
`;

    console.log('Sending batch prompt to Gemini API for image generation');
    
    // Configure generation parameters
    const genConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
      responseModalities: ["image"], // Request only images
    };
    
    // Send the batch request to Gemini for image generation
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: batchPrompt }] }],
      generationConfig: genConfig,
    });
    
    // Process the multiple images from the response
    const processedResults = await processMultipleImages(result.response, storyId, sortedScenes);
    
    // Count failures
    const failedScenes = processedResults
      .filter(result => !result.success)
      .map(result => result.sceneNumber);
    
    // Sort results by scene number
    processedResults.sort((a, b) => a.sceneNumber - b.sceneNumber);
    
    return {
      success: true,
      images: processedResults,
      failedScenes: failedScenes.length > 0 ? failedScenes : undefined
    };
  } catch (error) {
    console.error('Error in batch image generation:', error);
    return {
      success: false,
      images: [],
      error: error.message
    };
  }
}

// For testing purposes
async function testBatchImageGeneration() {
  const result = await generateStoryImages(
    "test-story-123",
    [
      {
        sceneNumber: 1,
        visualDescription: "A curious red fox sitting in a snowy forest at sunset, with golden light filtering through the trees",
        dialogueOrNarration: "The fox paused, his ears perked up at the faintest sound in the distance."
      },
      {
        sceneNumber: 2,
        visualDescription: "A small cabin with smoke rising from the chimney, nestled in the snowy forest",
        dialogueOrNarration: "Home was just beyond the ridge, a warm fire waiting."
      }
    ],
    {
      colorPalette: "pixar",
      aspectRatio: "16:9"
    }
  );
  
  console.log("Batch test result:", result);
}

async function saveBase64Image(base64Data, storyId, sceneNumber) {
  try {
    // Extract the mime type and actual base64 data
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data');
    }
    
    const mimeType = matches[1];
    const actualData = matches[2];
    const buffer = Buffer.from(actualData, 'base64');
    const extension = mime.extension(mimeType) || 'png';
    
    const fileName = `${storyId}_scene_${sceneNumber}_${Date.now()}.${extension}`;
    const filePath = path.join(outputDir, fileName);
    
    await fs.promises.writeFile(filePath, buffer);
    
    // Return a URL relative to the server, which will be served by express static middleware
    return `/generated-images/${fileName}`;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    return null;
  }
}

// Export the functions for use in other modules
module.exports = {
  generateSceneImage,
  generateStoryImages,
  saveBase64Image,
  processMultipleImages,
  testBatchImageGeneration
}; 