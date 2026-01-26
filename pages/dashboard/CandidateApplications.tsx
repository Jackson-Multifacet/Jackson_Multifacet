import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { JobApplication } from '../../types';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle, Clock, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CandidateApplications: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        const data = await DbService.getCandidateApplications(user.uid);
        setApps(data);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Offer': return 'bg-green-500/20 text-green-400';
      case 'Rejected': return 'bg-red-500/20 text-red-400';
      case 'Interview': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Offer': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Interview': return <Calendar size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">My Applications</h2>
        <p className="text-slate-400 text-sm">Track the status of your submissions.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading history...</div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Job Role</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Applied Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apps.map((app) => (
                  <motion.tr 
                    key={app.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-bold">{app.jobTitle}</td>
                    <td className="px-6 py-4 text-slate-300">{app.company}</td>
                    <td className="px-6 py-4 text-slate-400">{app.appliedAt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-cyan hover:text-white text-xs font-bold transition-colors">
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;