import { createClient } from "@supabase/supabase-js";

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_anon_url = import.meta.env.VITE_SUPABASE_ANON_URL;
// console.log("supabase-urls", supabase_url, supabase_anon_url);

export const supabaseClient = createClient(supabase_url, supabase_anon_url)
