// Script to create login_activity table directly using Supabase client
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vclwjhwmojestmbjttto.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing Supabase service role key in environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createLoginActivityTable = async () => {
  console.log('Creating login_activity table...');

  try {
    // Create the login_activity table
    const { error: tableError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.login_activity (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          ip_address TEXT,
          device_type TEXT,
          device_name TEXT,
          location TEXT,
          last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          is_current BOOLEAN DEFAULT false,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });

    if (tableError) {
      console.error('Error creating login_activity table:', tableError);
      return;
    }

    // Add trigger for updated_at
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE OR REPLACE TRIGGER update_login_activity_updated_at
        BEFORE UPDATE ON public.login_activity
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at();
      `
    });

    if (triggerError) {
      console.error('Error creating update trigger:', triggerError);
      return;
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql: `ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;`
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
      return;
    }

    // Create RLS policies
    const policiesSql = [
      `
        CREATE POLICY "Users can view own login activity"
        ON public.login_activity FOR SELECT
        USING (auth.uid() = user_id);
      `,
      `
        CREATE POLICY "Users can create login activity records"
        ON public.login_activity FOR INSERT
        WITH CHECK (auth.uid() = user_id);
      `,
      `
        CREATE POLICY "Users can update own login activity"
        ON public.login_activity FOR UPDATE
        USING (auth.uid() = user_id);
      `,
      `
        CREATE POLICY "Users can delete own login activity"
        ON public.login_activity FOR DELETE
        USING (auth.uid() = user_id);
      `
    ];

    for (const policySql of policiesSql) {
      const { error: policyError } = await supabase.rpc('execute_sql', { sql: policySql });
      if (policyError) {
        console.error('Error creating policy:', policyError);
      }
    }

    // Create indexes
    const indexesSql = [
      `CREATE INDEX IF NOT EXISTS idx_login_activity_user_id ON public.login_activity(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_login_activity_last_accessed ON public.login_activity(last_accessed);`
    ];

    for (const indexSql of indexesSql) {
      const { error: indexError } = await supabase.rpc('execute_sql', { sql: indexSql });
      if (indexError) {
        console.error('Error creating index:', indexError);
      }
    }

    console.log('Login activity table created successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Run the function
createLoginActivityTable().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 