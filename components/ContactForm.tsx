import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, User, Briefcase, Terminal, CheckCircle, Check, Loader2, MessageSquare } from 'lucide-react';
import { FormData } from '../types';
import { DbService } from '../services/db';
import { useLocation } from 'react-router-dom';

const ContactForm: React.FC = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    category: null,
    subServices: [],
    name: '',
    email: '',
    budget: 50000,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deep link handler
  useEffect(() => {
    if (location.state && location.state.category) {
      setFormData(prev => ({
        ...prev,
        category: location.state.category,
        subServices: location.state.subServices || []
      }));
      setStep(2);
      
      // Scroll to contact section if not already there
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  const handleCategorySelect = (cat: FormData['category']) => {
    setFormData({ ...formData, category: cat, subServices: [] });
    setStep(2);
  };

  const toggleSubService = (service: string) => {
    const current = formData.subServices;
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service];
    setFormData({ ...formData, subServices: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await DbService.submitContactForm(formData);
    
    setIsSubmitting(false);
    if (success) {
      setIsSubmitted(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const getSubServices = () => {
    if (formData.category === 'business_dev') return ['CV Revamp', 'Branding Strategy', 'Business Proposal', 'Company Registration'];
    if (formData.category === 'recruitment') return ['I need to hire', 'I am looking for a job', 'HR Consultancy'];
    if (formData.category === 'it_support') return ['Web Development', 'Mobile App', 'Technical Support', 'Software Maintenance'];
    if (formData.category === 'general') return ['Partnership', 'Press Inquiry', 'Feedback', 'Other'];
    return [];
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="relative z-10 py-24 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center max-w-lg relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400 relative z-10">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Message Sent Successfully!</h3>
          <p className="text-sm text-slate-200 relative z-10">
            Thank you, {formData.name}. We have received your inquiry securely. Our team at Jackson Multifacet will review your details and respond via email shortly.
          </p>
          <button 
            onClick={() => { setIsSubmitted(false); setStep(1); setFormData({...formData, category: null, subServices: [], message: ''}); }}
            className="mt-6 text-cyan hover:underline relative z-10 font-medium text-sm"
          >
            Start a new request
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative z-10 py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
            To ensure a streamlined response and data security, please use the form below for all inquiries. We do not publish direct contact information to prevent spam and ensure your request reaches the right department immediately.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative group transition-all duration-500">
          
          {/* Subtle Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
               alt="Global Network" 
               className="w-full h-full object-cover opacity-20 group-hover:opacity-25 transition-all duration-1000 mix-blend-screen"
             />
             <div className="absolute inset-0 bg-midnight/40" />
          </div>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-white/10 w-full z-20">
            <motion.div 
              className="h-full bg-cyan shadow-[0_0_10px_#00d4ff]" 
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col justify-center relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-white mb-2 text-center md:text-left">How can we help you today?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'recruitment', icon: User, label: 'Recruitment' },
                      { id: 'business_dev', icon: Briefcase, label: 'Business Dev' },
                      { id: 'it_support', icon: Terminal, label: 'IT Support' },
                      { id: 'general', icon: MessageSquare, label: 'General Inquiry / Other' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleCategorySelect(item.id as FormData['category'])}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-cyan/50 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all group/btn backdrop-blur-md text-left"
                      >
                        <div className="p-2 rounded-lg bg-midnight/30 text-slate-300 group-hover/btn:text-cyan transition-colors">
                           <item.icon size={20} />
                        </div>
                        <span className="font-medium text-white text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-2 text-xs transition-colors">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <h3 className="text-xl font-semibold text-white">Specific Area of Interest</h3>
                  <p className="text-slate-300 text-xs">Select all that apply for <span className="text-cyan font-medium">{formData.category?.replace('_', ' ')}</span></p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {getSubServices().map((svc) => (
                      <label 
                        key={svc} 
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all backdrop-blur-md ${
                          formData.subServices.includes(svc) 
                            ? 'bg-cyan/20 border-cyan text-white shadow-[0_0_10px_rgba(0,212,255,0.1)]' 
                            : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={formData.subServices.includes(svc)}
                          onChange={() => toggleSubService(svc)}
                        />
                        <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${
                           formData.subServices.includes(svc) ? 'bg-cyan border-cyan' : 'border-slate-500'
                        }`}>
                          {formData.subServices.includes(svc) && <Check size={10} className="text-midnight" />}
                        </div>
                        <span className="text-sm">{svc}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={formData.subServices.length === 0}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                      Next Step <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <button type="button" onClick={() => setStep(2)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-2 text-xs transition-colors">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <h3 className="text-xl font-semibold text-white">Your Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition-colors backdrop-blur-sm placeholder:text-slate-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition-colors backdrop-blur-sm placeholder:text-slate-500"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  {formData.category !== 'general' && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300">Project Budget (Estimate)</label>
                        <span className="text-cyan font-mono font-bold text-sm">₦{formData.budget.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10000" 
                        max="1000000" 
                        step="10000"
                        value={formData.budget}
                        onChange={e => setFormData({...formData, budget: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan hover:accent-cyan/80"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>₦10k</span>
                        <span>₦1M+</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs text-slate-300">Additional Information / Questions</label>
                    <textarea 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition-colors backdrop-blur-sm placeholder:text-slate-500 h-24 resize-none"
                      placeholder="Please provide any extra details or questions you have..."
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex items-center gap-2 px-6 py-2.5 bg-cyan text-midnight font-bold rounded-full text-sm transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;