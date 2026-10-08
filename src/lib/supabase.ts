import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('https://') &&
  !/your-|placeholder/i.test(supabaseUrl) &&
  !/your-|placeholder/i.test(supabasePublishableKey)
);

// Local demo identities are for development only. A production deployment must
// fail closed if its Supabase authentication settings are missing.
export const isDevelopmentDemoMode = import.meta.env.DEV && !isSupabaseConfigured;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key'
);
