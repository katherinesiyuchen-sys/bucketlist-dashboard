import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Service role key bypasses RLS — only used server-side
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
