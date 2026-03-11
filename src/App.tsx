import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  Briefcase,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { analyzeResume } from './services/geminiService';
import { AnalysisResult } from './types';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeResume({ resumeText, jobDescription });
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Resume<span className="text-indigo-600">AI</span></h1>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Templates</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analyze your resume</h2>
              <p className="text-slate-500">Get instant AI-powered feedback on your resume and see how you stack up.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full h-64 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Job Description (Optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description to get a suitability score..."
                  className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed shadow-sm"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText.trim()}
                className={cn(
                  "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200",
                  isAnalyzing || !resumeText.trim() 
                    ? "bg-slate-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-300 rounded-3xl text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">Ready for analysis</h3>
                    <p className="text-slate-500 max-w-xs">Paste your resume text on the left to see your AI-powered analysis here.</p>
                  </div>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Analyzing your profile</h3>
                    <p className="text-slate-500">Our AI is scanning your skills and experience...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Score Card */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                      <Award className="w-32 h-32" />
                    </div>
                    <div className="flex items-end gap-4 mb-6">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Suitability Score</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-6xl font-black text-slate-900">{result?.suitabilityScore}</span>
                          <span className="text-xl font-bold text-slate-400">/100</span>
                        </div>
                      </div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result?.suitabilityScore}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            (result?.suitabilityScore || 0) > 70 ? "bg-emerald-500" : (result?.suitabilityScore || 0) > 40 ? "bg-amber-500" : "bg-red-500"
                          )}
                        />
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">
                      "{result?.overallFeedback}"
                    </p>
                  </div>

                  {/* Summary & Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <h4 className="font-bold flex items-center gap-2 text-slate-900">
                        <Briefcase className="w-4 h-4 text-indigo-600" /> Experience Summary
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {result?.experienceSummary}
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <h4 className="font-bold flex items-center gap-2 text-slate-900">
                        <Award className="w-4 h-4 text-indigo-600" /> Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result?.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="space-y-6">
                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                      <h4 className="font-bold flex items-center gap-2 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
                      </h4>
                      <ul className="space-y-3">
                        {result?.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-emerald-800">
                            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-4">
                      <h4 className="font-bold flex items-center gap-2 text-amber-900">
                        <TrendingUp className="w-4 h-4 text-amber-600" /> Areas for Improvement
                      </h4>
                      <ul className="space-y-3">
                        {result?.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
                            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-slate-500" />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">ResumeAI &copy; 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
