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
 * @param {Object} storyData - Complete story data including title, logline, scenes, characters, etc.
 * @param {Object} adminRules - Optional rules for image generation
 * @returns {Promise<{success: boolean, images: Array, failedScenes: Array}>}
 */
async function generateStoryImages(storyId, storyData, adminRules = {}) {
  try {
    // Input validation
    if (!storyId || !storyData) {
      throw new Error('Story ID and storyData are required');
    }
    
    if (!storyData.scenes || !Array.isArray(storyData.scenes) || storyData.scenes.length === 0) {
      throw new Error('Story must have a non-empty scenes array');
    }
    
    const scenes = storyData.scenes;
    const visualSettings = storyData.visualSettings || {};
    
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

    // Extract key story elements
    const title = storyData.title || "Untitled Story";
    const logline = storyData.logline || "";
    let characters = [];

    // Properly extract characters from whatever format they might be in
    if (Array.isArray(storyData.characters) && storyData.characters.length > 0) {
      characters = storyData.characters;
    } else if (storyData.characters && typeof storyData.characters === 'object') {
      // Try to extract from non-array format
      characters = Object.values(storyData.characters).filter(c => c && (c.name || c.description));
    } else if (storyData.visualSettings && Array.isArray(storyData.visualSettings.characters)) {
      // Check if characters are in visualSettings
      characters = storyData.visualSettings.characters;
    }

    const emotion = storyData.settings?.emotion || "Neutral";

    // Log character data for debugging
    console.log(`Processing ${characters.length} characters:`, 
      characters.map(c => c.name || 'unnamed').join(', '));

    // Format the story data with clear sections and line breaks
    let promptForPython = `STORY: "${title}"\n\n`;

    if (logline) {
      promptForPython += `LOGLINE: ${logline}\n\n`;
    }

    if (storyData.settings) {
      promptForPython += `SETTINGS:\n`;
      for (const [key, value] of Object.entries(storyData.settings)) {
        promptForPython += `- ${key}: ${value}\n`;
      }
      promptForPython += `\n`;
    }

    // Enhanced character section
    if (characters && characters.length > 0) {
      promptForPython += `CHARACTERS:\n`;
      promptForPython += `The following characters must maintain 100% consistent appearance across all scenes:\n\n`;
      
      for (const character of characters) {
        // Handle potentially malformed character data
        const charName = character.name || 'Character';
        const charDesc = character.description || '';
        
        promptForPython += `CHARACTER: ${charName}\n`;
        promptForPython += `Description: ${charDesc}\n`;
        
        // If the description doesn't specifically mention physical traits, add default guidance
        if (!charDesc.toLowerCase().includes('wear') && 
            !charDesc.toLowerCase().includes('cloth') &&
            !charDesc.toLowerCase().includes('outfit')) {
          promptForPython += `Ensure consistent clothing/outfit across all scenes\n`;
        }
        
        if (!charDesc.toLowerCase().includes('hair') && 
            !charDesc.toLowerCase().includes('hairstyle')) {
          promptForPython += `Maintain consistent hairstyle across all scenes\n`;
        }
        
        promptForPython += `Maintain exact same facial features, body proportions, and characteristic details in every scene\n\n`;
      }
    } else {
      // If we still have no characters after checking multiple paths, add a default character
      promptForPython += `CHARACTERS: No explicit characters defined in the story. For any characters that appear in the scenes:\n`;
      promptForPython += `- Maintain consistent appearance across all scenes\n`;
      promptForPython += `- Keep the same clothing, hairstyle, and physical attributes in every scene\n`;
      promptForPython += `- Ensure facial features, body proportions, and colors remain identical\n\n`;
    }

    promptForPython += `SCENES:\n`;
    for (const scene of scenes) {
      promptForPython += `SCENE ${scene.sceneNumber || scenes.indexOf(scene) + 1}:\n`;
      promptForPython += `Duration: ${scene.durationEstimate || 10} seconds\n`;
      
      if (scene.visualDescription) {
        promptForPython += `Visual Description: ${scene.visualDescription}\n`;
      }
      
      if (scene.dialogueOrNarration) {
        promptForPython += `Dialogue/Narration: ${scene.dialogueOrNarration}\n`;
      }
      
      promptForPython += `\n`;
    }

    promptForPython += `ADMIN RULES:\n`;
    promptForPython += `- Generate EXACTLY one high-quality ${visualStyle} style image for each scene\n`;
    promptForPython += `- Create ultra-high-quality cinematic ${visualStyle} visuals for every scene\n`;
    promptForPython += `- Ensure you generate meaningful visuals that clearly depict what's happening in the story\n`;
    promptForPython += `- CRITICAL: Maintain 100% consistent character appearance across all scenes - same face, same clothing, same hairstyle, same colors\n`;
    promptForPython += `- Focus on the primary action described in each scene's visual description\n`;
    promptForPython += `- Create images that work together as a cohesive visual narrative\n`;

    console.log(`Created formatted prompt with ${promptForPython.length} characters`);

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
      ], {
        env: {
          ...process.env,
          GEMINI_API_KEY: apiKey
        }
      });
      
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
        const markerPrefix = "JSON_RESULT_MARKER";
        const lines = stdout.trim().split('\n');
        
        // Look for the marker to find the JSON result line
        let jsonLine = null;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line === markerPrefix && i + 1 < lines.length) {
            jsonLine = lines[i + 1];
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
    
    for (const scene of storyData.scenes) {
      const sceneNumber = scene.sceneNumber || parseInt(scene.id) || storyData.scenes.indexOf(scene) + 1;
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