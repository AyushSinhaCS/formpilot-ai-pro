import { Link } from "react-router-dom";
import { ArrowRight, FileText, BarChart3, Link as LinkIcon } from "lucide-react";
import { DoodleBackground } from "../components/Doodles";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111111] font-sans selection:bg-black selection:text-white relative">
      <DoodleBackground />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-md text-white">
            <FileText size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">FormPilot AI</span>
        </div>
        <nav>
          <Link
            to="/create"
            className="px-4 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6 shadow-sm">
          <span>⚡ AI Powered Form Builder</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 text-black leading-[1.1]">
          FormPilot AI
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Create Beautiful Forms with AI in Seconds
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/create"
            className="px-8 py-4 bg-black text-white rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 hover:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Generate Your Form <ArrowRight size={20} />
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <p className="text-sm text-gray-500 font-medium mb-4">Try an example:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Create a restaurant feedback survey",
              "Create a job application form",
              "Create an event registration form"
            ].map((promptText, i) => (
              <Link
                key={i}
                to="/create"
                state={{ prompt: promptText }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
              >
                {promptText}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Feature Cards Section */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 bg-gray-100 text-black rounded-lg flex items-center justify-center mb-5">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">AI Generation</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Generate complete forms using a single prompt. Just type what you need.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 bg-gray-100 text-black rounded-lg flex items-center justify-center mb-5">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Response Analytics</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Track responses and insights easily with our built-in minimalist dashboard.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 bg-gray-100 text-black rounded-lg flex items-center justify-center mb-5">
              <LinkIcon size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Shareable Links</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Share forms instantly with a public link. No embedding required.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">1</div>
            <h3 className="text-xl font-bold mb-3 text-black">Describe Your Form</h3>
            <p className="text-gray-600 leading-relaxed">Type what kind of form you want in plain English.</p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">2</div>
            <h3 className="text-xl font-bold mb-3 text-black">AI Generates Questions</h3>
            <p className="text-gray-600 leading-relaxed">Our AI instantly creates structured survey questions.</p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">3</div>
            <h3 className="text-xl font-bold mb-3 text-black">Share Your Form</h3>
            <p className="text-gray-600 leading-relaxed">Publish your form and share it with anyone using a public link.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-50 border-t border-gray-200 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 text-black">
            <div className="bg-black p-1 rounded-md text-white">
              <FileText size={14} />
            </div>
            <span className="font-bold text-md">FormPilot AI</span>
          </div>
          <p className="text-gray-500 text-sm mb-1">AI-powered form builder</p>
          <p className="text-gray-400 text-xs">Built for the Mattr AI Challenge</p>
        </div>
      </footer>
    </div>
  );
}
