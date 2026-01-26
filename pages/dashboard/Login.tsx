import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Briefcase, Building2, Loader2, Mail, Lock, AlertTriangle, Copy, Check, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';

const Login: React.FC = () => {
  const { user, loginWithGoogle, loginWithEmail, signupWithEmail, assignRole, loginAsDemoUser, loading, error: globalError, clearError } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  useEffect(() => {
    if (user && user.role) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Sync global context errors to local display, handling specialized formats
  useEffect(() => {
    if (globalError) {
      if (globalError.startsWith('DOMAIN_ERROR:')) {
        setLocalError(globalError);
      } else {
        setLocalError(mapAuthError({ code: 'custom', message: globalError }));
      }
    }
  }, [globalError]);

  const handleRoleSelection = async (role: any) => {
    await assignRole(role);
    navigate('/dashboard');
  };

  const mapAuthError = (err: any) => {
    if (typeof err.message === 'string' && (err.message.includes('invalid-credential') || err.message.includes('user-not-found'))) {
       return "Invalid email or password.";
    }

    const code = err.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      return "Invalid email or password. If you haven't created a real account yet, please switch to 'Create Account'.";
    }
    if (code === 'auth/email-already-in-use') {
      return "That email is already registered. Please sign in instead.";
    }
    if (code === 'auth/weak-password') {
      return "Password should be at least 6 characters.";
    }
    return err.message || 'Authentication failed. Please try again.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signupWithEmail(formData.email, formData.password, formData.name);
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
    } catch (err: any) {
      setLocalError(mapAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError('');
    clearError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  const copyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="text-cyan animate-spin" size={40} />
      </div>
    );
  }

  // State 1: Not Logged In (Show Auth Forms)
  if (!user) {
    const isDomainError = localError.startsWith('DOMAIN_ERROR:');
    const domainToAuth = isDomainError ? localError.split('DOMAIN_ERROR:')[1].trim() : '';

    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight relative overflow-hidden px-6 py-12">
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-center pt-8 pb-4">
             {/* Increased size to h-16 for impact */}
             <Logo className="h-16 w-auto" stacked={true} />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button 
              onClick={() => { setMode('signin'); setLocalError(''); clearError(); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'signin' ? 'bg-white/5 text-cyan border-b-2 border-cyan' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('signup'); setLocalError(''); clearError(); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'signup' ? 'bg-white/5 text-cyan border-b-2 border-cyan' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-2 text-center">
              {mode === 'signin' ? 'Portal Access' : 'Join Nexus Portal'}
            </h1>
            <p className="text-slate-400 mb-6 text-center text-sm">
              {mode === 'signin' ? 'Manage your applications and projects.' : 'Start your journey with Jackson Multifacet.'}
            </p>

            {localError && !isDomainError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4 text-center">
                {localError}
              </div>
            )}

            {isDomainError && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2 font-bold text-amber-400">
                  <AlertTriangle size={16} /> Configuration Required
                </div>
                <p className="mb-3">The current preview domain is not authorized in Firebase. Please add this domain to <strong>Authentication &gt; Settings &gt; Authorized Domains</strong>:</p>
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded border border-amber-500/20">
                  <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-amber-100">{domainToAuth}</code>
                  <button 
                    onClick={() => copyDomain(domainToAuth)}
                    className="text-amber-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                   <User className="absolute left-3 top-3 text-slate-500" size={18} />
                   <input 
                     type="text" 
                     placeholder="Full Name" 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full bg-midnight/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-cyan focus:outline-none transition-colors"
                     required
                   />
                </div>
              )}
              
              <div className="relative">
                 <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                 <input 
                   type="email" 
                   placeholder="Email Address" 
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full bg-midnight/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-cyan focus:outline-none transition-colors"
                   required
                 />
              </div>

              <div className="relative">
                 <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                 <input 
                   type="password" 
                   placeholder="Password" 
                   value={formData.password}
                   onChange={e => setFormData({...formData, password: e.target.value})}
                   className="w-full bg-midnight/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-cyan focus:outline-none transition-colors"
                   required
                 />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan text-midnight font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting && mode !== 'signin' && mode !== 'signup' ? <Loader2 className="animate-spin" size={18} /> : (mode === 'signin' ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-slate-500 uppercase">Or continue with</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                  Google
                </>
              )}
            </button>

            {/* DEMO MODE TOGGLE */}
            <div className="mt-8 pt-6 border-t border-white/5">
              {!showDemoOptions ? (
                <button 
                  onClick={() => setShowDemoOptions(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-cyan transition-colors"
                >
                  <Terminal size={12} /> Developer Bypass / Demo Mode
                </button>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-slate-500 text-center mb-2">Select a role to bypass authentication:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => loginAsDemoUser('admin')} className="p-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20">Admin</button>
                    <button onClick={() => loginAsDemoUser('client')} className="p-2 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded hover:bg-indigo-500/20">Client</button>
                    <button onClick={() => loginAsDemoUser('candidate')} className="p-2 text-xs bg-cyan/10 text-cyan border border-cyan/20 rounded hover:bg-cyan/20">Candidate</button>
                    <button onClick={() => loginAsDemoUser('partner')} className="p-2 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded hover:bg-green-500/20">Partner</button>
                  </div>
                </div>
              )}
            </div>

            <button 
               onClick={() => navigate('/')}
               className="mt-6 w-full text-center text-xs text-slate-500 hover:text-white transition-colors"
            >
              &larr; Return to Website
            </button>
          </div>
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