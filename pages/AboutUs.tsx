import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Shield, ArrowRight, Building2, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      desc: "We operate with absolute transparency. From our recruitment fee structure to our business development contracts, trust is our currency."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "We don't just follow trends; we set them. Our IT solutions and strategic frameworks are designed for the future of work."
    },
    {
      icon: Users,
      title: "Empowerment",
      desc: "Whether placing a candidate or revamping a CV, our goal is to empower individuals and businesses to reach their peak potential."
    },
    {
      icon: TrendingUp,
      title: "Value Creation",
      desc: "As our parent name suggests, delivering 'Real Value' is at the core of every interaction and service we provide."
    }
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
      
      {/* Hero Section */}
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-widest mb-4">
            Who We Are
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-indigo-500">Expectations</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Jackson Multifacet is the dynamic operational arm of <strong className="text-white">Real Value & Stakes Limited</strong>. 
            We bridge the gap between human potential, technological advancement, and strategic business growth.
          </p>
        </motion.div>
      </div>

      {/* Corporate Structure */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Building2 className="text-cyan w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Our Structure</h2>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Parent & Subsidiary</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Real Value & Stakes Limited serves as the backbone of our operations, providing financial oversight, strategic governance, and a legacy of trust. Jackson Multifacet acts as the forward-facing service provider, executing our vision in Recruitment, IT, and Business Development.
              </p>
              <div className="flex flex-col gap-3 border-l-2 border-white/10 pl-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Real Value & Stakes Ltd (Parent Company)
                </div>
                <div className="flex items-center gap-2 text-sm text-white font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#00d4ff]" />
                  Jackson Multifacet (Service Provider)
                </div>
              </div>
            </div>
            
            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 group">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                alt="Corporate Architecture" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-bold text-lg">Global Standards</p>
                <p className="text-cyan text-sm">Local Expertise</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/20 backdrop-blur-md"
        >
          <Target className="w-10 h-10 text-cyan mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-slate-300 leading-relaxed">
            To revolutionize the corporate landscape by connecting elite talent with visionary companies, creating robust digital infrastructures, and crafting compelling business narratives that drive growth.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-cyan/5 border border-cyan/20 backdrop-blur-md"
        >
          <Globe className="w-10 h-10 text-indigo-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
          <p className="text-slate-300 leading-relaxed">
            To be the premier multi-faceted consultancy firm in Africa, recognized for integrity, speed, and the ability to deliver 'Real Value' in every stakeholder interaction.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Core Values</h2>
          <p className="text-slate-400">The principles that guide our every move.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-midnight border border-white/10 flex items-center justify-center mb-4 text-cyan group-hover:scale-110 transition-transform">
                <val.icon size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{val.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center bg-gradient-to-r from-cyan/20 to-indigo-600/20 border border-white/10 rounded-3xl p-12 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to experience Real Value?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-3 bg-cyan text-midnight font-bold rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              Contact Us <ArrowRight size={18} />
            </Link>
            <Link 
              to="/services"
              className="px-8 py-3 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      </motion.div>

    </div>
  );
};

export default AboutUs;