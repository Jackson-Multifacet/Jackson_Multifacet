import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, Smartphone, Globe, Shield, Database, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITSupport: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10 font-mono">
      <div className="border border-white/10 bg-[#0d1117]/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl mb-16">
        {/* Terminal Header */}
        <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-xs text-slate-500">jackson-multifacet -- dev -- -zsh</div>
          <div className="w-10"></div>
        </div>

        {/* Terminal Body */}
        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-slate-400 mb-6">
              <span className="text-green-400">user@jackson:~$</span> ./display_services.sh --verbose
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-cyan">&lt;</span>
              IT Support & Development
              <span className="text-cyan">/&gt;</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-3xl mb-12 border-l-2 border-white/20 pl-6">
              Robust digital infrastructure is non-negotiable. We deliver full-stack solutions, from responsive web applications to enterprise-grade security protocols.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Globe className="text-indigo-400 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Web Development</h3>
                    <p className="text-sm text-slate-400">React, Next.js, Node.js. High-performance sites.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Smartphone className="text-purple-400 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Mobile Solutions</h3>
                    <p className="text-sm text-slate-400">iOS & Android cross-platform development.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Database className="text-amber-400 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Database Management</h3>
                    <p className="text-sm text-slate-400">SQL/NoSQL architecture and optimization.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Shield className="text-green-400 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Cybersecurity</h3>
                    <p className="text-sm text-slate-400">Vulnerability assessment and protection.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Cloud className="text-cyan mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Cloud Infrastructure</h3>
                    <p className="text-sm text-slate-400">AWS/Azure deployment and maintenance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Cpu className="text-pink-400 mt-1" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Technical Support</h3>
                    <p className="text-sm text-slate-400">24/7 Troubleshooting and hardware support.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <Link 
                 to="/contact" 
                 state={{ category: 'it_support' }}
                 className="inline-block px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded font-bold hover:bg-green-500 hover:text-black transition-colors"
               >
                 ./initiate_project.exe
               </Link>
               <div className="flex items-center gap-2 text-slate-500 text-sm">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 System Ready
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ITSupport;