import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { PricingTier } from '../types';
import SwipeHint from './SwipeHint';

const tiers: PricingTier[] = [
  {
    title: "Recruitment (Annual)",
    price: "₦20k - ₦500k",
    features: [
      "Access to premium talent pool",
      "Initial candidate screening",
      "Background checks",
      "12-month replacement guarantee"
    ],
    highlight: false
  },
  {
    title: "Candidate Placement",
    price: "50%",
    features: [
      "Success-fee model",
      "50% of 1st month salary",
      "Pay only when hired",
      "Career coaching included",
      "Salary negotiation support"
    ],
    highlight: true
  },
  {
    title: "Creative & Branding",
    price: "₦10k+",
    features: [
      "Proposals from ₦50,000",
      "Logo & Identity from ₦10,000",
      "CV Revamp services",
      "Custom web development quote"
    ],
    highlight: false
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-bold text-white mb-4">Investment Tiers</h2>
          <p className="text-slate-400">Transparent pricing for premium value.</p>
          
          {/* Negotiation Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-cyan/50 bg-cyan/5 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan"></span>
            </span>
            <span className="text-sm font-medium text-cyan">
              Flexible Pricing: Open to negotiation to meet your budget
            </span>
          </motion.div>
        </div>

        <div className="relative">
          <SwipeHint />
          <div className="flex md:grid md:grid-cols-3 gap-8 items-stretch overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className={`relative min-w-[85vw] md:min-w-0 snap-center p-8 rounded-3xl backdrop-blur-xl border flex flex-col h-auto md:h-full overflow-hidden ${
                  tier.highlight 
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-cyan/50 shadow-[0_0_30px_rgba(0,212,255,0.15)] z-10 md:scale-105' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Background Image for Highlighted Tier */}
                {tier.highlight && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" 
                      alt="Abstract Background" 
                      className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-midnight/80" />
                  </div>
                )}

                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan to-indigo-500 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg z-20">
                    Most Popular
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-xl font-medium text-slate-300 mb-2">{tier.title}</h3>
                  <div className="text-3xl font-bold text-white mb-6 font-mono">
                    {tier.price}
                  </div>

                  <div className="w-full h-px bg-white/10 mb-6" />

                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                        <Check size={18} className="text-cyan shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${
                    tier.highlight 
                      ? 'bg-cyan text-midnight hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]' 
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}>
                    Start Now
                    <Zap size={16} className={`transition-transform group-hover:scale-125 ${tier.highlight ? 'text-midnight' : 'text-cyan'}`} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;