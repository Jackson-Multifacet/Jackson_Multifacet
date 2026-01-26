import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, FileText, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, Brain, Zap, Copy, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CareerCopilot: React.FC = () => {
  const { user } = useAuth();
  const [profileText, setProfileText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!profileText || !targetRole) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Act as an elite Recruitment Consultant for Jackson Multifacet.
        Analyze the following candidate profile text against the target role: "${targetRole}".
        
        Profile Text:
        "${profileText}"
        
        Provide a structured evaluation in JSON format including:
        1. A match score (0-100).
        2. A list of 3 key strengths.
        3. A list of 3 missing keywords/skills (gaps).
        4. A "Golden Bio": A rewritten, punchy 2-sentence professional summary optimized for this role.
        5. A short verdict (1 sentence).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              goldenBio: { type: Type.STRING },
              verdict: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("AI Analysis failed", error);
      alert("AI Service is currently busy. Please try again in a moment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyBio = () => {
    if (result?.goldenBio) {
      navigator.clipboard.writeText(result.goldenBio);
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
                <Target size={16} className="text-indigo-400" /> Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" /> Your Experience / Resume Text
              </label>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your resume summary, skills, or work experience here..."
                className="w-full flex-1 min-h-[250px] bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-slate-300 focus:border-cyan focus:outline-none resize-none transition-colors leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !profileText || !targetRole}
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
            {!result ? (
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
                          result.matchScore >= 80 ? 'text-green-400' : 
                          result.matchScore >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {result.matchScore}%
                        </span>
                        <span className="text-slate-500 font-bold">/ 100</span>
                      </div>
                    </div>
                    <div className="text-right max-w-[50%]">
                      <p className="text-sm font-medium text-white leading-snug">"{result.verdict}"</p>
                    </div>
                  </div>

                  {/* Golden Bio */}
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
                      "{result.goldenBio}"
                    </p>
                  </div>

                  {/* Analysis Grid */}
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle size={14} /> Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {result.strengths.map((item: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 bg-green-500 rounded-full shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} /> Missing Skills
                      </h4>
                      <ul className="space-y-2">
                        {result.gaps.map((item: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 bg-red-500 rounded-full shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setProfileText(''); setTargetRole(''); setResult(null); }}
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