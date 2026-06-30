import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function checkAuth() {
  console.log("=== Testing Supabase Auth Login ===");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@clinformatiq.com",
      password: "clinformatiq123"
    });
    
    if (error) {
      console.log("Login error:", error.message);
    } else {
      console.log("Login SUCCESS! Session user:", data.user?.email);
      console.log("Testing upload/update/delete with authenticated user...");
      
      const testFile = new Blob(["test auth"], { type: "text/plain" });
      
      console.log("1. Testing UPDATE with auth...");
      const { data: upData, error: upErr } = await supabase.storage.from("clinformatiq").upload("siteState.json", testFile, { upsert: true });
      if (upErr) {
        console.log("✗ UPDATE blocked even when logged in:", upErr.message);
      } else {
        console.log("✓ UPDATE allowed when logged in!");
      }
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

checkAuth();
