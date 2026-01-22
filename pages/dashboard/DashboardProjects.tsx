import React, { useEffect, useState } from 'react';
import { Project } from '../../types';
import { DbService } from '../../services/db';
import { motion } from 'framer-motion';
import { MoreVertical, Calendar } from 'lucide-react';

const DashboardProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await DbService.getProjects();
      setProjects(data);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects Overview</h2>
        <div className="flex gap-2">
           <select className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none">
             <option>All Categories</option>
             <option>IT Support</option>
             <option>Recruitment</option>
             <option>Branding</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
               <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                 p.category === 'IT Support' ? 'bg-purple-500/20 text-purple-400' :
                 p.category === 'Recruitment' ? 'bg-indigo-500/20 text-indigo-400' :
                 'bg-cyan/20 text-cyan'
               }`}>
                 {p.category}
               </span>
               <button className="text-slate-500 hover:text-white"><MoreVertical size={18} /></button>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
            <p className="text-sm text-slate-400 mb-6">{p.client}</p>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Progress</span>
                <span>{p.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full ${p.status === 'completed' ? 'bg-green-500' : 'bg-cyan'}`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
               <div className="flex items-center gap-2 text-xs text-slate-500">
                 <Calendar size={14} />
                 <span>Due: {p.deadline}</span>
               </div>
               <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-midnight" />
                  <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-midnight" />
                  <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-midnight flex items-center justify-center text-[8px] text-white font-bold">+2</div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardProjects;