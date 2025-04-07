import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "path";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// Exit if API key is not available
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  process.exit(1);
}

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directories exist
const outputDir = path.join(__dirname, 'output');
const tempDir = path.join(__dirname, 'temp');
const pythonScriptsDir = path.join(__dirname, 'python_scripts');

// Create directories if they don't exist
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });
fs.mkdirSync(pythonScriptsDir, { recursive: true });

// Ensure the output directory has the right permissions (readable by the server)
try {
  fs.chmodSync(outputDir, 0o755); // rwxr-xr-x permission
} catch (error) {
  console.warn(`Warning: Could not set permissions for output directory: ${error.message}`);
}

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey });

/**
 * Generate images for all scenes in a story using the Python script
 * @param {string} storyId - The ID of the story
 * @param {Array} scenes - Array of scene objects
 * @param {Object} visualSettings - The visual settings for the scenes
 * @returns {Promise<{success: boolean, images: Array, failedScenes: Array}>}
 */
async function generateStoryImages(storyId, scenes, visualSettings) {
  try {
    // Input validation
    if (!storyId || !scenes) {
      throw new Error('Story ID and scenes are required');
    }
    
    if (!Array.isArray(scenes) || scenes.length === 0) {
      throw new Error('Scenes must be a non-empty array');
    }
    
    // Normalize all scenes
    const normalizedScenes = scenes.map(scene => ({
      ...scene,
      sceneNumber: scene.sceneNumber || parseInt(scene.id) || scenes.indexOf(scene) + 1
    }));
    
    // Sort scenes by scene number
    normalizedScenes.sort((a, b) => a.sceneNumber - b.sceneNumber);
    
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
    const title = visualSettings?.title || "Story Title";
    const characters = visualSettings?.characters || [];
    
    // Create a prompt for Python script
    let sceneDescriptions = normalizedScenes.map((scene, index) => {
      // Get the scene content from either the content property or dialogueOrNarration
      // Also use visualDescription if available
      const sceneContent = scene.content || scene.dialogueOrNarration || '';
      const visualDesc = scene.visualDescription || '';
      
      // Combine dialogue and visual description for a richer scene prompt
      let description = '';
      
      // If we have both visual description and dialogue, format them clearly
      if (visualDesc && visualDesc !== sceneContent) {
        description = `${visualDesc}\n\nDialogue/Narration: ${sceneContent}`;
      } else if (visualDesc) {
        description = visualDesc;
      } else {
        description = sceneContent;
      }
      
      return `SCENE ${index + 1}:\n${description}`;
    }).join('\n\n');
    
    // Determine if we have a full story object or just scenes
    const hasFullStoryData = visualSettings?.title && visualSettings?.characters;
    
    // Based on the visualization style, create appropriate prompt instructions
    let styleInstructions = '';
    if (visualSettings?.colorPalette === 'cinematic') {
      styleInstructions = `
- Create realistic, cinematic-quality images with dramatic lighting
- Use professional cinematography techniques and framing
- Ensure the emotional tone of each scene is captured through lighting, angles, and composition
- Pay attention to details of environments and character expressions
- Use a color palette that enhances the mood of each scene
- Make sure characters are consistently portrayed across all scenes
`;
    } else if (visualSettings?.colorPalette === 'anime') {
      styleInstructions = `
- Create vibrant anime-style images with distinctive character designs
- Use expressive features and dynamic compositions typical of anime
- Incorporate anime-style shading and color techniques
- Emphasize emotional expressions through anime visual conventions
- Ensure consistent character appearance across all scenes
`;
    } else if (visualSettings?.colorPalette === 'cartoon') {
      styleInstructions = `
- Create colorful cartoon-style images with bold outlines
- Use exaggerated expressions and simplified backgrounds
- Make characters distinctively stylized with recognizable features
- Employ bright, saturated colors appropriate for cartoons
- Ensure consistent character appearance across all scenes
`;
    } else {
      // Default Pixar style
      styleInstructions = `
- Create Pixar-style 3D animation with soft, expressive characters
- Use warm lighting and carefully crafted environments
- Pay attention to small details that bring the scene to life
- Ensure characters have emotive faces that convey their feelings clearly
- Create a sense of wonder and magic through lighting and composition
`;
    }
    
    // Build an enhanced prompt for better image generation
    let promptForPython = `Generate a series of ${scenes.length} high-quality ${visualStyle} images for a story titled "${title}".\n\n`;
    
    // Add specific character information if available
    if (characters && characters.length > 0) {
      promptForPython += `CHARACTERS:\n`;
      promptForPython += characters.map(c => {
        // Enhance character descriptions with visual details
        let enhancedDesc = c.description || `A character named ${c.name}`;
        return `- ${c.name}: ${enhancedDesc}`;
      }).join('\n');
      promptForPython += `\n\n`;
    }
    
    promptForPython += `STYLE SPECIFICATIONS:\n`;
    promptForPython += `- ${visualStyle}\n`;
    promptForPython += `- ${styleDetails}\n`;
    promptForPython += `- Aspect ratio: ${aspectRatio}\n`;
    promptForPython += styleInstructions;
    promptForPython += `- Ensure consistent visual style across all images\n\n`;
    
    // Add admin rules for image generation
    promptForPython += `ADMIN RULES:\n`;
    promptForPython += `- Generate EXACTLY one image for each scene in ultra high quality ${visualStyle} style\n`;
    promptForPython += `- Each image should focus on the primary action of the scene - the most informative moment\n`;
    promptForPython += `- Ensure you generate meaningful visual for understanding what's happening in the story\n`;
    promptForPython += `- Each image should be instantly understandable with rich visual storytelling\n`;
    promptForPython += `- Maintain consistent character appearance between scenes\n`;
    promptForPython += `- Use composition to focus on the key elements of each scene\n`;
    promptForPython += `- Create image for scene when that scene is viewed together as a cohesive visual narrative \n\n`;
    
    // Add the scenes
    promptForPython += `SCENES TO ILLUSTRATE:\n\n${sceneDescriptions}`;
      
    // Find the Python script
    const scriptPath = path.join(pythonScriptsDir, 'generate_images.py');
    if (!fs.existsSync(scriptPath)) {
      throw new Error('Python script not found at: ' + scriptPath);
    }
    
    console.log(`Executing Python script for image generation...`);
    
    // Make sure the output directory exists
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Use the Python virtual environment if it exists
    const venvPython = fs.existsSync(path.join(__dirname, 'venv/bin/python')) ? 
      path.join(__dirname, 'venv/bin/python') : 
      fs.existsSync(path.join(__dirname, '../venv/bin/python')) ? 
      path.join(__dirname, '../venv/bin/python') : 'python3';
    
    // Create a promise to handle the Python script execution
    const pythonResult = await new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      
      // Spawn the Python process
      const pythonProcess = spawn(venvPython, [
        scriptPath,
        promptForPython,
        outputDir,
        storyId
      ]);
      
      // Handle stdout
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('Python stdout:', data.toString());
      });
      
      // Handle stderr
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('Python stderr:', data.toString());
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}\nStderr: ${stderr}`));
          return;
        }
        
        // Try to find the JSON result in stdout
        const markerPrefix = "JSON_RESULT_MARKER:";
        const lines = stdout.trim().split('\n');
        
        // Look for the marker to find the JSON result line
        let jsonLine = null;
        for (const line of lines) {
          if (line.startsWith(markerPrefix)) {
            jsonLine = line.substring(markerPrefix.length).trim();
            break;
          }
        }
        
        // If no marker found, try the last line as a fallback
        if (!jsonLine) {
          console.warn('JSON_RESULT_MARKER not found in Python output, trying last line');
          jsonLine = lines[lines.length - 1];
        }
        
        if (jsonLine && (jsonLine.startsWith('{') || jsonLine.includes('{'))) {
          try {
            const pythonResults = JSON.parse(jsonLine);
            resolve(pythonResults);
          } catch (jsonError) {
            reject(new Error(`Failed to parse JSON result: ${jsonError.message}`));
          }
        } else {
          reject(new Error('Could not find valid JSON result in Python output'));
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
    
    // Sort results by scene number if needed
    if (pythonResult.images) {
      pythonResult.images.sort((a, b) => a.sceneNumber - b.sceneNumber);
    }
    
    return pythonResult;
    
  } catch (error) {
    console.error(`Error generating story images:`, error);
    
    // Create placeholder images for all scenes in case of error
    const results = [];
    const failedScenes = [];
    
    for (const scene of scenes) {
      const sceneNumber = scene.sceneNumber || parseInt(scene.id) || scenes.indexOf(scene) + 1;
      failedScenes.push(sceneNumber);
      
      // Create a placeholder image
      const placeholderPath = path.join(__dirname, 'assets', 'placeholder.png');
      const fileName = `${storyId}_scene_${sceneNumber}_error.png`;
      const filePath = path.join(outputDir, fileName);
      
      // Copy the placeholder image or create a tiny one
      if (fs.existsSync(placeholderPath)) {
        fs.copyFileSync(placeholderPath, filePath);
      } else {
        const base64Placeholder = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
        fs.writeFileSync(filePath, Buffer.from(base64Placeholder, 'base64'));
      }
      
      results.push({
        sceneNumber,
        imageUrl: `/generated-images/${fileName}`,
        success: false,
        error: error.message || 'Failed to generate images'
      });
    }
    
    // Sort results by scene number
    const sortedResults = [...results].sort((a, b) => a.sceneNumber - b.sceneNumber);
    
    return {
      success: false,
      images: sortedResults,
      failedScenes,
      error: error.message
    };
  }
}

// Export the functions for use in other modules
export {
  generateStoryImages
}; 