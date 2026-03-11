import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// RENDER REQUIRES PORT 10000
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Initialize Database in a persistent path for Render
const dbPath = process.env.NODE_ENV === "production" ? "/opt/render/project/src/forms.db" : "forms.db";
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS forms (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    questions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id TEXT NOT NULL,
    answers TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms (id)
  );
`);

// API Routes
app.post("/api/forms", (req, res) => {
  const { id, title, questions } = req.body;
  db.prepare("INSERT INTO forms (id, title, questions) VALUES (?, ?, ?)").run(id, title, JSON.stringify(questions));
  res.json({ success: true, id });
});

app.get("/api/forms/:id", (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE id = ?").get(req.params.id) as any;
  if (!form) return res.status(404).json({ error: "Not found" });
  res.json({ ...form, questions: JSON.parse(form.questions) });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    // THE MAGIC FIX: Redirects all routes to index.html so /form/ links work
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();