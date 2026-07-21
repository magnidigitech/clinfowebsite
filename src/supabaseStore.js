// Client adapter for PostgreSQL database API
// This replaces the old Supabase implementation and redirects all operations to our Express /api endpoints.

export const storageEnabled = true;

console.log("PostgreSQL Storage System: Enabled (routing via Express API)");

// Helper to determine if a URL is valid
function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Load website state from API
export async function loadSiteState() {
  try {
    const response = await fetch("/api/state");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const state = await response.json();
    if (state) {
      console.log("[PostgreSQL] ✓ Site state loaded successfully");
    } else {
      console.log("[PostgreSQL] No site state found — using defaults");
    }
    return state;
  } catch (error) {
    console.warn("[PostgreSQL] ✗ Unable to load site state:", error);
    return null;
  }
}

// Save website state to API (supports both full state object and key/value updates)
export async function saveSiteState(keyOrState, value) {
  try {
    let stateToSave;
    if (typeof keyOrState === "string") {
      const currentState = (await loadSiteState()) || {};
      stateToSave = { ...currentState, [keyOrState]: value };
    } else {
      stateToSave = keyOrState;
    }

    const response = await fetch("/api/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stateToSave),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("[PostgreSQL] ✓ Site state saved successfully");
    return stateToSave;
  } catch (error) {
    console.error("[PostgreSQL] ✗ SAVE FAILED:", error);
    throw new Error("Unable to save site state.");
  }
}

/**
 * Uploads a file to the API backend
 * @param {File} file 
 * @param {string} folder 
 * @returns {Promise<string>} Relative Download URL
 */
export async function uploadFileToStorage(file, folder = "uploads") {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filePath = `${folder}/${timestamp}_${safeName}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("filePath", filePath);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.publicUrl;
  } catch (error) {
    console.error("[PostgreSQL] File upload failed:", error);
    throw error;
  }
}

// ===== TEAM PICTURES =====

/**
 * Uploads a team member picture
 * @param {File} imageFile 
 * @param {string} memberName 
 * @returns {Promise<{publicUrl: string, fileName: string, filePath: string}>}
 */
export async function uploadTeamPicture(imageFile, memberName) {
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("File must be an image (jpg, png, gif, etc.)");
  }

  const timestamp = Date.now();
  const safeName = memberName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const extension = imageFile.name.split(".").pop();
  const fileName = `${safeName}_${timestamp}.${extension}`;
  const filePath = `team-pictures/${fileName}`;

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("filePath", filePath);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      publicUrl: data.publicUrl,
      fileName: fileName,
      filePath: filePath
    };
  } catch (error) {
    console.error("[PostgreSQL] Team picture upload failed:", error);
    throw error;
  }
}

/**
 * Gets all team pictures
 * @returns {Promise<Array>} Array of team picture objects
 */
export async function getTeamPictures() {
  try {
    const response = await fetch("/api/files/list/team-pictures");
    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.status}`);
    }
    const data = await response.json();

    return data.map(file => ({
      fileName: file.name,
      filePath: `team-pictures/${file.name}`,
      publicUrl: `/api/files/team-pictures/${file.name}`,
      created_at: file.created_at
    }));
  } catch (error) {
    console.error("[PostgreSQL] Error fetching team pictures:", error);
    throw error;
  }
}

/**
 * Deletes a team picture
 * @param {string} fileName 
 * @returns {Promise<void>}
 */
export async function deleteTeamPicture(fileName) {
  try {
    const response = await fetch(`/api/files/team-pictures/${fileName}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }
  } catch (error) {
    console.error("[PostgreSQL] Error deleting team picture:", error);
    throw error;
  }
}

// ===== COURSE PDFs =====

/**
 * Uploads a course PDF
 * @param {File} pdfFile 
 * @param {string} courseName 
 * @returns {Promise<{publicUrl: string, fileName: string, filePath: string}>}
 */
export async function uploadCoursePDF(pdfFile, courseName) {
  if (pdfFile.type !== "application/pdf") {
    throw new Error("File must be a PDF");
  }

  const timestamp = Date.now();
  const safeName = courseName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileName = `${safeName}_${timestamp}.pdf`;
  const filePath = `course-pdfs/${fileName}`;

  const formData = new FormData();
  formData.append("file", pdfFile);
  formData.append("filePath", filePath);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      publicUrl: data.publicUrl,
      fileName: fileName,
      filePath: filePath
    };
  } catch (error) {
    console.error("[PostgreSQL] PDF upload failed:", error);
    throw error;
  }
}

/**
 * Gets all course PDFs
 * @returns {Promise<Array>} Array of course PDF objects
 */
export async function getCoursePDFs() {
  try {
    const response = await fetch("/api/files/list/course-pdfs");
    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.status}`);
    }
    const data = await response.json();

    return data.map(file => ({
      fileName: file.name,
      filePath: `course-pdfs/${file.name}`,
      publicUrl: `/api/files/course-pdfs/${file.name}`,
      created_at: file.created_at
    }));
  } catch (error) {
    console.error("[PostgreSQL] Error fetching course PDFs:", error);
    throw error;
  }
}

/**
 * Deletes a course PDF
 * @param {string} fileName 
 * @returns {Promise<void>}
 */
export async function deleteCoursePDF(fileName) {
  try {
    const response = await fetch(`/api/files/course-pdfs/${fileName}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }
  } catch (error) {
    console.error("[PostgreSQL] Error deleting course PDF:", error);
    throw error;
  }
}
