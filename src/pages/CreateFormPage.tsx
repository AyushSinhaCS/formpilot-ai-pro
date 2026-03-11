import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, Copy, FileText, ArrowRight } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DoodleBackground } from "../components/Doodles";

export default function CreateFormPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      // Corrected API initialization
      const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY || "");
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(`Generate a survey form based on the following prompt: "${prompt}". Return ONLY JSON with "title" and "questions" (array of {question, type: "text" | "rating" | "multiple_choice", options?, required: boolean}).`);
      const text = result.response.text().replace(/```json|```/g, "");
      const data = JSON.parse(text);

      setGeneratedForm({
        id: "preview-" + Date.now(),
        title: data.title,
        questions: data.questions,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    const id = Math.random().toString(36).substring(7);
    await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...generatedForm })
    });
    setPublishedUrl(`${window.location.origin}/form/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-8 relative">
      <DoodleBackground />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm relative z-10">
        <h1 className="text-3xl font-bold mb-6">Create Form</h1>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          className="w-full h-32 p-4 border rounded-lg mb-4" 
          placeholder="What kind of form do you need?"
        />
        <button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : "Generate with AI"}
        </button>

        {generatedForm && !publishedUrl && (
          <button onClick={handlePublish} className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg">
            Publish Form
          </button>
        )}

        {publishedUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-bold">Live Link:</p>
            <a href={publishedUrl} target="_blank" className="text-blue-600 underline">{publishedUrl}</a>
          </div>
        )}
      </div>
    </div>
  );
}