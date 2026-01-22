import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, FileText, PenTool, Target, PieChart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessDev: React.FC = () => {
  const services = [
    {
      icon: FileText,
      title: "CV Revamping",
      desc: "Transform your professional profile with ATS-compliant, narrative-driven resumes that capture attention."
    },
    {
      icon: PenTool,
      title: "Proposal Writing",
      desc: "Winning business proposals, grant applications, and pitch decks structured to secure funding and contracts."
    },
    {
      icon: Target,
      title: "Branding Strategy",
      desc: "Comprehensive brand identity development, from logo design to voice and tone guidelines."
    },
    {
      icon: PieChart,
      title: "Market Research",
      desc: "Data-driven insights into market trends, competitor analysis, and customer behavior."
    }
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-cyan mb-6">
            <LineChart className="w-5 h-5" />
            <span className="uppercase tracking-widest font-bold text-xs">Growth & Strategy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Architecting <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-white">Your Success</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            In a crowded marketplace, perception is reality. We refine your professional image and corporate strategy to maximize value and impact.
          </p>
          <div className="flex gap-4">
             <Link 
               to="/contact" 
               state={{ category: 'business_dev' }}
               className="px-6 py-3 bg-cyan text-midnight font-bold rounded-lg hover:bg-white transition-colors"
             >
               Get a Consultation
             </Link>
             <Link to="/pricing" className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
               View Pricing
             </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-purple-500/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
             {/* Abstract chart visualization */}
             <div className="flex items-end gap-4 h-64 mb-6 px-4 pb-4 border-b border-white/10">
                {[40, 65, 45, 80, 55, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="flex-1 bg-gradient-to-t from-cyan/20 to-cyan rounded-t-sm relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-cyan font-mono">
                      {h}%
                    </div>
                  </motion.div>
                ))}
             </div>
             <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-midnight/50 border border-white/5 hover:border-cyan/50 hover:bg-white/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-cyan group-hover:text-midnight transition-colors text-cyan">
              <s.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{s.desc}</p>
            <Link 
              to="/contact" 
              state={{ category: 'business_dev' }}
              className="text-xs font-bold text-cyan flex items-center gap-1 hover:gap-2 transition-all"
            >
              INQUIRE <ArrowUpRight size={12} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BusinessDev;