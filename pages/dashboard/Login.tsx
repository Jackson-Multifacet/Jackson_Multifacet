import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Briefcase, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: any) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight relative overflow-hidden px-6">
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Nexus Login</h1>
        <p className="text-slate-400 mb-8">Select a role to simulate the dashboard experience.</p>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleLogin('admin')}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-all group flex flex-col items-center gap-3"
          >
            <Shield size={32} className="text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold">Admin</span>
            <span className="text-xs text-slate-500">God Mode</span>
          </button>

          <button 
            onClick={() => handleLogin('candidate')}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 transition-all group flex flex-col items-center gap-3"
          >
            <User size={32} className="text-cyan group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold">Candidate</span>
            <span className="text-xs text-slate-500">Job Seeker</span>
          </button>

          <button 
            onClick={() => handleLogin('client')}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group flex flex-col items-center gap-3"
          >
            <Building2 size={32} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold">Client</span>
            <span className="text-xs text-slate-500">Hiring/Projects</span>
          </button>

          <button 
            onClick={() => handleLogin('partner')}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all group flex flex-col items-center gap-3"
          >
            <Briefcase size={32} className="text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold">Partner</span>
            <span className="text-xs text-slate-500">Staff/Freelancer</span>
          </button>
        </div>

        <button 
           onClick={() => navigate('/')}
           className="mt-8 text-sm text-slate-500 hover:text-white transition-colors"
        >
          &larr; Return to Website
        </button>
      </motion.div>
    </div>
  );
};

export default Login;