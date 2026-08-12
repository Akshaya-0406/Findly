import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Detect if the user has inputted actual credentials instead of placeholders
export const isSupabaseConfigured = 
  supabaseUrl !== "" && 
  supabaseUrl !== "your-supabase-project-url" && 
  supabaseAnonKey !== "" && 
  supabaseAnonKey !== "your-supabase-anon-key";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
