import React, { useState } from 'react';
import { Mail, Check, Loader2, ArrowRight } from 'lucide-react';
import { DbService } from '../services/db';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const success = await DbService.subscribeToNewsletter(email);
    if (success) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
    }
  };

  return (
    <footer className="relative z-10 py-12 border-t border-white/10 bg-midnight/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            {/* Updated size to h-10 */}
            <Logo className="h-10 w-auto" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering businesses through elite recruitment, strategic development, and robust IT infrastructure.
            </p>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Real Value & Stakes Limited. All rights reserved.</p>
          </div>

          {/* Newsletter Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <Mail size={16} className="text-cyan" />
              Subscribe to Our Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Get the latest insights on recruitment trends, business growth strategies, and tech updates directly to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-midnight border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan focus:outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 min-w-[100px] ${
                  status === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-cyan text-midnight hover:bg-white'
                }`}
              >
                {status === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === 'success' ? (
                  <>
                    <Check size={16} /> Added
                  </>
                ) : (
                  <>
                    Join <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/partner-registration" className="hover:text-cyan transition-colors">Join as Partner</Link>
            <a href="#" className="hover:text-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan transition-colors">Terms of Service</a>
          </div>
          <div className="text-xs text-slate-600 font-mono">
             Designed for impact.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;