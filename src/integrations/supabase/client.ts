// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bvfncyjnhuvrkjixgiuc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Zm5jeWpuaHV2cmtqaXhnaXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDQxODYsImV4cCI6MjA1OTQyMDE4Nn0.TYtrlPptbZDqmkB4TmKMUf3h9SW1i-jp38IHi_BThQ8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);