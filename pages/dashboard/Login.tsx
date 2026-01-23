import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Briefcase, Building2, LogIn, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const { user, loginWithGoogle, assignRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in and has a role, go to dashboard
    if (user && user.role) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRoleSelection = async (role: any) => {
    await assignRole(role);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="text-cyan animate-spin" size={40} />
      </div>
    );
  }

  // State 1: Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight relative overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Nexus Login</h1>
          <p className="text-slate-400 mb-8">Secure Access for Jackson Multifacet</p>

          <button 
            onClick={loginWithGoogle}
            className="w-full py-4 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors shadow-lg"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="G" />
            Sign in with Google
          </button>

          <button 
             onClick={() => navigate('/')}
             className="mt-8 text-sm text-slate-500 hover:text-white transition-colors"
          >
            &larr; Return to Website
          </button>
        </motion.div>
      </div>
    );
  }

  // State 2: Logged In but No Role (Onboarding)
  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight relative overflow-hidden px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-3xl bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl text-center"
      >
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-cyan" />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}</h1>
        <p className="text-slate-400 mb-8">Please select your portal access type to continue.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RoleButton 
            icon={Shield} 
            color="red" 
            title="Admin" 
            desc="System Control" 
            onClick={() => handleRoleSelection('admin')} 
          />
          <RoleButton 
            icon={Building2} 
            color="indigo" 
            title="Client" 
            desc="Hiring Manager" 
            onClick={() => handleRoleSelection('client')} 
          />
          <RoleButton 
            icon={User} 
            color="cyan" 
            title="Candidate" 
            desc="Job Seeker" 
            onClick={() => handleRoleSelection('candidate')} 
          />
          <RoleButton 
            icon={Briefcase} 
            color="green" 
            title="Partner" 
            desc="Staff/Agency" 
            onClick={() => handleRoleSelection('partner')} 
          />
        </div>
      </motion.div>
    </div>
  );
};

const RoleButton = ({ icon: Icon, color, title, desc, onClick }: any) => {
  const colors: any = {
    red: "text-red-400 border-white/10 hover:border-red-500/50 hover:bg-red-500/10",
    indigo: "text-indigo-400 border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10",
    cyan: "text-cyan border-white/10 hover:border-cyan/50 hover:bg-cyan/10",
    green: "text-green-400 border-white/10 hover:border-green-500/50 hover:bg-green-500/10"
  };

  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-2xl bg-white/5 border transition-all group flex flex-col items-center gap-3 ${colors[color]}`}
    >
      <Icon size={32} className="group-hover:scale-110 transition-transform" />
      <div>
        <span className="text-white font-bold block">{title}</span>
        <span className="text-xs text-slate-500">{desc}</span>
      </div>
    </button>
  );
};

export default Login;