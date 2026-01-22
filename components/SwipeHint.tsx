import React from 'react';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

const SwipeHint: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="absolute bottom-8 right-4 z-30 md:hidden pointer-events-none"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-cyan/20 blur-lg rounded-full" />
        
        <div className="relative bg-black/60 backdrop-blur-md border border-white/10 rounded-full py-2 px-4 flex items-center gap-3 shadow-xl">
          <motion.div
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Hand className="text-cyan w-4 h-4 rotate-12" />
          </motion.div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">Swipe</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeHint;