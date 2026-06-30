import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log("Uploading test file...");
  const { data, error } = await supabase.storage
    .from('clinformatiq')
    .upload('test.txt', 'hello world', { upsert: true });

  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Upload success:", data);
  }
}

testUpload();
