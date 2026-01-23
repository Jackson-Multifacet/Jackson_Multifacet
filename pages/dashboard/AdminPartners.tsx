import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { PartnerRecord, IndividualPartnerData, OrganizationPartnerData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, Briefcase, Building2, User, Loader2, ExternalLink } from 'lucide-react';

const AdminPartners: React.FC = () => {
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    const data = await DbService.getPendingPartners();
    setPartners(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setProcessingId(id);
    const success = await DbService.reviewPartnerApplication(id, action);
    if (success) {
      setPartners(prev => prev.filter(p => p.id !== id));
    } else {
      alert("Action failed. Please try again.");
    }
    setProcessingId(null);
  };

  const isOrg = (data: any): data is OrganizationPartnerData => {
      return data && 'businessName' in data;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Partner Applications</h2>
          <p className="text-slate-400 text-sm">Review incoming service provider requests ({partners.length})</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-cyan animate-spin" size={32} />
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-500">
             <Briefcase size={24} />
          </div>
          <p className="text-slate-400">No pending applications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {partners.map((partner) => {
              const data = partner.data || {};
              const title = isOrg(data) ? data.businessName : data.fullName;
              const subtitle = isOrg(data) ? 'Corporate Agency' : data.professionalTitle;
              
              return (
                <motion.div
                  key={partner.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all flex flex-col h-full"
                >
                   <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${partner.type === 'org' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan/20 text-cyan'}`}>
                           {partner.type === 'org' ? <Building2 size={24} /> : <User size={24} />}
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white">{title || 'Unknown'}</h3>
                           <p className="text-sm text-slate-400">{subtitle || 'N/A'}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-white/10 text-slate-400">
                        {partner.type}
                      </span>
                   </div>

                   <div className="flex-1 space-y-4 mb-8">
                      {isOrg(data) ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div><p className="text-slate-500 text-xs">CAC Number</p><p className="text-white">{data.cacNumber}</p></div>
                           <div><p className="text-slate-500 text-xs">TIN</p><p className="text-white">{data.tin}</p></div>
                           <div><p className="text-slate-500 text-xs">Contact Person</p><p className="text-white">{data.contactName}</p></div>
                           <div><p className="text-slate-500 text-xs">Team Size</p><p className="text-white">{data.teamSize}</p></div>
                           <div className="col-span-2"><p className="text-slate-500 text-xs">Services</p><p className="text-white">{data.servicesOffered?.join(', ')}</p></div>
                           <div className="col-span-2">
                             <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="text-cyan hover:underline flex items-center gap-1 text-xs">
                               Visit Website <ExternalLink size={10} />
                             </a>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-3 text-sm">
                           <div><p className="text-slate-500 text-xs">NIN</p><p className="text-white">{data.nin}</p></div>
                           <div><p className="text-slate-500 text-xs">Primary Skill</p><p className="text-white">{data.primarySkill}</p></div>
                           <div><p className="text-slate-500 text-xs">Key Project</p><p className="text-slate-300 italic">"{data.projectDescription}"</p></div>
                           <div>
                             <a href={data.portfolioLink} target="_blank" rel="noreferrer" className="text-cyan hover:underline flex items-center gap-1 text-xs">
                               View Portfolio <ExternalLink size={10} />
                             </a>
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="flex items-center gap-3 mt-auto pt-6 border-t border-white/5">
                      <button 
                        onClick={() => handleAction(partner.id, 'rejected')}
                        disabled={processingId === partner.id}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleAction(partner.id, 'approved')}
                        disabled={processingId === partner.id}
                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingId === partner.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Approve Partner
                      </button>
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminPartners;