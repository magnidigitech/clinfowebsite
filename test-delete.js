import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
  console.log("Attempting to delete siteState.json...");
  
  const { data, error } = await supabase.storage
    .from('clinformatiq')
    .remove(['siteState.json']);

  if (error) {
    console.error("Delete error:", error);
  } else {
    console.log("Delete success:", data);
  }
}

testDelete();
