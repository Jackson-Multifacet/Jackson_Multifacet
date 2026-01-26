import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { Job } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, MapPin, Briefcase, DollarSign, X, Check, Loader2 } from 'lucide-react';

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newJob, setNewJob] = useState<Omit<Job, 'id'>>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salaryRange: '',
    description: '',
    postedAt: new Date().toLocaleDateString()
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const data = await DbService.getJobs();
    setJobs(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      const success = await DbService.deleteJob(id);
      if (success) setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await DbService.createJob({
      ...newJob,
      postedAt: new Date().toLocaleDateString()
    });
    
    if (success) {
      setShowModal(false);
      fetchJobs(); // Refresh
      setNewJob({ title: '', company: '', location: '', type: 'Full-time', salaryRange: '', description: '', postedAt: '' });
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Job Board Management</h2>
          <p className="text-slate-400 text-sm">Post new opportunities for the candidate pool.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-bold shadow-lg shadow-indigo-900/20"
        >
           <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
        <input 
          type="text" 
          placeholder="Search active listings..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan w-full md:w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <Loader2 className="text-cyan animate-spin" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <motion.div 
              key={job.id}
              layout
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:border-white/20 transition-all"
            >
              <button 
                onClick={() => handleDelete(job.id)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>

              <h3 className="text-lg font-bold text-white mb-1 pr-8">{job.title}</h3>
              <p className="text-indigo-400 text-sm font-medium mb-4">{job.company}</p>

              <div className="space-y-2 mb-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" /> {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-500" /> {job.type}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-500" /> {job.salaryRange}
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                <span>Posted: {job.postedAt}</span>
                <span className="px-2 py-1 bg-white/5 rounded">Active</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0d1117] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6">Post New Opportunity</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Job Title</label>
                  <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Company Name</label>
                    <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Job Type</label>
                    <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan outline-none">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Location</label>
                    <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Lagos" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Salary Range</label>
                    <input required value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} placeholder="e.g. ₦150k - ₦200k" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Description</label>
                  <textarea required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan outline-none h-24 resize-none" />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-cyan text-midnight font-bold rounded-lg hover:bg-white transition-colors">Post Job</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminJobs;