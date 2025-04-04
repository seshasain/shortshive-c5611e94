import { supabase } from '@/lib/supabase';

export interface SavedStoryData {
  id: string;
  storyId: string;
  status: 'DRAFT' | 'COMPLETED';
  generationState?: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Save a story
export const saveStory = async (
  storyId: string, 
  generationState: any,
  notes?: string
): Promise<{ data: SavedStoryData | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('saved_stories')
      .upsert({
        storyId,
        status: 'DRAFT',
        generationState,
        notes,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
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
      .eq('storyId', storyId)
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
        generationState,
        story:stories(*)
      `)
      .eq('storyId', storyId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No saved story found');

    return { 
      data: {
        generationState: data.generationState,
        story: data.story
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error resuming saved story:', error);
    return { data: null, error: error as Error };
  }
}; 