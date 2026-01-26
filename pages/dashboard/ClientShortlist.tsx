import React from 'react';
import { motion } from 'framer-motion';
import { User, Download, Mail, Star, MapPin, Briefcase } from 'lucide-react';

// Mock data for display purposes
const CANDIDATES = [
  { id: 1, name: 'David Okonkwo', role: 'Senior Frontend Dev', exp: '5 Yrs', location: 'Lagos', rating: 4.8, skills: ['React', 'TypeScript', 'Node.js'] },
  { id: 2, name: 'Sarah Jones', role: 'UI/UX Designer', exp: '3 Yrs', location: 'Remote', rating: 4.9, skills: ['Figma', 'Adobe XD', 'Prototyping'] },
  { id: 3, name: 'Emmanuel Eze', role: 'DevOps Engineer', exp: '6 Yrs', location: 'Abuja', rating: 4.7, skills: ['AWS', 'Docker', 'Kubernetes'] },
];

const ClientShortlist: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Talent Shortlist</h2>
          <p className="text-slate-400 text-sm">Candidates vetted and recommended for your active projects.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2">
           <Download size={16} /> Download All CVs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CANDIDATES.map((c) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {c.name.split(' ').map(n => n[0]).join('')}
               </div>
               <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded text-amber-400 text-xs font-bold">
                 <Star size={12} fill="currentColor" /> {c.rating}
               </div>
            </div>

            <h3 className="text-lg font-bold text-white">{c.name}</h3>
            <p className="text-indigo-400 text-sm font-medium mb-4">{c.role}</p>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 mb-6 border-y border-white/5 py-4">
               <div className="flex items-center gap-2">
                 <Briefcase size={14} className="text-slate-500" /> {c.exp} Experience
               </div>
               <div className="flex items-center gap-2">
                 <MapPin size={14} className="text-slate-500" /> {c.location}
               </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {c.skills.map(s => (
                <span key={s} className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400 border border-white/5">{s}</span>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors">
                Interview
              </button>
              <button className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientShortlist;