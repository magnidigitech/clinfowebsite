import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function checkPolicies() {
  // Test each operation individually
  console.log("=== Testing SELECT (download) ===");
  const { data: dl, error: dlErr } = await supabase.storage.from("clinformatiq").download("siteState.json");
  console.log(dlErr ? "✗ BLOCKED: " + dlErr.message : "✓ Allowed");

  console.log("\n=== Testing INSERT (upload new file) ===");
  const testFile = new Blob(["test"], { type: "text/plain" });
  const { error: insErr } = await supabase.storage.from("clinformatiq").upload("_rls_test_" + Date.now() + ".txt", testFile);
  console.log(insErr ? "✗ BLOCKED: " + insErr.message : "✓ Allowed");

  console.log("\n=== Testing UPDATE (upsert existing) ===");
  const { error: updErr } = await supabase.storage.from("clinformatiq").upload("siteState.json", testFile, { upsert: true });
  console.log(updErr ? "✗ BLOCKED: " + updErr.message : "✓ Allowed");

  console.log("\n=== Testing DELETE ===");
  const { error: delErr } = await supabase.storage.from("clinformatiq").remove(["siteState.json"]);
  console.log(delErr ? "✗ BLOCKED: " + delErr.message : "✓ Allowed (or no error returned)");
  
  // Verify if delete actually worked
  const { data: dl2, error: dl2Err } = await supabase.storage.from("clinformatiq").download("siteState.json");
  console.log("File still exists after delete?", dl2 ? "YES (delete didn't work)" : "NO (delete worked)");
}
checkPolicies();
