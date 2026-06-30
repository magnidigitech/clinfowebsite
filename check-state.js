import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkState() {
  const { data, error } = await supabase.storage.from('clinformatiq').download('siteState.json');
  if (error) {
    console.error("Error downloading:", error);
    return;
  }
  const text = await data.text();
  console.log("Current state in Supabase:", text.substring(0, 500) + "...");
}

checkState();
