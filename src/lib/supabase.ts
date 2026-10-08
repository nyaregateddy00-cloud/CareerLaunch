import { createClient } from '@supabase/supabase-js';

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseUrl = configuredSupabaseUrl && configuredSupabaseUrl.startsWith('https://') && !/your-|placeholder/i.test(configuredSupabaseUrl)
  ? configuredSupabaseUrl
  : '';
const supabasePublishableKey = [
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
].map((key) => key?.trim()).find((key) => Boolean(key) && !/your-|placeholder/i.test(key || '')) || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  /^https:\/\//i.test(supabaseUrl)
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
