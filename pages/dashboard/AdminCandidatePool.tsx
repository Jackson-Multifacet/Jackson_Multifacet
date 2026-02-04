import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { CandidateRecord } from '../../types';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminCandidatePool: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Role-based access control
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      // If not loading auth, and no user or user is not admin, redirect
      navigate('/dashboard', { replace: true }); 
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function load() {
      if (user && user.role === 'admin') { // Only load if user is admin
        const data = await DbService.getAllVerifiedCandidates();
        setCandidates(data);
        setLoading(false);
      }
    }
    load();
  }, [user]); // Depend on user to re-run when role is established

  // Show loading or access denied while authentication is in progress or if unauthorized
  if (authLoading || (user && user.role !== 'admin')) {
    return (
      <div className="text-white p-6">
        {authLoading ? "Loading authentication..." : "You do not have permission to view this page."}
      </div>
    );
  }

  const filtered = candidates.filter(c => 
    c.surname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.desiredPositions.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Candidate Pool</h2>
          <p className="text-slate-400 text-sm">Search and manage verified talent ({candidates.length} total).</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search talent..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan w-full"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500">Loading candidates...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            No candidates found matching your criteria.
          </div>
        ) : (
          filtered.map((c) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col"
            >
               <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan/10 text-cyan flex items-center justify-center font-bold text-lg">
                     {c.surname[0]}{c.firstName[0]}
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white">{c.surname} {c.firstName}</h3>
                     <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold ${
                       c.status === 'placed' ? 'bg-green-500/20 text-green-400' : 'bg-cyan/20 text-cyan'
                     }`}>
                       {c.status}
                     </span>
                  </div>
               </div>

               <div className="space-y-2 mb-6 flex-1 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Briefcase size={14} className="text-slate-500" />
                    {c.desiredPositions[0] || 'Any Role'}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={14} className="text-slate-500" />
                    {c.stateOfOrigin}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                     Experience: {c.yearsExperience} years. Interested in {c.jobMode} roles.
                  </p>
               </div>

               <div className="pt-4 border-t border-white/5 flex gap-2">
                  <button className="flex-1 py-2 bg-white/5 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition-colors">
                    View Profile
                  </button>
                  <button className="flex-1 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500 transition-colors">
                    Contact
                  </button>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCandidatePool;