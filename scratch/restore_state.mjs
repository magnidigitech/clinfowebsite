import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function restore() {
  console.log("Reading current_state.json...");
  const rawData = fs.readFileSync("current_state.json", "utf8");
  const file = new Blob([rawData], { type: "application/json" });

  console.log("Uploading to Supabase...");
  const { data, error } = await supabase.storage
    .from("clinformatiq")
    .upload("siteState.json", file, { upsert: true });

  if (error) {
    console.error("Error restoring state:", error);
  } else {
    console.log("Successfully restored siteState.json to Supabase:", data);
  }
}

restore();
