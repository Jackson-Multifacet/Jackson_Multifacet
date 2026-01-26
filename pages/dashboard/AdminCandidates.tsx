import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { CandidateRecord } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, CreditCard, User, Loader2 } from 'lucide-react';

const AdminCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    const data = await DbService.getPendingCandidates();
    setCandidates(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'verified' | 'rejected') => {
    setProcessingId(id);
    const success = await DbService.verifyCandidatePayment(id, action);
    if (success) {
      setCandidates(prev => prev.filter(c => c.id !== id));
    } else {
      alert("Action failed. Please try again.");
    }
    setProcessingId(null);
  };

  const filtered = candidates.filter(c => 
    (c.surname || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.paymentReference || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Verify Payments</h2>
          <p className="text-slate-400 text-sm">Review candidate registration fees ({candidates.length} pending)</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search name or ref..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-cyan animate-spin" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-500">
             <Check size={24} />
          </div>
          <p className="text-slate-400">All payments verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filtered.map((candidate) => (
              <motion.div
                key={candidate.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 transition-all"
              >
                 <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-cyan/10 text-cyan flex items-center justify-center shrink-0 font-bold text-lg">
                       {(candidate.surname || '?')[0]}{(candidate.firstName || '?')[0]}
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-white">{candidate.surname} {candidate.firstName}</h3>
                       <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                          <span className="flex items-center gap-1"><User size={12}/> {candidate.sex}, {candidate.stateOfOrigin}</span>
                          <span className="flex items-center gap-1 text-cyan"><CreditCard size={12}/> Ref: {candidate.paymentReference}</span>
                       </div>
                       <p className="text-xs text-slate-500 mt-2">Applied for: {candidate.desiredPositions?.join(', ') || 'General Pool'}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleAction(candidate.id, 'rejected')}
                      disabled={processingId === candidate.id}
                      className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleAction(candidate.id, 'verified')}
                      disabled={processingId === candidate.id}
                      className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingId === candidate.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Verify Payment
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminCandidates;