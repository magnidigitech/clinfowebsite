import express from "express";
import pg from "pg";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const app = express();

// Increase JSON body limits to support larger site state blobs
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure connection pool (SSL enabled only if explicitly configured via DATABASE_SSL=true or sslmode=require)
const connectionString = process.env.DATABASE_URL;
const useSsl = process.env.DATABASE_SSL === "true" || (connectionString && connectionString.includes("sslmode=require"));

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
  console.error("[PostgreSQL Pool Error]", err.message);
});

// Database Initialization
async function initDb() {
  if (!connectionString) {
    console.warn("WARNING: DATABASE_URL environment variable is missing.");
    return;
  }
  
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_state (
          id INT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS files (
          id SERIAL PRIMARY KEY,
          filepath TEXT UNIQUE NOT NULL,
          mime_type TEXT NOT NULL,
          file_data BYTEA NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("✓ PostgreSQL tables initialized successfully.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("✗ Database initialization failed:", err.message);
  }
}

// Initialize tables
initDb();

// Multer memory storage configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ==========================================
// API ROUTES
// ==========================================

// Get site state
app.get("/api/state", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT data FROM site_state WHERE id = 1");
    if (rows.length === 0) {
      return res.json(null);
    }
    res.json(rows[0].data);
  } catch (err) {
    console.error("Error fetching state:", err.message);
    res.status(500).json({ error: "Failed to fetch site state from database" });
  }
});

// Save site state
app.post("/api/state", async (req, res) => {
  try {
    const state = req.body;
    await pool.query(
      `INSERT INTO site_state (id, data, updated_at) 
       VALUES (1, $1, CURRENT_TIMESTAMP) 
       ON CONFLICT (id) 
       DO UPDATE SET data = $1, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(state)]
    );
    res.json({ success: true, message: "Site state saved successfully" });
  } catch (err) {
    console.error("Error saving state:", err.message);
    res.status(500).json({ error: "Failed to save site state to database" });
  }
});

// Upload a file (stores binary in pg files table)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const filePath = req.body.filePath;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!filePath) {
      return res.status(400).json({ error: "No filePath specified" });
    }

    await pool.query(
      `INSERT INTO files (filepath, mime_type, file_data)
       VALUES ($1, $2, $3)
       ON CONFLICT (filepath)
       DO UPDATE SET mime_type = $2, file_data = $3, created_at = CURRENT_TIMESTAMP`,
      [filePath, file.mimetype, file.buffer]
    );

    // Return the relative URL endpoint to access the file
    res.json({ publicUrl: `/api/files/${filePath}` });
  } catch (err) {
    console.error("Error uploading file:", err.message);
    res.status(500).json({ error: "Failed to upload file to database" });
  }
});

// List files by prefix (e.g. /api/files/list/team-pictures/)
app.get("/api/files/list/*", async (req, res) => {
  try {
    const prefix = req.params[0];
    const { rows } = await pool.query(
      "SELECT filepath, created_at FROM files WHERE filepath LIKE $1 ORDER BY created_at DESC",
      [`${prefix}%`]
    );
    res.json(rows.map(r => ({
      name: r.filepath.split("/").pop(), // Get the base filename
      created_at: r.created_at
    })));
  } catch (err) {
    console.error("Error listing files:", err.message);
    res.status(500).json({ error: "Failed to list files" });
  }
});

// Serve an uploaded file by path
app.get("/api/files/*", async (req, res) => {
  try {
    // Extract filepath from wildcard param (omitting /api/files/ prefix)
    const filePath = req.params[0];

    const { rows } = await pool.query(
      "SELECT mime_type, file_data FROM files WHERE filepath = $1",
      [filePath]
    );

    if (rows.length === 0) {
      return res.status(404).send("File not found");
    }

    const { mime_type, file_data } = rows[0];

    // Set cache headers to optimize load times
    res.setHeader("Content-Type", mime_type);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(file_data);
  } catch (err) {
    console.error("Error serving file:", err.message);
    res.status(500).send("Internal server error");
  }
});

// Delete a file by path
app.delete("/api/files/*", async (req, res) => {
  try {
    const filePath = req.params[0];

    const { rowCount } = await pool.query(
      "DELETE FROM files WHERE filepath = $1",
      [filePath]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res.status(500).json({ error: "Failed to delete file from database" });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "unhealthy", error: err.message });
  }
});

// Serve static assets if dist folder exists (e.g. Hostinger VPS / production environment)
const distPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  console.log(`[Express] ✓ Serving static production build from: ${distPath}`);
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.warn(`[Express] ⚠️ Warning: ${distPath} does not exist. Run 'npm run build' first.`);
}

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server listening on 0.0.0.0:${PORT}`);
});

export default app;
