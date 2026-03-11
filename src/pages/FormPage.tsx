import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Form, Answer } from "../types";
import { DoodleBackground } from "../components/Doodles";
import { RatingInput } from "../components/RatingInput";

export default function FormPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
          throw new Error("Form not found");
        }
        const data = await response.json();
        setForm(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id]);

  const handleAnswerChange = (question: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
    // Clear validation error when user answers
    if (validationErrors[question]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[question];
        return newErrors;
      });
    }
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    // Validation
    const errors: Record<string, string> = {};
    let hasErrors = false;

    form.questions.forEach((q) => {
      if (q.required && !answers[q.question]) {
        errors[q.question] = "Please answer this question before submitting.";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    const formattedAnswers: Answer[] = Object.entries(answers).map(([question, answer]) => ({
      question,
      answer: answer as string | number,
    }));

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: id,
          answers: formattedAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit response");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting:", err);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
        <h1 className="text-3xl font-bold text-black mb-4">Form Not Found</h1>
        <p className="text-gray-500 mb-8">The form you're looking for doesn't exist or has been removed.</p>
        <a href="/" className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
          Create Your Own Form
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Thank you!</h1>
        <p className="text-gray-600 mb-8 text-lg">Your response has been successfully submitted.</p>
        <a href="/" className="text-gray-400 hover:text-black font-medium transition-colors text-sm">
          Powered by FormPilot AI
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-12 md:py-20 px-4 sm:px-8 lg:px-12 font-sans selection:bg-black selection:text-white relative">
      <DoodleBackground />
      <div className="relative z-10 max-w-3xl mx-auto bg-white p-8 md:p-16 rounded-2xl border border-gray-200 shadow-sm">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight">{form.title}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          {form.questions.map((q, index) => (
            <div key={index} className="space-y-4">
              <label className="block text-xl font-medium text-black">
                {q.question}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {q.type === "text" && (
                <textarea
                  required={q.required}
                  value={(answers[q.question] as string) || ""}
                  onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                  placeholder="Type your answer here..."
                  className={`w-full h-24 p-0 border-0 border-b ${validationErrors[q.question] ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-black'} focus:ring-0 outline-none resize-y text-lg bg-transparent transition-colors text-black placeholder-gray-400`}
                />
              )}
              
              {q.type === "rating" && (
                <RatingInput
                  value={(answers[q.question] as number) || 0}
                  onChange={(val) => handleAnswerChange(q.question, val)}
                  hasError={!!validationErrors[q.question]}
                />
              )}
              
              {q.type === "multiple_choice" && q.options && (
                <div className="space-y-2 mt-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-md border cursor-pointer transition-colors ${
                        answers[q.question] === opt
                          ? "border-black bg-gray-50"
                          : validationErrors[q.question]
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        answers[q.question] === opt ? "border-black" : validationErrors[q.question] ? "border-red-500" : "border-gray-300"
                      }`}>
                        {answers[q.question] === opt && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name={q.question}
                        value={opt}
                        required={q.required}
                        checked={answers[q.question] === opt}
                        onChange={() => handleAnswerChange(q.question, opt)}
                        className="hidden"
                      />
                      <span className={`text-lg transition-colors ${answers[q.question] === opt ? "text-black font-medium" : validationErrors[q.question] ? "text-red-700" : "text-gray-700"}`}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              
              {validationErrors[q.question] && (
                <p className="text-red-500 text-sm mt-2">{validationErrors[q.question]}</p>
              )}
            </div>
          ))}

          <div className="pt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-black text-white rounded-md font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Submit"}
            </button>
          </div>
          <div className="pt-4 text-sm text-gray-500">
            * Required questions
          </div>
        </form>
        
        <div className="mt-24 pt-8 border-t border-gray-100 text-left">
          <a href="/" className="text-gray-400 text-sm hover:text-black transition-colors inline-flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-[8px] font-bold">F</div>
            Powered by FormPilot AI
          </a>
        </div>
      </div>
    </div>
  );
}
