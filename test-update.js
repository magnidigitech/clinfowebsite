import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  console.log("Downloading current state...");
  const { data: dlData, error: dlError } = await supabase.storage.from('clinformatiq').download('siteState.json');
  if (dlError) {
    console.error("Download error:", dlError);
    return;
  }
  
  const text = await dlData.text();
  const state = JSON.parse(text);
  
  console.log("Current footerYoutube:", state.siteContent.footerYoutube);
  
  state.siteContent.footerYoutube = "https://www.youtube.com/@clinformatiq_TEST_UPDATE_" + Date.now();
  
  console.log("Uploading updated state...");
  const file = new Blob([JSON.stringify(state)], { type: "application/json" });
  
  const { data, error } = await supabase.storage
    .from('clinformatiq')
    .upload('siteState.json', file, { upsert: true });

  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Update success:", data);
  }
}

testUpdate();
