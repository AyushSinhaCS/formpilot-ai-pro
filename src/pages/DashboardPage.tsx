import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, BarChart3, Users, MessageSquare, Star } from "lucide-react";
import { Form, Response } from "../types";
import { DoodleBackground } from "../components/Doodles";

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`/api/forms/${id}/responses`);
        if (!res.ok) {
          throw new Error("Dashboard not found");
        }
        const data = await res.json();
        setForm(data.form);
        setResponses(data.responses);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDashboardData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f5] text-center px-6">
        <h1 className="text-3xl font-bold text-black mb-4">Dashboard Not Found</h1>
        <p className="text-gray-500 mb-8">The dashboard you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
          Go Home
        </button>
      </div>
    );
  }

  // Calculate stats
  const totalResponses = responses.length;
  
  // Helper to calculate average rating
  const getAverageRating = (questionText: string) => {
    const ratings = responses
      .map(r => r.answers.find(a => a.question === questionText)?.answer)
      .filter(a => typeof a === "number") as number[];
    
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Helper to calculate multiple choice distribution
  const getChoiceDistribution = (questionText: string) => {
    const choices = responses
      .map(r => r.answers.find(a => a.question === questionText)?.answer)
      .filter(a => typeof a === "string") as string[];
    
    const counts: Record<string, number> = {};
    choices.forEach(c => {
      counts[c] = (counts[c] || 0) + 1;
    });
    
    return Object.entries(counts).map(([choice, count]) => ({
      choice,
      count,
      percentage: Math.round((count / choices.length) * 100)
    }));
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111111] font-sans pb-24 selection:bg-black selection:text-white relative">
      <DoodleBackground />
      {/* Header */}
      <header className="relative z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg tracking-tight">{form.title}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/form/${id}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-white border border-gray-200 text-black rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            View Live Form
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 text-black rounded-lg flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Responses</p>
              <p className="text-2xl font-bold text-black">{totalResponses}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 text-black rounded-lg flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Questions</p>
              <p className="text-2xl font-bold text-black">{form.questions.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 text-black rounded-lg flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-black">100%</p>
            </div>
          </div>
        </div>

        {totalResponses === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={24} />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">No responses yet</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">Share your form link to start collecting responses. They will appear here automatically.</p>
            <a
              href={`/form/${id}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors inline-block"
            >
              Open Form Link
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-4">Analytics</h2>
            
            {form.questions.map((q, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-lg font-semibold text-black mb-6">
                  {index + 1}. {q.question}
                </h3>
                
                {q.type === "rating" && (
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-bold text-black mb-2">{getAverageRating(q.question)}</div>
                      <div className="flex text-black text-xl justify-center md:justify-start mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} fill={star <= Math.round(Number(getAverageRating(q.question))) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</p>
                    </div>
                    
                    {/* Simple distribution bar chart */}
                    <div className="flex-1 w-full space-y-2">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = responses.filter(r => r.answers.find(a => a.question === q.question)?.answer === star).length;
                        const percent = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 w-3">{star}</span>
                            <Star size={14} className="text-gray-400" fill="currentColor" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-black rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {q.type === "multiple_choice" && (
                  <div className="space-y-4">
                    {getChoiceDistribution(q.question).map((dist, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-black">{dist.choice}</span>
                          <span className="text-gray-500">{dist.percentage}% ({dist.count})</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {q.type === "text" && (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {responses.map((r, i) => {
                      const answer = r.answers.find(a => a.question === q.question)?.answer;
                      if (!answer) return null;
                      return (
                        <div key={i} className="p-4 bg-[#fcfcfc] rounded-lg border border-gray-200 text-gray-700 text-sm">
                          {answer}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
