import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, Briefcase, Terminal, Code, Cpu, LineChart, FileText, Search } from 'lucide-react';
import SwipeHint from './SwipeHint';
import { Link } from 'react-router-dom';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
  hover: {
    y: -8,
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
    borderColor: 'rgba(0, 212, 255, 0.4)'
  }
};

const ServicesGrid: React.FC = () => {
  return (
    <section id="services" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-slate-400 mb-4"
        >
          Our Core Pillars
        </motion.h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Comprehensive solutions tailored for modern business growth. Click to explore more.
        </p>
      </div>

      <div className="relative">
        <SwipeHint />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex md:grid md:grid-cols-3 md:grid-rows-2 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {/* Recruitment Pillar - Large Item */}
          <Link to="/recruitment" className="contents">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="cursor-pointer min-w-[85vw] md:min-w-0 snap-center md:col-span-2 row-span-1 p-8 rounded-3xl backdrop-blur-xl bg-midnight/40 border border-white/10 flex flex-col justify-between group overflow-hidden relative"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200" 
                  alt="Corporate Team" 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-700 mix-blend-overlay scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/80 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 backdrop-blur-md">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Recruitment Services</h3>
                </div>
                <p className="text-slate-300 mb-6 max-w-md drop-shadow-md">
                  Bridging the gap between talent and opportunity. We specialize in finding the perfect fit for your corporate culture.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto relative z-10">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <h4 className="flex items-center gap-2 text-cyan mb-2 font-medium"><Briefcase size={16} /> Corporate Staffing</h4>
                  <p className="text-xs text-slate-300">Executive search & permanent placement solutions.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <h4 className="flex items-center gap-2 text-cyan mb-2 font-medium"><Search size={16} /> Candidate Placement</h4>
                  <p className="text-xs text-slate-300">Connecting skilled professionals with top employers.</p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Business Dev Pillar - Tall Item */}
          <Link to="/business-dev" className="contents">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="cursor-pointer min-w-[85vw] md:min-w-0 snap-center md:col-span-1 md:row-span-2 p-8 rounded-3xl backdrop-blur-xl bg-midnight/40 border border-white/10 flex flex-col relative overflow-hidden group"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                  alt="Analytics Data" 
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-all duration-700 mix-blend-color-dodge scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-transparent" />
              </div>

              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan/10 rounded-full blur-3xl group-hover:bg-cyan/20 transition-all duration-500 z-10" />
              
              <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan backdrop-blur-md">
                  <LineChart size={24} />
                </div>
                <h3 className="text-2xl font-semibold text-white">Business Dev</h3>
              </div>
              
              <ul className="space-y-4 flex-1 relative z-10">
                {[
                  { icon: FileText, text: 'CV Revamping' },
                  { icon: Briefcase, text: 'Proposal Writing' },
                  { icon: Users, text: 'Branding Strategy' },
                  { icon: Search, text: 'Market Research' },
                  { icon: LineChart, text: 'Growth Analytics' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 group/item cursor-default">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00d4ff]" />
                    <span className="group-hover/item:text-white transition-colors">{item.text}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Strategy</p>
                <p className="text-sm text-slate-300">
                  We construct the narrative that sells your value to the world.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* IT Support Pillar - Terminal Style */}
          <Link to="/it-support" className="contents">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="cursor-pointer min-w-[85vw] md:min-w-0 snap-center md:col-span-2 row-span-1 p-0 rounded-3xl backdrop-blur-xl bg-[#0d1117]/80 border border-white/10 flex flex-col overflow-hidden font-mono group relative"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Code" 
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-700 mix-blend-luminosity scale-100 group-hover:scale-105"
                />
                {/* Strong overlay to maintain terminal readability */}
                <div className="absolute inset-0 bg-[#0d1117]/80" />
              </div>

              {/* Fake Window Bar */}
              <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/5 relative z-10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-500">jackson-terminal — -zsh</span>
              </div>

              <div className="p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center h-full relative z-10">
                <div className="flex-1 space-y-2 text-sm md:text-base">
                  <div className="flex gap-2">
                    <span className="text-green-400">➜</span>
                    <span className="text-cyan">~</span>
                    <span className="text-slate-300">init_project --type=web</span>
                  </div>
                  <div className="text-slate-400 pl-6">
                    &gt; Initializing full-stack environment...<br/>
                    &gt; React, Node, Python loaded.<br/>
                    &gt; <span className="text-green-400">Success.</span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-dashed border-white/10">
                      <Code className="text-indigo-400" />
                      <Cpu className="text-cyan" />
                      <Terminal className="text-green-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 font-sans">IT Support & Dev</h3>
                  <p className="text-slate-400 text-sm font-sans mb-4">
                    From simple landing pages to complex enterprise applications. We build the digital infrastructure your business needs to scale.
                  </p>
                  <button className="text-xs border border-green-500/30 text-green-400 bg-green-500/5 px-3 py-1 rounded hover:bg-green-500/10 transition-colors">
                    ./view_portfolio.sh
                  </button>
                </div>
              </div>
            </motion.div>
          </Link>

        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;