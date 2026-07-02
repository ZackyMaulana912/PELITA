// Client Supabase untuk Client Component (berjalan di browser).
// Memakai publishable key yang memang aman berada di sisi klien.
// Keamanan tulis data ditegakkan oleh Row Level Security, bukan file ini.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
