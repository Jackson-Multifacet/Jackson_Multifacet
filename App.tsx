import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Check, ArrowRight, Zap, 
  Users, Terminal, LineChart, Mail, Phone, ChevronRight 
} from 'lucide-react';

// --- SUB-COMPONENTS ---

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (v: boolean) => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-midnight/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Jackson<span className="text-cyan">Multifacet</span>
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Real Value & Stakes Ltd</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium text-slate-300 hover:text-cyan transition-colors">Services</a>
          <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-cyan transition-colors">Pricing</a>
          <a href="#contact" className="px-6 py-2 bg-cyan/10 text-cyan border border-cyan/50 rounded-full text-sm font-bold hover:bg-cyan hover:text-midnight transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            Client Portal
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-midnight border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Services</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Pricing</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-cyan">Contact Us</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
    </div>

    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
          <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Accepting New Corporate Clients</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
          Elevating Business <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-indigo-400 to-purple-500">
            Through Innovation
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Jackson Multifacet empowers your enterprise with elite Recruitment, strategic Business Development, and cutting-edge IT Support.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-cyan text-midnight font-bold rounded-xl hover:bg-white transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
            Start a Project
          </a>
          <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-md transition-all">
            Explore Services
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const ServiceCard = ({ icon: Icon, title, desc, features, color }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card p-8 rounded-3xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 p-32 rounded-full blur-[80px] opacity-10 bg-${color}-500 group-hover:opacity-20 transition-opacity`} />
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 mb-8 leading-relaxed text-sm">{desc}</p>
      <ul className="space-y-3">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <Check size={16} className={`text-${color}-400 shrink-0 mt-0.5`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Services = () => (
  <section id="services" className="py-24 px-6 relative z-10">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Core Pillars</h2>
        <p className="text-slate-400">Comprehensive solutions designed for growth.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <ServiceCard 
          icon={Users}
          title="Recruitment"
          desc="Bridging the gap between talent and opportunity. We specialize in finding the perfect fit for your corporate culture."
          features={["Executive Search", "Candidate Screening", "Background Checks", "Replacement Guarantee"]}
          color="indigo"
        />
        <ServiceCard 
          icon={LineChart}
          title="Business Dev"
          desc="We construct the narrative that sells your value. From branding to proposal writing, we secure your next big win."
          features={["CV Revamping", "Proposal Writing", "Branding Strategy", "Market Research"]}
          color="cyan"
        />
        <ServiceCard 
          icon={Terminal}
          title="IT Support"
          desc="Building the digital infrastructure your business needs to scale. From simple landing pages to complex apps."
          features={["Web Development", "App Development", "Tech Support", "Cybersecurity"]}
          color="emerald"
        />
      </div>
    </div>
  </section>
);

const Pricing = () => {
  const tiers = [
    {
      name: "Recruitment (Annual)",
      price: "₦20k - ₦500k",
      desc: "For companies building teams.",
      features: ["Access to Talent Pool", "Initial Screening", "Support for 1 Year"],
      highlight: false
    },
    {
      name: "Candidate Placement",
      price: "50%",
      sub: "of 1st Month Salary",
      desc: "Success-fee model for job seekers.",
      features: ["Pay only when hired", "Career Coaching", "Salary Negotiation"],
      highlight: true
    },
    {
      name: "Creative Services",
      price: "₦50,000+",
      desc: "Starting price for proposals.",
      features: ["Business Proposals", "CV Revamp (from ₦10k)", "Logo Design"],
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 relative z-10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Investment Tiers</h2>
          
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan/10 border border-cyan/50 text-cyan text-sm font-bold shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            <Zap size={16} fill="currentColor" />
            Flexible Pricing: Open to Negotiation
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier, i) => (
            <div key={i} className={`rounded-3xl p-8 border ${
              tier.highlight 
                ? 'bg-gradient-to-b from-white/10 to-transparent border-cyan/50 shadow-2xl relative z-10 md:scale-110' 
                : 'bg-white/5 border-white/10'
            }`}>
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-cyan text-midnight font-bold text-xs rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-300 mb-2">{tier.name}</h3>
              <div className="mb-1">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
              </div>
              {tier.sub && <p className="text-sm text-cyan font-mono mb-4">{tier.sub}</p>}
              {!tier.sub && <p className="text-sm text-slate-500 mb-4 font-mono">Starting range</p>}
              
              <p className="text-sm text-slate-400 mb-8 border-b border-white/10 pb-8">{tier.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={16} className={tier.highlight ? "text-cyan" : "text-slate-500"} />
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact" className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${
                tier.highlight 
                  ? 'bg-cyan text-midnight hover:bg-white shadow-lg shadow-cyan/20' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 px-6 relative z-10">
    <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12 border border-white/10">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">Let's Build Together</h2>
          <p className="text-slate-400 mb-8">
            Reach out to Jackson Multifacet for inquiries regarding recruitment, partnerships, or IT services.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cyan">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase font-bold">Email Us</p>
                <p className="text-white">contact@jacksonmultifacet.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase font-bold">Call Us</p>
                <p className="text-white">+234 (0) 800 123 4567</p>
              </div>
            </div>

            <div className="p-4 bg-cyan/5 border border-cyan/20 rounded-xl mt-8">
              <p className="text-sm text-cyan">
                <strong>Note:</strong> We typically respond to new partnership requests within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="bg-midnight border border-white/10 rounded-lg p-3 text-white text-sm focus:border-cyan outline-none" />
            <input type="text" placeholder="Last Name" className="bg-midnight border border-white/10 rounded-lg p-3 text-white text-sm focus:border-cyan outline-none" />
          </div>
          <input type="email" placeholder="Email Address" className="w-full bg-midnight border border-white/10 rounded-lg p-3 text-white text-sm focus:border-cyan outline-none" />
          <select className="w-full bg-midnight border border-white/10 rounded-lg p-3 text-white text-sm focus:border-cyan outline-none appearance-none">
            <option>I am interested in...</option>
            <option>Recruitment Services</option>
            <option>Business Development</option>
            <option>IT Support Project</option>
            <option>Partnership</option>
          </select>
          <textarea placeholder="Tell us about your project or needs..." rows={4} className="w-full bg-midnight border border-white/10 rounded-lg p-3 text-white text-sm focus:border-cyan outline-none resize-none"></textarea>
          
          <button className="w-full py-4 bg-gradient-to-r from-cyan to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            Send Message <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 bg-midnight py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-white mb-2">Jackson<span className="text-cyan">Multifacet</span></h2>
        <p className="text-xs text-slate-500">© 2025 Real Value & Stakes Limited.</p>
      </div>
      <div className="flex gap-6 text-sm text-slate-400">
        <a href="#" className="hover:text-cyan transition-colors">Privacy</a>
        <a href="#" className="hover:text-cyan transition-colors">Terms</a>
        <a href="#" className="hover:text-cyan transition-colors">Portal Login</a>
      </div>
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-midnight text-white selection:bg-cyan/30 selection:text-white font-sans">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;