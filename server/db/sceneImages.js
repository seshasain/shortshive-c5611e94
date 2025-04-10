import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables for Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

/**
 * Create a new scene image record
 */
async function createSceneImage({ sceneId, storyId, localUrl, status = 'PROCESSING', errorMessage = null }) {
  try {
    console.log('Creating scene image:', {
      sceneId,
      storyId,
      localUrl,
      status
    });

    const { data, error } = await supabase
      .from('scene_images')
      .insert({
        scene_id: sceneId,
        story_id: storyId,
        local_url: localUrl,
        status: status,
        error_message: errorMessage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating scene image:', error);
      throw error;
    }

    console.log('Created scene image:', data);
    return data;
  } catch (error) {
    console.error('Error in createSceneImage:', error);
    throw error;
  }
}

/**
 * Update a scene image with B2 URL
 */
async function updateSceneImageWithB2Url({ sceneId, b2Url, status = 'COMPLETED' }) {
  try {
    console.log('Updating scene image with B2 URL:', {
      sceneId,
      b2Url,
      status
    });

    const { data, error } = await supabase
      .from('scene_images')
      .update({
        b2_url: b2Url,
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('scene_id', sceneId)
      .select()
      .single();

    if (error) {
      console.error('Error updating scene image with B2 URL:', error);
      throw error;
    }

    console.log('Updated scene image:', data);
    return data;
  } catch (error) {
    console.error('Error in updateSceneImageWithB2Url:', error);
    throw error;
  }
}

/**
 * Get all scene images for a story
 */
async function getSceneImagesForStory(storyId) {
  try {
    console.log('Getting scene images for story:', storyId);

    const { data, error } = await supabase
      .from('scene_images')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error getting scene images:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} scene images for story ${storyId}`);
    return data;
  } catch (error) {
    console.error('Error in getSceneImagesForStory:', error);
    throw error;
  }
}

/**
 * Update scene image status
 */
async function updateSceneImageStatus({ sceneId, status, errorMessage = null }) {
  try {
    console.log('Updating scene image status:', {
      sceneId,
      status,
      errorMessage
    });

    const { data, error } = await supabase
      .from('scene_images')
      .update({
        status: status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('scene_id', sceneId)
      .select()
      .single();

    if (error) {
      console.error('Error updating scene image status:', error);
      throw error;
    }

    console.log('Updated scene image status:', data);
    return data;
  } catch (error) {
    console.error('Error in updateSceneImageStatus:', error);
    throw error;
  }
}

/**
 * Delete scene images for a story
 */
async function deleteSceneImagesForStory(storyId) {
  try {
    console.log(`Deleting scene images for story ${storyId}`);

    // First get all scene images to log what we're deleting
    const { data: existingImages, error: fetchError } = await supabase
      .from('scene_images')
      .select('*')
      .eq('story_id', storyId);

    if (fetchError) {
      console.error('Error fetching existing scene images:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${existingImages?.length || 0} scene images to delete`);

    // Delete the scene images
    const { error: deleteError } = await supabase
      .from('scene_images')
      .delete()
      .eq('story_id', storyId);

    if (deleteError) {
      console.error('Error deleting scene images:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully deleted ${existingImages?.length || 0} scene images for story ${storyId}`);
    return true;
  } catch (error) {
    console.error(`Error in deleteSceneImagesForStory for story ${storyId}:`, error);
    throw error;
  }
}

export {
  createSceneImage,
  updateSceneImageWithB2Url,
  updateSceneImageStatus,
  getSceneImagesForStory,
  deleteSceneImagesForStory
}; 