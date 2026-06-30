import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function checkDb() {
  console.log("=== Testing database tables ===");
  
  // Try querying common table names
  const tables = ["site_state", "site_content", "settings", "content", "state"];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        console.log(`Table '${table}':`, error.message);
      } else {
        console.log(`Table '${table}': SUCCESS! Found:`, data);
      }
    } catch (err) {
      console.log(`Table '${table}': Exception -`, err.message);
    }
  }
}

checkDb();
