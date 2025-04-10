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

async function listSceneNumbers() {
  try {
    const { data, error } = await supabase
      .from('scenes')
      .select('scene_number, story_id')
      .order('scene_number');

    if (error) {
      console.error('Error fetching scenes:', error);
      return;
    }

    console.log('Available scene numbers by story:');
    const scenesByStory = {};
    data.forEach(scene => {
      if (!scenesByStory[scene.story_id]) {
        scenesByStory[scene.story_id] = [];
      }
      scenesByStory[scene.story_id].push(scene.scene_number);
    });

    for (const [storyId, numbers] of Object.entries(scenesByStory)) {
      console.log(`Story ${storyId}: Scene numbers ${numbers.join(', ')}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listSceneNumbers(); 