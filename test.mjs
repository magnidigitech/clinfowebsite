import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aeidiioojdtcmyhifpny.supabase.co";
const supabaseAnonKey = "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.storage.from("clinformatiq").download("siteState.json");
  if (error) {
    console.error("Error downloading:", error);
  } else {
    const text = await data.text();
    console.log("Success. File size:", text.length, "bytes");
    console.log("Snippet:", text.substring(0, 100));
  }
}
test();
