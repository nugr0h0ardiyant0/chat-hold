// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://abwtufgltoxcwatykksm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid3R1ZmdsdG94Y3dhdHlra3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDU2NDksImV4cCI6MjA2NzYyMTY0OX0.ar9FtoofpXD9qfHBXlKJcF0IIF1wzvVXnEMNjKaqJEM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});