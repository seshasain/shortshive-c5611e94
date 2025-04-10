import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import AWS from 'aws-sdk';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Import the image generator module
import * as imageGenerator from './imageGenerator.js';
import storyRefiner from './storyRefiner.js';
import { createSceneImage, updateSceneImageWithB2Url, updateSceneImageStatus, getSceneImagesForStory, deleteSceneImagesForStory } from './db/sceneImages.js';

dotenv.config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables for Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, 'output');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}

// Configure Backblaze B2 (using AWS S3 compatible API)
const b2 = new AWS.S3({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  accessKeyId: process.env.B2_ACCESS_KEY_ID,
  secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: 'us-east-005'
});

// Define B2 bucket name from environment variable
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || 'shortshive';

// Validate B2 configuration
if (!B2_BUCKET_NAME) {
  console.error('B2_BUCKET_NAME environment variable is not set');
  process.exit(1);
}

if (!process.env.B2_ACCESS_KEY_ID || !process.env.B2_SECRET_ACCESS_KEY) {
  console.error('B2 credentials are not properly configured');
  process.exit(1);
}

// Test B2 connection with better error handling
b2.listObjectsV2({ Bucket: B2_BUCKET_NAME, MaxKeys: 1 }).promise()
  .then(() => {
    console.log('Successfully connected to B2');
    console.log('B2 configuration loaded:', {
      bucket: B2_BUCKET_NAME,
      endpoint: 'https://s3.us-east-005.backblazeb2.com',
      region: 'us-east-005'
    });
  })
  .catch(error => {
    console.error('Failed to connect to B2:', error);
    console.error('Please verify your B2 configuration:');
    console.error('1. Check if the bucket name is correct');
    console.error('2. Verify the application key has the necessary permissions');
    console.error('3. Ensure the endpoint URL is correct for your region');
    console.error('4. Make sure the bucket exists and is accessible');
    // Don't exit to allow local fallback
    console.warn('Will continue with local file storage as fallback');
  });

const app = express();
const port = process.env.PORT || 3000;

// In-memory store for currently processing animations
const currentlyProcessingStories = {};

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Serve static files from the output directory
app.use('/generated-images', express.static(outputDir));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
    console.log('Health check accessed at:', new Date().toISOString());
    return res.status(200).json({
        status: 'running',
        message: 'Server is up and running',
        timestamp: new Date().toISOString()
    });
});

