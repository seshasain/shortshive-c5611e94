import { supabase } from '@/lib/auth';

export interface SavedStoryData {
  id: string;
  story_id: string;
  status: 'DRAFT' | 'COMPLETED';
  generation_state?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Save a story
export const saveStory = async (
  storyId: string, 
  generationState: any,
  notes?: string
): Promise<{ data: SavedStoryData | null; error: Error | null }> => {
  try {
    // First check if a saved story with this story_id already exists
    const { data: existingData, error: checkError } = await supabase
      .from('saved_stories')
      .select('id')
      .eq('story_id', storyId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    let result;
    
    if (existingData) {
      // If it exists, update it
      console.log('Updating existing saved story for story_id:', storyId);
      result = await supabase
        .from('saved_stories')
        .update({
          status: 'DRAFT',
          generation_state: generationState,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('story_id', storyId)
        .select()
        .single();
    } else {
      // If it doesn't exist, insert a new record
      console.log('Creating new saved story for story_id:', storyId);
      result = await supabase
        .from('saved_stories')
        .insert({
          story_id: storyId,
          status: 'DRAFT',
          generation_state: generationState,
          notes
        })
        .select()
        .single();
    }
    
    if (result.error) throw result.error;
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error saving story:', error);
    return { data: null, error: error as Error };
  }
};

// Check if a story was saved
export const checkSavedStory = async (
  storyId: string
): Promise<{ data: SavedStoryData | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('saved_stories')
      .select(`
        *,
        story:stories(*)
      `)
      .eq('story_id', storyId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error checking saved story:', error);
    return { data: null, error: error as Error };
  }
};

// Resume a saved story
export const resumeSavedStory = async (
  storyId: string
): Promise<{ data: { generationState: any; story: any } | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('saved_stories')
      .select(`
        generation_state,
        story:stories(*)
      `)
      .eq('story_id', storyId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No saved story found');

    return { 
      data: {
        generationState: data.generation_state,
        story: data.story
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error resuming saved story:', error);
    return { data: null, error: error as Error };
  }
}; 