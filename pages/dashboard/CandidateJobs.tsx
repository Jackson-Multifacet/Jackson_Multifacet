import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { Job } from '../../types';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, Clock, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CandidateJobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const data = await DbService.getJobs();
      setJobs(data);
      setLoading(false);
      
      // Load previous applications to mark as applied
      if (user) {
        const apps = await DbService.getCandidateApplications(user.uid);
        const appliedJobIds = new Set(apps.map(a => a.jobId));
        setApplied(appliedJobIds);
      }
    }
    load();
  }, [user]);

  const handleApply = async (job: Job) => {
    if (!user) return;
    setApplyingTo(job.id);
    
    const success = await DbService.applyToJob(user.uid, job);
    
    if (success) {
      setApplied(prev => new Set(prev).add(job.id));
    } else {
      alert("Failed to apply. Please try again.");
    }
    setApplyingTo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Job Opportunities</h2>
          <p className="text-slate-400 text-sm">Find roles that match your skills.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-white text-center py-12 flex justify-center"><Loader2 className="animate-spin text-cyan" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan/30 transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  {job.company.charAt(0)}
                </div>
                <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-white/10 text-slate-400">
                  {job.type}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{job.company}</p>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <MapPin size={14} className="text-cyan" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <DollarSign size={14} className="text-green-400" /> {job.salaryRange}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock size={14} className="text-amber-400" /> Posted {job.postedAt}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleApply(job)}
                  disabled={applied.has(job.id) || applyingTo === job.id}
                  className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    applied.has(job.id) 
                    ? 'bg-green-500/20 text-green-400 cursor-default' 
                    : 'bg-cyan text-midnight hover:bg-white'
                  }`}
                >
                  {applyingTo === job.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : applied.has(job.id) ? (
                    <>Applied <Check size={16} /></>
                  ) : (
                    <>Apply Now <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateJobs;