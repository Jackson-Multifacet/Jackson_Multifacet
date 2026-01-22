import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan text-sm font-medium mb-6 tracking-wide backdrop-blur-md">
            The Future of Corporate Services
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Elevating Business <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-indigo-400 to-purple-500 animate-pulse-slow">
              Through Innovation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Jackson Multifacet empowers your enterprise with elite Recruitment, strategic Business Development, and cutting-edge IT Support.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#contact"
              className="px-8 py-4 bg-cyan text-midnight font-bold rounded-full hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Start a Project
            </a>
            <a 
              href="#services"
              className="px-8 py-4 bg-white/5 text-white font-medium border border-white/10 rounded-full hover:bg-white/10 backdrop-blur-md transition-all w-full sm:w-auto"
            >
              Explore Services
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="text-slate-500 animate-bounce" size={24} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
