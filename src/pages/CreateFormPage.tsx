import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, CheckCircle2, Copy, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateFormPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    "Restaurant Feedback Survey",
    "Course Evaluation Form",
    "Employee Onboarding Feedback",
    "Event Registration"
  ];

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
      alert("AI Generation failed. Check Render logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedForm) return;
    setIsPublishing(true);
    const id = Math.random().toString(36).substring(7);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...generatedForm })
      });
      
      if (!res.ok) throw new Error("Database save failed");
      
      setPublishedUrl(`${window.location.origin}/form/${id}`);
    } catch (e) {
      alert("Failed to publish form. Try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div 
          className="flex items-center gap-2 mb-12 cursor-pointer w-fit group" 
          onClick={() => navigate("/")}
        >
          <div className="bg-black p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
            <FileText size={22} />
          </div>
          <span className="font-bold text-2xl tracking-tight">FormPilot AI</span>
        </div>

        <AnimatePresence mode="wait">
          {!generatedForm ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Create a new form</h1>
              <p className="text-slate-500 mb-8 text-lg">Describe what you want, and AI will build the structure.</p>
              
              <div className="relative mb-8">
                <textarea 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  className="w-full h-40 p-6 border-2 border-slate-100 rounded-2xl focus:border-black focus:ring-0 transition-all outline-none bg-slate-50/50 text-lg resize-none" 
                  placeholder="e.g. A restaurant feedback survey with ratings for food and service..."
                />
              </div>

              <button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : "Generate with AI"}
                {!isGenerating && <ArrowRight size={20} />}
              </button>

              <div className="mt-10">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setPrompt(`Create a ${s}`)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-black hover:bg-slate-50 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-1">Preview Mode</p>
                  <h2 className="text-3xl font-extrabold tracking-tight">{generatedForm.title}</h2>
                </div>
                {!publishedUrl && (
                  <button 
                    onClick={() => setGeneratedForm(null)}
                    className="text-slate-400 hover:text-black font-medium text-sm"
                  >
                    Start Over
                  </button>
                )}
              </div>
              
              <div className="space-y-4 mb-10">
                {generatedForm.questions.map((q: any, idx: number) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-semibold text-slate-800 mb-3">{q.question}</p>
                    <div className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 flex items-center text-slate-400 text-sm italic">
                      User will type {q.type} response here...
                    </div>
                  </div>
                ))}
              </div>

              {publishedUrl ? (
                <div className="p-8 bg-green-50 border-2 border-green-100 rounded-3xl animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3 text-green-700 font-bold text-xl mb-4">
                    <CheckCircle2 size={26} className="text-green-500" />
                    Your form is live!
                  </div>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={publishedUrl} 
                      className="flex-1 p-4 bg-white border border-green-200 rounded-xl text-slate-600 font-mono text-sm"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="bg-green-600 text-white px-6 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      {copied ? "Copied!" : <><Copy size={18} /> Copy</>}
                    </button>
                  </div>
                  <button 
                    onClick={() => window.open(publishedUrl, '_blank')}
                    className="w-full mt-4 py-3 text-green-700 font-semibold hover:underline"
                  >
                    View Live Page →
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handlePublish} 
                  disabled={isPublishing}
                  className="w-full bg-black hover:bg-slate-800 text-white py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-slate-200 active:scale-[0.99] transition-all flex justify-center items-center gap-3"
                >
                  {isPublishing ? <Loader2 className="animate-spin" /> : "Confirm & Publish Form"}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}