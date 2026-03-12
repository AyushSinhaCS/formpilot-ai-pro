import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";

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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setGeneratedForm(data);
    } catch (error) {
      alert("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
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
              disabled={isGenerating}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : "Generate with AI"}
            </button>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Preview: {generatedForm.title}</h2>
            
            {/* THIS IS THE MISSING PART: Displaying the questions */}
            <div className="space-y-6 mb-8">
              {generatedForm.questions.map((q: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                  <div className="h-10 w-full bg-white border border-gray-200 rounded-md"></div>
                </div>
              ))}
            </div>

            {publishedUrl ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                  <CheckCircle2 size={20} /> Form is live!
                </div>
                <input 
                  readOnly 
                  value={publishedUrl} 
                  className="w-full p-2 bg-white border border-green-200 rounded text-sm text-blue-600 underline"
                />
              </div>
            ) : (
              <button 
                onClick={handlePublish} 
                className="w-full bg-black text-white py-4 rounded-xl font-bold"
              >
                Confirm & Publish
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}