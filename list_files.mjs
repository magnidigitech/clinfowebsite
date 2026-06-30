import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://aeidiioojdtcmyhifpny.supabase.co", "sb_publishable_PVZ6bscz5vEGSxRIVL3YsQ_QlDNXxWE");

async function listFolders() {
  const folders = ["", "affiliated_photos", "team_photos", "documents", "team-pictures"];
  for (const folder of folders) {
    const { data, error } = await supabase.storage.from("clinformatiq").list(folder, { limit: 100 });
    if (error) { console.log(folder + ": ERROR -", error.message); continue; }
    console.log("=== Folder: '" + folder + "' (" + data.length + " files) ===");
    data.forEach(f => console.log("  ", f.name, f.metadata ? JSON.stringify(f.metadata) : ""));
  }
}
listFolders();
