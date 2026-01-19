import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Auto-detect if we should use local data (when credentials are missing)
export const USE_LOCAL_DATA = !supabaseUrl || !supabaseAnonKey;

if (USE_LOCAL_DATA) {
  console.log('Supabase credentials not found, using local data');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
