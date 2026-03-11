import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function CreateFormPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const examplePrompts = [
    "Create a restaurant feedback survey",
    "Create an event registration form",
    "Create a job application form"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      // Use the VITE_ prefix for production
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(`Generate a form JSON for: ${prompt}. Return ONLY JSON with "title" and "questions" (array of {question, type: "text" | "rating" | "multiple_choice", options?, required: boolean}).`);
      const text = result.response.text().replace(/```json|```/g, "");
      const data = JSON.parse(text);
      setGeneratedForm({ id: Date.now().toString(), ...data });
    } catch (error) {
      console.error(error);
      alert("AI Generation failed. Check your API Key in Render Environment Variables.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedForm) return;
    const id = Math.random().toString(36).substring(7);
    try {
      await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...generatedForm })
      });
      setPublishedUrl(`${window.location.origin}/form/${id}`);
    } catch (e) {
      alert("Failed to publish.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-12">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-black p-2 rounded text-white"><FileText size={20} /></div>
          <span className="font-bold text-xl">FormPilot AI</span>
        </div>
        
        {!generatedForm ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Create Form</h1>
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              className="w-full h-32 p-5 border border-gray-200 rounded-xl mb-6 outline-none bg-[#fcfcfc]" 
              placeholder="e.g. Create a restaurant feedback survey..."
            />
            
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : "Generate with AI"}
            </button>

            <p className="text-sm font-medium text-gray-500 mb-3">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((ex) => (
                <button key={ex} onClick={() => setPrompt(ex)} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm hover:bg-gray-200">
                  {ex}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6">Preview: {generatedForm.title}</h2>
            {publishedUrl ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-bold mb-2">Form is live!</p>
                <a href={publishedUrl} target="_blank" className="text-blue-600 underline break-all">{publishedUrl}</a>
              </div>
            ) : (
              <button onClick={handlePublish} className="w-full bg-black text-white py-4 rounded-xl font-bold">
                Confirm & Publish
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}