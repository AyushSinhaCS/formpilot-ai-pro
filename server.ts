import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Initialize SQLite Database
const db = new Database("forms.db");
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

// --- AI GENERATION ROUTE (Direct REST to bypass 404/v1beta error) ---
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API Key in Environment Variables" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `Generate a survey form JSON for: "${prompt}". Return ONLY the raw JSON.
              Format: { "title": "string", "questions": [{ "question": "string", "type": "text" | "rating" | "multiple_choice", "options": ["string"], "required": boolean }] }` 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: "AI Failed", details: error.message });
  }
});

// --- FORM ROUTES ---
app.post("/api/forms", (req, res) => {
  try {
    const { id, title, questions } = req.body;
    const stmt = db.prepare("INSERT INTO forms (id, title, questions) VALUES (?, ?, ?)");
    stmt.run(id, title, JSON.stringify(questions));
    res.json({ success: true, id });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/forms/:id", (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE id = ?").get(req.params.id) as any;
  if (!form) return res.status(404).send("Not Found");
  res.json({ ...form, questions: JSON.parse(form.questions) });
});

// --- PRODUCTION SERVING ---
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// Important: Catch-all route to handle React Router links (/form/id)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server live on port ${PORT}`);
});