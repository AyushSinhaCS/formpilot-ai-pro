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

// Database
const db = new Database("forms.db");
db.exec(`CREATE TABLE IF NOT EXISTS forms (id TEXT PRIMARY KEY, title TEXT, questions TEXT);`);

// AI Route using Native Fetch
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a form JSON for: ${prompt}. Return ONLY raw JSON. Format: { "title": "string", "questions": [{ "question": "string", "type": "text" | "rating" | "multiple_choice", "options": ["string"], "required": boolean }] }` }] }]
        })
      }
    );

    const data: any = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    res.status(500).json({ error: "AI Failed" });
  }
});

app.post("/api/forms", (req, res) => {
  const { id, title, questions } = req.body;
  db.prepare("INSERT INTO forms (id, title, questions) VALUES (?, ?, ?)").run(id, title, JSON.stringify(questions));
  res.json({ success: true });
});

app.get("/api/forms/:id", (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE id = ?").get(req.params.id) as any;
  if (!form) return res.status(404).send("Not Found");
  res.json({ ...form, questions: JSON.parse(form.questions) });
});

const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server live on port ${PORT}`);
});