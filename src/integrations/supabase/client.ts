// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vclwjhwmojestmbjttto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbHdqaHdtb2plc3RtYmp0dHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTc0NDUsImV4cCI6MjA1OTM3MzQ0NX0.vqniiRARYvLfOImRYE23RwSjRU51ZeRC-gGc21YzTBI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);