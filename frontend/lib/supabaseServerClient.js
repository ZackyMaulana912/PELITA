// Client Supabase untuk Server Component (halaman publik yang hanya membaca).
// Tidak menyimpan sesi karena halaman publik tidak butuh login sama sekali.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function createServerClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}
