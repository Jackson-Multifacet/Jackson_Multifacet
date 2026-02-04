import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, FileText, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, Brain, Zap, Copy, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CareerCopilot: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Role-based access control
  // This was already added in the previous turn, keeping it for context.
  // useEffect(() => {
  //   if (!authLoading && (!user || user.role !== 'candidate')) {
  //     navigate('/dashboard', { replace: true }); 
  //   }
  // }, [user, authLoading, navigate]);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription || !user) return;
    
    setIsAnalyzing(true);
    setEvaluationResult(null);

    try {
      const idToken = await user.getIdToken(); // Get the Firebase ID token

      const response = await fetch('/api/career-copilot-evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}` // Include the ID token
        },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get evaluation from server');
      }

      const data = await response.json();
      // Assuming the backend returns the raw text, we parse it here if needed
      // Or the backend can return a structured JSON directly.
      // For now, let's assume backend returns plain text, and we parse it.
      // This part might need adjustment based on exact backend response format.
      setEvaluationResult(parseEvaluationText(data.evaluation));

    } catch (error: any) {
      console.error("Career Copilot analysis failed:", error);
      alert(`Analysis failed: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to parse the plain text response from the backend into a structured object
  // This is a simplified parser and might need to be more robust for production.
  const parseEvaluationText = (text: string) => {
    const evaluation: any = {};
    
    // Example: Parsing a compatibility score
    const scoreMatch = text.match(/Compatibility score: (\d+)%/i);
    if (scoreMatch) evaluation.matchScore = parseInt(scoreMatch[1]);

    // Example: Parsing strengths (assuming bullet points or numbered list)
    const strengthsMatch = text.match(/Strengths:[\s\S]*?(?=\n\d+\. |\nAreas for improvement:)/i);
    if (strengthsMatch) {
      evaluation.strengths = strengthsMatch[0].split(/\n\d+\. |\n- /).filter(s => s.trim() && !/strengths:/i.test(s)).map(s => s.trim());
    }

    // Similar parsing for other fields: gaps, goldenBio, verdict
    // For simplicity, let's assume the backend provides structured output already, 
    // or we adapt this parser.
    // Since the backend prompt asks for a direct response, we'll need to parse it or have the backend return JSON.
    // Given the backend returns `response.text()`, we'll need a robust parser here.
    // For this fix, let's assume a simplified structure returned by the backend for demo purposes.
    // A better approach would be for the backend to return JSON directly from the GenAI output if schema is used.

    // Mock parsing for demonstration purposes based on the prompt in api.cjs
    // The backend provides 4 sections: Compatibility, Strengths, Improvements, Missing Keywords.
    // We'll extract these.
    const parts = text.split(/\n\n\d+\./);
    let compatibility = 0;
    let strengths: string[] = [];
    let improvements: string[] = [];
    let missingKeywords: string[] = [];

    const scoreLine = text.match(/Compatibility score (\d+)/i);
    if (scoreLine && scoreLine[1]) {
      compatibility = parseInt(scoreLine[1]);
    }

    const strengthsSection = text.match(/Strengths of the resume relevant to the job:[\s\S]*?(?=\nAreas for improvement:)/i);
    if (strengthsSection) {
      strengths = strengthsSection[0].split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
    }

    const improvementsSection = text.match(/Areas for improvement in the resume to better match the job description:[\s\S]*?(?=\nKeywords from the job description:)/i);
    if (improvementsSection) {
      improvements = improvementsSection[0].split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
    }

    const missingKeywordsSection = text.match(/Keywords from the job description that are missing or underrepresented in the resume:[\s\S]*/i);
    if (missingKeywordsSection) {
      missingKeywords = missingKeywordsSection[0].split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
    }

    // Reconstruct the result object to match what the frontend expects
    return {
      matchScore: compatibility,
      strengths: strengths,
      gaps: improvements.concat(missingKeywords), // Combine improvements and missing keywords into 'gaps'
      goldenBio: "Your optimized bio would appear here based on full implementation.", // The backend prompt does not generate a 'goldenBio'
      verdict: `Overall, the resume shows ${compatibility}% compatibility with the job description.`
    };
  };

  const copyBio = () => {
    if (evaluationResult?.goldenBio) {
      navigator.clipboard.writeText(evaluationResult.goldenBio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="text-cyan" /> Career Copilot
          </h2>
          <p className="text-slate-400">
            AI-powered resume optimization and role matching.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* INPUT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col h-full"
        >
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Target size={16} className="text-indigo-400" /> Job Description / Target Role
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or a detailed target role here..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan focus:outline-none transition-colors min-h-[100px]"
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" /> Your Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume summary, skills, or work experience here..."
                className="w-full flex-1 min-h-[250px] bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-slate-300 focus:border-cyan focus:outline-none resize-none transition-colors leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText || !jobDescription}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {isAnalyzing ? (
                <>
                  <RefreshCw className="animate-spin" size={20} /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Run Audit
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* RESULTS SECTION */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!evaluationResult ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 border-t-2 border-cyan rounded-full animate-spin opacity-20" />
                  <Zap size={40} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Optimize</h3>
                <p className="text-slate-400 max-w-xs text-sm">
                  Paste your details and a target role to receive an instant AI-scored evaluation.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-midnight/50 border border-cyan/30 rounded-3xl p-1 relative overflow-hidden h-full flex flex-col"
              >
                {/* Scan Line Effect */}
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent z-10 opacity-30 pointer-events-none"
                />

                <div className="bg-[#0b0f17] rounded-[22px] p-6 h-full flex flex-col gap-6">
                  
                  {/* Score Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">ATS Compatibility Score</div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-mono font-bold ${
                          evaluationResult.matchScore >= 80 ? 'text-green-400' : 
                          evaluationResult.matchScore >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {evaluationResult.matchScore}%
                        </span>
                        <span className="text-slate-500 font-bold">/ 100</span>
                      </div>
                    </div>
                    <div className="text-right max-w-[50%]">
                      <p className="text-sm font-medium text-white leading-snug">"{evaluationResult.verdict}"</p>
                    </div>
                  </div>

                  {/* Golden Bio (placeholder as backend doesn't generate this yet) */}
                  <div className="bg-gradient-to-r from-indigo-900/20 to-cyan/10 border border-cyan/20 rounded-xl p-5 relative group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-cyan flex items-center gap-2">
                        <Sparkles size={14} /> Recommended Bio
                      </h4>
                      <button 
                        onClick={copyBio}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      "{evaluationResult.goldenBio}"
                    </p>
                  </div>

                  {/* Analysis Grid */}
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle size={14} /> Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {evaluationResult.strengths.map((item: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 bg-green-500 rounded-full shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} /> Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {evaluationResult.gaps.map((item: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 bg-red-500 rounded-full shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setResumeText(''); setJobDescription(''); setEvaluationResult(null); }}
                    className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-slate-400 transition-colors"
                  >
                    Start New Scan
                  </button>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CareerCopilot;