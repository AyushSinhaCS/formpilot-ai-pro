import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const db = new Database("forms.db");
db.exec(`CREATE TABLE IF NOT EXISTS forms (id TEXT PRIMARY KEY, title TEXT, questions TEXT);`);

// AI Generation Route
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // CHANGE THIS LINE: Ensure it is exactly "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(`Generate a form JSON for: ${prompt}. Return ONLY JSON with "title" and "questions" (array of {question, type: "text" | "rating" | "multiple_choice", options?, required: boolean}).`);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("GEMINI API ERROR:", error.message);
    res.status(500).json({ error: "AI processing failed", details: error.message });
  }
});

// Save and Get Form routes
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

// Production Static Serving
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server live on port ${PORT}`);
});