import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasValidSupabaseUrl = isValidHttpUrl(supabaseUrl);

export const supabase = (hasValidSupabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const storageEnabled = Boolean(supabase);

console.log("Supabase Storage:", storageEnabled ? "✓ Enabled" : "✗ Disabled");

// We will store our JSON state in the same Supabase bucket as a file called 'siteState.json'
function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const STATE_FILENAME = "siteState.json";
const BUCKET_NAME = "clinformatiq";

export async function loadSiteState() {
  if (!supabase) return null;
  
  try {
    // Use .download() which goes through the Supabase API directly, bypassing CDN caching completely
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(STATE_FILENAME);
    
    if (error) {
      if (error.message.includes("Object not found") || error.message.includes("Not Found")) {
        console.log("[Supabase] No siteState.json found — using defaults");
        return null;
      }
      throw error;
    }
    
    const text = await data.text();
    const state = JSON.parse(text);
    console.log("[Supabase] ✓ Site state loaded from database successfully");
    return state;
  } catch (error) {
    console.warn("[Supabase] ✗ Unable to load site state:", error);
    return null;
  }
}

export async function saveSiteState(state) {
  if (!supabase) return null;

  const json = JSON.stringify(state);
  const file = new Blob([json], { type: "application/json" });
  
  // Use upsert:true for atomic save — no need for separate delete+upload
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(STATE_FILENAME, file, {
      cacheControl: 'no-cache, no-store, must-revalidate',
      upsert: true
    });

  if (error) {
    console.error("[Supabase] ✗ SAVE FAILED:", error);
    throw new Error("Unable to save Supabase site state.");
  }

  console.log("[Supabase] ✓ Site state saved to database successfully (" + json.length + " bytes)");
  return state;
}

/**
 * Uploads a file to Supabase Storage under a specific folder.
 * @param {File} file 
 * @param {string} folder 
 * @returns {Promise<string>} Public Download URL
 */
export async function uploadFileToStorage(file, folder = "uploads") {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filePath = `${folder}/${timestamp}_${safeName}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Get the public URL for the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// ===== TEAM PICTURES =====

/**
 * Uploads a team member picture to Supabase Storage
 * @param {File} imageFile - Image file (jpg, png, etc.)
 * @param {string} memberName - Name of the team member
 * @returns {Promise<{publicUrl: string, fileName: string}>} Public URL and file name
 */
export async function uploadTeamPicture(imageFile, memberName) {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  // Validate it's an image
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("File must be an image (jpg, png, gif, etc.)");
  }
  
  const timestamp = Date.now();
  const safeName = memberName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const extension = imageFile.name.split(".").pop();
  const fileName = `${safeName}_${timestamp}.${extension}`;
  const filePath = `team-pictures/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    fileName: fileName,
    filePath: filePath
  };
}

/**
 * Gets all team pictures from Supabase Storage
 * @returns {Promise<Array>} Array of team picture objects with publicUrl
 */
export async function getTeamPictures() {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list("team-pictures", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" }
    });

  if (error) {
    throw error;
  }

  // Map files to include public URLs
  const pictures = data.map(file => {
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`team-pictures/${file.name}`);
    
    return {
      fileName: file.name,
      filePath: `team-pictures/${file.name}`,
      publicUrl: publicUrlData.publicUrl,
      created_at: file.created_at
    };
  });

  return pictures;
}

/**
 * Deletes a team picture from Supabase Storage
 * @param {string} fileName - Name of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteTeamPicture(fileName) {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([`team-pictures/${fileName}`]);

  if (error) {
    throw error;
  }
}

// ===== COURSE PDFs =====

/**
 * Uploads a course PDF to Supabase Storage
 * @param {File} pdfFile - PDF file
 * @param {string} courseName - Name of the course
 * @returns {Promise<{publicUrl: string, fileName: string}>} Public URL and file name
 */
export async function uploadCoursePDF(pdfFile, courseName) {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  // Validate it's a PDF
  if (pdfFile.type !== "application/pdf") {
    throw new Error("File must be a PDF");
  }
  
  const timestamp = Date.now();
  const safeName = courseName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileName = `${safeName}_${timestamp}.pdf`;
  const filePath = `course-pdfs/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, pdfFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    fileName: fileName,
    filePath: filePath
  };
}

/**
 * Gets all course PDFs from Supabase Storage
 * @returns {Promise<Array>} Array of course PDF objects with publicUrl
 */
export async function getCoursePDFs() {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list("course-pdfs", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" }
    });

  if (error) {
    throw error;
  }

  // Map files to include public URLs
  const pdfs = data.map(file => {
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`course-pdfs/${file.name}`);
    
    return {
      fileName: file.name,
      filePath: `course-pdfs/${file.name}`,
      publicUrl: publicUrlData.publicUrl,
      created_at: file.created_at
    };
  });

  return pdfs;
}

/**
 * Deletes a course PDF from Supabase Storage
 * @param {string} fileName - Name of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteCoursePDF(fileName) {
  if (!supabase) throw new Error("Supabase is not initialized.");
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([`course-pdfs/${fileName}`]);

  if (error) {
    throw error;
  }
}
