import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, UserPlus, Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Recruitment: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
       {/* Hero */}
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
          Recruitment Portal
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan">Path</span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          Connecting elite talent with visionary organizations. Select your role to get started.
        </p>
      </motion.div>

      {/* Split Portals */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        
        {/* Candidate Portal Card */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 hover:from-cyan/50 hover:to-indigo-600/50 transition-all duration-500"
        >
          <div className="bg-midnight/90 h-full rounded-[22px] p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan/20 transition-all" />
            
            <div className="w-16 h-16 rounded-2xl bg-cyan/20 text-cyan flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
              <UserPlus size={32} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Talent Center</h2>
            <p className="text-sm text-cyan font-medium uppercase tracking-wider mb-6 relative z-10">For Candidates</p>
            
            <p className="text-slate-400 mb-8 leading-relaxed relative z-10 flex-1">
              Looking for your next big career move? Join our exclusive talent pool. We provide career coaching, CV optimization, and direct access to top-tier employers.
            </p>
            
            <ul className="space-y-3 mb-8 relative z-10">
               {['Submit CV & Portfolio', 'Get Verified (ID & Guarantors)', 'Access Hidden Jobs', 'Salary Negotiation Support'].map(item => (
                 <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                   <CheckCircle size={16} className="text-cyan shrink-0 mt-0.5" />
                   {item}
                 </li>
               ))}
            </ul>

            <Link 
              to="/dashboard"
              className="w-full py-4 rounded-xl bg-cyan text-midnight font-bold flex items-center justify-center gap-2 hover:bg-white transition-all relative z-10 group/btn"
            >
              Register / Login <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Employer Portal Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 hover:from-indigo-500/50 hover:to-purple-600/50 transition-all duration-500"
        >
          <div className="bg-midnight/90 h-full rounded-[22px] p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all" />
            
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
              <Building2 size={32} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Client Hub</h2>
            <p className="text-sm text-indigo-400 font-medium uppercase tracking-wider mb-6 relative z-10">For Employers</p>
            
            <p className="text-slate-400 mb-8 leading-relaxed relative z-10 flex-1">
              Building a world-class team? We handle the heavy lifting of recruitment. From executive search to cultural fit assessment, we deliver candidates who drive impact.
            </p>
            
            <ul className="space-y-3 mb-8 relative z-10">
               {['Request Staffing', 'Browse Vetted Profiles', 'Background Checks Included', 'Replacement Guarantee'].map(item => (
                 <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                   <CheckCircle size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                   {item}
                 </li>
               ))}
            </ul>

            <Link 
              to="/contact"
              state={{ category: 'recruitment', subServices: ['I need to hire'] }}
              className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all relative z-10 group/btn"
            >
              Request Talent <Briefcase size={18} className="group-hover/btn:scale-110 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Shared Metrics/Footer info for Recruitment */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-12">
        {[
            { label: 'Placements', value: '500+' },
            { label: 'Active Candidates', value: '2.5k' },
            { label: 'Corporate Partners', value: '120+' },
            { label: 'Success Rate', value: '96%' }
        ].map((stat, i) => (
            <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Recruitment;