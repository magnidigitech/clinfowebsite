import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function test() {
  const { data, error } = await supabase.storage.from("clinformatiq").download("siteState.json");
  if (error) { console.error("Error:", error); return; }
  const text = await data.text();
  const state = JSON.parse(text);
  console.log("=== CAREERS ===");
  console.log(JSON.stringify(state.careerListings, null, 2));
  console.log("\n=== AFFILIATED INSTITUTES ===");
  console.log(JSON.stringify(state.affiliatedInstitutes, null, 2));
  console.log("\n=== TEAM MEMBERS ===");
  console.log(JSON.stringify(state.teamMembers, null, 2));
  console.log("\n=== DOCUMENTS ===");
  console.log(JSON.stringify(state.documents, null, 2));
  console.log("\n=== HERO VIDEO ===");
  console.log(state.siteContent?.heroVideoId);
  console.log("\n=== VIDEOS ===");
  console.log(JSON.stringify(state.siteContent?.videos, null, 2));
  console.log("\n=== FOOTER LINKS ===");
  console.log("YouTube:", state.siteContent?.footerYoutube);
  console.log("Instagram:", state.siteContent?.footerInstagram);
  console.log("Facebook:", state.siteContent?.footerFacebook);
  fs.writeFileSync("current_state.json", JSON.stringify(state, null, 2));
  console.log("\nFull state saved to current_state.json");
}
test();