// Animation generation endpoint
app.post('/api/generate-animation', async (req, res) => {
    console.log('Animation generation requested', req.body);
    let story_id, storyData;

    try {
        // Handle both input formats
        if (req.body.input) {
            story_id = req.body.input;
            console.log('Fetching story data for ID:', story_id);
            
            // Fetch story data from database
            const { data: story, error: storyError } = await supabase
                .from('stories')
                .select(`
                    *,
                    scenes (
                        id,
                        scene_number,
                        duration_estimate,
                        visual_description,
                        dialogue_or_narration,
                        text
                    )
                `)
                .eq('id', story_id)
                .single();

            if (storyError) {
                console.error('Error fetching story:', storyError);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to fetch story data',
                    details: storyError.message
                });
            }

            if (!story) {
                return res.status(404).json({
                    success: false,
                    error: 'Story not found'
                });
            }

            if (!story.scenes || story.scenes.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Story has no scenes'
                });
            }

            // Transform database story into expected format
            storyData = {
                title: story.title,
                description: story.description,
                scenes: story.scenes
                    .sort((a, b) => a.scene_number - b.scene_number)
                    .map(scene => ({
                        sceneNumber: scene.scene_number,
                        durationEstimate: scene.duration_estimate,
                        visualDescription: scene.visual_description,
                        dialogueOrNarration: scene.dialogue_or_narration,
                        text: scene.text
                    }))
            };

            console.log('Transformed story data:', {
                title: storyData.title,
                sceneCount: storyData.scenes.length,
                scenes: storyData.scenes.map(s => ({
                    number: s.sceneNumber,
                    duration: s.durationEstimate
                }))
            });
        } else {
            // Original format
            ({ story_id, storyData } = req.body);
        }

        if (!story_id) {
            return res.status(400).json({
                success: false,
                error: 'Story ID is required'
            });
        }

        if (!storyData || !storyData.scenes || !Array.isArray(storyData.scenes) || storyData.scenes.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Story must have at least one scene'
            });
        }

        console.log('Processing story:', {
            story_id,
            title: storyData.title,
            numScenes: storyData.scenes.length
        });

        // Validate scene data
        if (storyData.scenes.length > 20) {
            return res.status(400).json({
                success: false,
                error: 'Story has too many scenes (maximum 20)'
            });
        }

        // Verify that all scenes exist in the database
        const { data: dbScenes, error: scenesError } = await supabase
            .from('scenes')
            .select('id, scene_number')
            .eq('story_id', story_id)
            .order('scene_number');

        if (scenesError) {
            console.error('Error fetching scenes:', scenesError);
            return res.status(500).json({
                success: false,
                error: 'Failed to verify scenes'
            });
        }

        // Create a mapping of scene numbers to scene IDs
        const sceneIdMap = {};
        dbScenes.forEach(scene => {
            // Always convert scene_number to string for consistent comparison
            sceneIdMap[String(scene.scene_number)] = scene.id;
        });

        // Validate that all required scenes exist
        const missingScenes = [];
        storyData.scenes.forEach((scene, index) => {
            const sceneNumber = String(index + 1);
            if (!sceneIdMap[sceneNumber]) {
                missingScenes.push(sceneNumber);
                console.error(`Missing scene ${sceneNumber}. Available mappings:`, sceneIdMap);
            }
        });

        if (missingScenes.length > 0) {
            console.error('Missing scenes:', missingScenes);
            console.error('Available scene mappings:', JSON.stringify(sceneIdMap, null, 2));
            console.error('All scenes:', JSON.stringify(dbScenes, null, 2));
            return res.status(400).json({
                success: false,
                error: `Missing scenes in database: ${missingScenes.join(', ')}`
            });
        }

        // Track this story in our processing list
        currentlyProcessingStories[story_id] = {
            startTime: new Date(),
            totalScenes: storyData.scenes.length,
            completedScenes: 0,
            status: 'processing',
            sceneIdMap  // Add the mapping to the processing state
        };

        // Call the image generator function with complete story data and scene mapping
        const result = await imageGenerator.generateStoryImages(story_id, {
            ...storyData,
            sceneIdMap
        });

        // Update the story status
        if (result.success) {
            currentlyProcessingStories[story_id].status = 'complete';
            currentlyProcessingStories[story_id].completedScenes = result.images.length;

            try {
                // Create scene image records for successful generations
                for (const image of result.images) {
                    const sceneNumber = String(image.sceneNumber);
                    const sceneId = sceneIdMap[sceneNumber];

                    if (!sceneId) {
                        console.error(`No scene ID found for scene number ${sceneNumber}. Available mappings:`,
                            Object.entries(sceneIdMap).map(([num, id]) => ({
                                sceneNumber: num,
                                sceneId: id,
                                imageSceneNumber: image.sceneNumber
                            }))
                        );
                        continue;
                    }

                    console.log(`Processing scene ${sceneNumber} with ID ${sceneId}`);
                    await createSceneImage({
                        sceneId,
                        storyId: story_id,
                        localUrl: image.imageUrl,
                        status: 'COMPLETED'
                    });
                }

                return res.json({
                    success: true,
                    message: `Successfully generated ${result.images.length} images`,
                    images: result.images.map(img => ({
                        ...img,
                        sceneId: sceneIdMap[String(img.sceneNumber)]
                    }))
                });

            } catch (dbError) {
                console.error('Database error while creating scene images:', dbError);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to save scene images to database',
                    details: dbError.message
                });
            }
        } else {
            currentlyProcessingStories[story_id].status = 'error';
            currentlyProcessingStories[story_id].error = result.error;

            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to generate animation'
            });
        }
    } catch (error) {
        console.error('Error in animation generation:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

// Animation status check endpoint
app.get('/api/animation-status/:storyId', async (req, res) => {
  const { storyId } = req.params;
  
  if (!storyId) {
    return res.status(400).json({
      success: false,
      error: 'Story ID is required'
    });
  }
  
  try {
    // Get scene images from database
    const sceneImages = await getSceneImagesForStory(storyId);
    
    if (sceneImages && sceneImages.length > 0) {
      // Format images for response
      const formattedImages = sceneImages.map(image => ({
        sceneNumber: parseInt(image.scene_id),
        imageUrl: image.b2_url || image.local_url,
        b2Url: image.b2_url,
        status: image.status
      }));
      
      // Calculate progress
      const completedScenes = formattedImages.filter(img => img.status === 'COMPLETED').length;
      const totalScenes = currentlyProcessingStories[storyId]?.totalScenes || formattedImages.length;
      const progress = Math.min(90, Math.round((completedScenes / totalScenes) * 100));
      
      // Determine overall status
      const isComplete = completedScenes >= totalScenes;
      const hasErrors = formattedImages.some(img => img.status === 'FAILED');
      const status = isComplete ? 'complete' : hasErrors ? 'error' : 'processing';
      
      return res.status(200).json({
        success: true,
        status,
        progress: isComplete ? 100 : progress,
        images: formattedImages,
        storageType: formattedImages.some(img => img.b2Url) ? 'b2' : 'local',
        message: isComplete
          ? `Found ${completedScenes} generated images`
          : `Generation in progress: ${completedScenes} of ${totalScenes} scenes generated`
      });
    }
    
    // If no images found in database, return processing status
    return res.status(200).json({
      success: true,
      status: 'processing',
      progress: 0,
      images: [],
      message: 'Animation generation has not started yet'
    });
    
  } catch (error) {
    console.error('Error checking animation status:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Story Refinement endpoint
app.post('/api/refine-story', async (req, res) => {
    try {
        const { storyContent, settings, userId } = req.body;
        
        if (!storyContent) {
            console.error('No story content provided in request');
            return res.status(400).json({ 
                success: false, 
                error: 'No story content provided',
                details: 'Story content is required to generate a refined story'
            });
        }

        if (!settings || !settings.duration) {
            console.error('Invalid settings provided:', settings);
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid settings provided',
                details: 'Duration and other story settings are required'
            });
        }

        if (!userId) {
            console.error('No userId provided in request');
            return res.status(400).json({ 
                success: false, 
                error: 'User ID is required',
                details: 'Authentication is required to refine stories'
            });
        }

        const wordCount = Math.floor(settings.duration * 2.5);
        const recommendedSceneCount = Math.max(5, Math.ceil(settings.duration / 10));
        const storyComplexity = settings.duration <= 30 ? "simple" : 
                               settings.duration <= 60 ? "moderate" : 
                               settings.duration <= 90 ? "detailed" : "complex";
        
        console.log(`Refining story with settings:`, {
            wordCount,
            recommendedSceneCount,
            storyComplexity,
            settings
        });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'ShortShive Story Generator'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-thinking-exp-1219:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a creative story writer specializing in short-form content. You excel at creating structured, well-formatted JSON responses.'
                    },
                    {
                        role: 'user',
                        content: `Create a "${settings.emotion || 'engaging'}" story based on this prompt: "${storyContent}" with approximately ${wordCount} words.

Each scene should be roughly 10-15 seconds in duration. Create separate scenes for distinct activities.

Return the story in this exact JSON format:
{
  "title": "Story title here",
  "logline": "One-line summary of the story",
  "settings": {
    "emotion": "${settings.emotion || 'engaging'}",
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
}`
                    }
                ],
                temperature: 1,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenRouter API error:', errorData);
            throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        console.log('OpenRouter API response:', result);

        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            console.error('Invalid response format from OpenRouter:', result);
            throw new Error('Invalid response from story generation service');
        }

        const storyText = result.choices[0].message.content;
        
        try {
            console.log('Raw response content:', storyText);
            
            // Find the first opening brace and last closing brace
            const firstBrace = storyText.indexOf('{');
            const lastBrace = storyText.lastIndexOf('}');
            
            console.log('JSON boundaries found:', { firstBrace, lastBrace });
            
            if (firstBrace === -1 || lastBrace === -1) {
                throw new Error('Invalid JSON structure in response');
            }
            
            // Extract the JSON string and replace special quotes with regular quotes
            let jsonString = storyText.substring(firstBrace, lastBrace + 1);
            jsonString = jsonString.replace(/[""]/g, '"');
            
            console.log('Sanitized JSON string:', jsonString);
            
            // Try to parse the extracted JSON
            const parsedResponse = JSON.parse(jsonString);
            
            // Validate the required fields
            if (!parsedResponse.title || !parsedResponse.scenes || !Array.isArray(parsedResponse.scenes)) {
                throw new Error('Invalid story structure: missing required fields');
            }

            try {
                // First check if a story with this title already exists for the user
                const { data: existingStory, error: existingStoryError } = await supabase
                    .from('stories')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('title', parsedResponse.title)
                    .single();

                let story;
                if (existingStory) {
                    // Update existing story
                    const { data: updatedStory, error: updateError } = await supabase
                        .from('stories')
                        .update({
                            description: parsedResponse.logline,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingStory.id)
                        .select()
                        .single();

                    if (updateError) {
                        console.error('Error updating story:', updateError);
                        return res.status(500).json({
                            success: false,
                            error: 'Failed to update story',
                            details: updateError.message
                        });
                    }
                    story = updatedStory;

                    // Delete existing scenes
                    const { error: deleteError } = await supabase
                        .from('scenes')
                        .delete()
                        .eq('story_id', story.id);

                    if (deleteError) {
                        console.error('Error deleting existing scenes:', deleteError);
                        return res.status(500).json({
                            success: false,
                            error: 'Failed to update scenes',
                            details: deleteError.message
                        });
                    }
                } else {
                    // Create new story
                    const { data: newStory, error: storyError } = await supabase
                        .from('stories')
                        .insert({
                            title: parsedResponse.title,
                            description: parsedResponse.logline,
                            user_id: userId
                        })
                        .select()
                        .single();

                    if (storyError) {
                        console.error('Error creating story:', storyError);
                        return res.status(500).json({
                            success: false,
                            error: 'Failed to create story',
                            details: storyError.message
                        });
                    }
                    story = newStory;
                }

                // Create scenes for the story
                try {
                    // Sort scenes by scene number and reindex them sequentially
                    const sortedScenes = [...parsedResponse.scenes]
                        .sort((a, b) => a.sceneNumber - b.sceneNumber)
                        .map((scene, index) => ({
                            ...scene,
                            sceneNumber: index + 1
                        }));
                    
                    console.log('Processing scenes for story:', story.id);
                    console.log('Scene count:', sortedScenes.length);
                    console.log('Scene numbers:', sortedScenes.map(s => s.sceneNumber));
                    
                    // First, check if we already have scenes
                    const { data: existingScenes, error: checkError } = await supabase
                        .from('scenes')
                        .select('id, scene_number')
                        .eq('story_id', story.id);
                        
                    if (checkError) {
                        console.error('Error checking existing scenes:', checkError);
                        throw checkError;
                    }
                    
                    console.log('Existing scenes:', existingScenes?.length || 0);
                    
                    // If we have existing scenes, delete them first
                    if (existingScenes?.length > 0) {
                        const { error: deleteError } = await supabase
                            .from('scenes')
                            .delete()
                            .eq('story_id', story.id);
                            
                        if (deleteError) {
                            console.error('Error deleting existing scenes:', deleteError);
                            throw deleteError;
                        }
                        
                        console.log('Deleted existing scenes');
                        
                        // Wait a moment for deletion to propagate
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    
                    // Start a Supabase transaction
                    const { data: result, error: transactionError } = await supabase.rpc('manage_story_scenes', {
                        p_story_id: story.id,
                        p_scenes_data: sortedScenes.map(scene => ({
                            story_id: story.id,
                            scene_number: scene.sceneNumber,
                            duration_estimate: scene.durationEstimate || 10,
                            visual_description: scene.visualDescription,
                            dialogue_or_narration: scene.dialogueOrNarration,
                            text: scene.text || ''
                        }))
                    });

                    if (transactionError) {
                        console.error('Transaction error:', JSON.stringify({
                            message: transactionError.message,
                            details: transactionError.details,
                            hint: transactionError.hint,
                            code: transactionError.code
                        }, null, 2));
                        throw transactionError;
                    }

                    // Get the newly created scenes
                    const { data: scenes, error: scenesError } = await supabase
                        .from('scenes')
                        .select('*')
                        .eq('story_id', story.id)
                        .order('scene_number');

                    if (scenesError) {
                        console.error('Error fetching created scenes:', scenesError);
                        throw scenesError;
                    }

                    // Create scene mapping with consistent string keys
                    const sceneIdMap = {};
                    scenes.forEach(scene => {
                        const sceneNumber = String(scene.scene_number);
                        sceneIdMap[sceneNumber] = scene.id;
                        console.log(`Mapping scene ${sceneNumber} to ID ${scene.id}`);
                    });

                    // Verify all scenes are mapped
                    const expectedSceneCount = sortedScenes.length;
                    const actualSceneCount = Object.keys(sceneIdMap).length;
                    
                    if (actualSceneCount !== expectedSceneCount) {
                        console.error('Scene mapping mismatch:', {
                            expected: expectedSceneCount,
                            actual: actualSceneCount,
                            sceneIdMap,
                            scenes: scenes.map(s => ({
                                id: s.id,
                                number: s.scene_number
                            }))
                        });
                        throw new Error(`Scene mapping mismatch: expected ${expectedSceneCount} scenes but got ${actualSceneCount}`);
                    }

                    // Log the scene mapping for debugging
                    console.log('Created scene mapping:', JSON.stringify({
                        storyId: story.id,
                        sceneCount: scenes.length,
                        mapping: sceneIdMap
                    }, null, 2));

                    // Store in saved_stories with verified mapping
                    await supabase
                        .from('saved_stories')
                        .upsert({
                            story_id: story.id,
                            status: 'DRAFT',
                            generation_state: {
                                ...parsedResponse,
                                sceneIdMap,
                                sceneCount: scenes.length
                            }
                        });

                    return res.json({
                        success: true,
                        data: {
                            ...story,
                            scenes,
                            settings: parsedResponse.settings,
                            sceneIdMap
                        }
                    });

                } catch (error) {
                    console.error('Error managing scenes:', error);
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to manage scenes',
                        details: error.message
                    });
                }
            } catch (error) {
                console.error('Error saving story to database:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to save story',
                    details: error.message
                });
            }
        } catch (error) {
            console.error('Error saving story to database:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to save story',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Story refinement error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to refine story'
        });
    }
});

app.listen(port)
    .on('listening', () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Health check endpoint: http://localhost:${port}/api/health`);
        console.log(`Animation generation endpoint: http://localhost:${port}/api/generate-animation`);
    })
    .on('error', error => {
        if (error.code === 'EADDRINUSE') {
            const newPort = port + 1;
            console.error(`Port ${port} is already in use, trying port ${newPort}...`);
            
            app.listen(newPort)
                .on('listening', () => {
                    console.log(`Server is running on alternate port ${newPort}`);
                    console.log(`Health check endpoint: http://localhost:${newPort}/api/health`);
                    console.log(`Animation generation endpoint: http://localhost:${newPort}/api/generate-animation`);
                })
                .on('error', alternateError => {
                    console.error('Server failed to start on alternate port:', alternateError);
                    process.exit(1);
                });
        } else {
            console.error('Server error:', error);
            process.exit(1);
        }
    }); 