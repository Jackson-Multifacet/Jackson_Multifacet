import React from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-midnight overflow-hidden">
      {/* Moving Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #1f2937 1px, transparent 1px),
                            linear-gradient(to bottom, #1f2937 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }} 
      />

      {/* Primary Neon Blob (Cyan) */}
      <motion.div
        animate={{
          x: [0, 400, 0],
          y: [0, -300, 0],
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-cyan blur-[120px] mix-blend-screen"
      />
      
      {/* Secondary Neon Blob (Purple/Indigo) */}
      <motion.div
        animate={{
          x: [0, -300, 0],
          y: [0, 200, 0],
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] rounded-full bg-indigo-600 blur-[140px] mix-blend-screen"
      />

      {/* Accent Blob (Magenta/Pink) */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, 150, -150, 0],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full bg-fuchsia-600 blur-[150px] mix-blend-screen"
      />
      
      {/* Noise Texture for that high-end feel */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`
           }} 
      />
    </div>
  );
};

export default Background;