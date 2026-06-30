import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function testSaveAndLoad() {
  // 1. Download current state
  console.log("=== Step 1: Download current state ===");
  const { data: dlData, error: dlError } = await supabase.storage.from("clinformatiq").download("siteState.json");
  if (dlError) { console.error("Download error:", dlError); return; }
  const currentText = await dlData.text();
  const currentState = JSON.parse(currentText);
  console.log("Current careers:", currentState.careerListings?.length);

  // 2. Modify state (remove one career as test)
  console.log("\n=== Step 2: Test save with upsert:true ===");
  const testState = { ...currentState };
  testState._testTimestamp = new Date().toISOString();
  
  const json = JSON.stringify(testState);
  const file = new Blob([json], { type: "application/json" });
  const { data: upData, error: upError } = await supabase.storage
    .from("clinformatiq")
    .upload("siteState.json", file, {
      cacheControl: 'no-cache, no-store, must-revalidate',
      upsert: true
    });
  
  if (upError) {
    console.error("UPLOAD ERROR:", upError);
    console.log("\nTrying delete + upload instead...");
    await supabase.storage.from("clinformatiq").remove(["siteState.json"]);
    const { data: up2Data, error: up2Error } = await supabase.storage
      .from("clinformatiq")
      .upload("siteState.json", file, { cacheControl: '0', upsert: false });
    if (up2Error) { console.error("DELETE+UPLOAD ALSO FAILED:", up2Error); return; }
    console.log("Delete+upload succeeded");
  } else {
    console.log("Upsert upload succeeded:", upData);
  }

  // 3. Re-download to verify
  console.log("\n=== Step 3: Re-download to verify ===");
  const { data: verifyData, error: verifyError } = await supabase.storage.from("clinformatiq").download("siteState.json");
  if (verifyError) { console.error("Verify download error:", verifyError); return; }
  const verifyText = await verifyData.text();
  const verifyState = JSON.parse(verifyText);
  console.log("Verify _testTimestamp:", verifyState._testTimestamp);
  console.log("Verify careers:", verifyState.careerListings?.length);
  console.log("\nSAVE + LOAD ROUNDTRIP:", verifyState._testTimestamp === testState._testTimestamp ? "✓ SUCCESS" : "✗ FAILED");
}
testSaveAndLoad();
