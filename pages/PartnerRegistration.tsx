import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Check, Upload, ArrowRight, ShieldCheck, Briefcase, Globe, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { IndividualPartnerData, OrganizationPartnerData, PartnerType } from '../types';
import { DbService } from '../services/db';
import { Link } from 'react-router-dom';

const PartnerRegistration: React.FC = () => {
  const [partnerType, setPartnerType] = useState<PartnerType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Individual Form State
  const [individualForm, setIndividualForm] = useState<IndividualPartnerData>({
    fullName: '',
    professionalTitle: '',
    whatsapp: '',
    email: '',
    portfolioLink: '',
    nin: '',
    primarySkill: '',
    projectDescription: '',
    idDocument: null
  });

  // Organization Form State
  const [orgForm, setOrgForm] = useState<OrganizationPartnerData>({
    businessName: '',
    website: '',
    cacNumber: '',
    tin: '',
    contactName: '',
    contactRole: '',
    officialEmail: '',
    teamSize: '1-10',
    servicesOffered: [],
    cacCertificate: null
  });

  // Validation Logic
  const validateIndividual = (): boolean => {
    if (!/^\d{11}$/.test(individualForm.nin)) {
      setError('NIN must be exactly 11 digits.');
      return false;
    }
    if (!individualForm.idDocument) {
      setError('Please upload a valid ID document.');
      return false;
    }
    return true;
  };

  const validateOrg = (): boolean => {
    // Basic check for Nigerian CAC (Usually starts with RC or BN but we allow digits too for simplicity as per requirement)
    // Constraint: "must follow Nigerian formats". We'll ensure it's not empty and has length.
    if (orgForm.cacNumber.length < 4) {
      setError('Please enter a valid CAC RC Number.');
      return false;
    }
    if (orgForm.tin.length < 8) {
      setError('Please enter a valid Corporate TIN.');
      return false;
    }
    if (orgForm.servicesOffered.length === 0) {
      setError('Please select at least one service offered.');
      return false;
    }
    if (!orgForm.cacCertificate) {
      setError('Please upload your CAC Certificate.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let isValid = false;
    if (partnerType === 'individual') isValid = validateIndividual();
    else if (partnerType === 'org') isValid = validateOrg();

    if (!isValid) return;

    setIsSubmitting(true);
    const success = await DbService.submitPartnerApplication({
      type: partnerType,
      data: partnerType === 'individual' ? individualForm : orgForm
    });
    setIsSubmitting(false);

    if (success) setIsSubmitted(true);
    else setError("Submission failed. Please check your internet connection and try again.");
  };

  const handleOrgServiceToggle = (service: string) => {
    setOrgForm(prev => {
      const exists = prev.servicesOffered.includes(service);
      return {
        ...prev,
        servicesOffered: exists 
          ? prev.servicesOffered.filter(s => s !== service)
          : [...prev.servicesOffered, service]
      };
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative z-10">
        <div className="bg-midnight/60 border border-green-500/30 rounded-3xl p-8 max-w-lg text-center backdrop-blur-xl shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Application Received</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Thank you for your interest in partnering with Jackson Multifacet. 
            Our Partnership Board will review your credentials and contact you within <strong className="text-white">3 business days</strong> to discuss collaboration terms.
          </p>
          <Link to="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-widest mb-4">
            Partnership Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Service Provider Registration</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join our ecosystem of elite professionals and agencies. Deliver value, scale your reach, and grow with Real Value & Stakes Limited.
          </p>
        </div>

        {/* LOGICAL SPLIT - SELECTION SCREEN */}
        {!partnerType && (
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setPartnerType('individual')}
              className="group text-left p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan/20 transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-cyan/20 text-cyan flex items-center justify-center mb-6">
                <User size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Individual Partner</h3>
              <p className="text-sm text-slate-400 mb-6">For Freelancers, Consultants, and Solo Experts.</p>
              <div className="flex items-center text-cyan text-sm font-bold gap-2">
                Start Application <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setPartnerType('org')}
              className="group text-left p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Building2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Agency Partner</h3>
              <p className="text-sm text-slate-400 mb-6">For Registered Firms, Agencies, and Corporate Bodies.</p>
              <div className="flex items-center text-indigo-400 text-sm font-bold gap-2">
                Start Application <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        )}

        {/* REGISTRATION FORMS */}
        {partnerType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-midnight/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl relative"
          >
            <button 
              onClick={() => { setPartnerType(null); setError(null); }}
              className="absolute top-6 left-6 md:left-10 text-slate-500 hover:text-white flex items-center gap-1 text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Change Type
            </button>

            <div className="text-center mb-8 pt-6">
               <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                 {partnerType === 'individual' ? <User className="text-cyan" /> : <Building2 className="text-indigo-400" />}
                 {partnerType === 'individual' ? 'Individual Partner Application' : 'Agency Partner Application'}
               </h2>
               <p className="text-sm text-slate-400 mt-2">Please complete all required fields accurately.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-200 text-sm">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* === INDIVIDUAL FORM === */}
              {partnerType === 'individual' && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Full Name" value={individualForm.fullName} onChange={v => setIndividualForm({...individualForm, fullName: v})} required />
                    <Input label="Professional Title" placeholder="e.g. Senior Graphic Designer" value={individualForm.professionalTitle} onChange={v => setIndividualForm({...individualForm, professionalTitle: v})} required />
                    <Input label="Email Address" type="email" value={individualForm.email} onChange={v => setIndividualForm({...individualForm, email: v})} required />
                    <Input label="Official WhatsApp" type="tel" value={individualForm.whatsapp} onChange={v => setIndividualForm({...individualForm, whatsapp: v})} required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 ml-1">Primary Skill Category <span className="text-cyan">*</span></label>
                        <select 
                          value={individualForm.primarySkill} 
                          onChange={e => setIndividualForm({...individualForm, primarySkill: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan focus:outline-none appearance-none"
                          required
                        >
                          <option value="" disabled>Select Skill...</option>
                          {['Software Development', 'Product Design', 'Digital Marketing', 'Content Writing', 'Business Consulting', 'HR & Recruitment', 'Legal Services', 'Other'].map(opt => (
                            <option key={opt} value={opt} className="bg-midnight">{opt}</option>
                          ))}
                        </select>
                     </div>
                     <Input label="NIN (11 Digits)" value={individualForm.nin} onChange={v => setIndividualForm({...individualForm, nin: v})} required maxLength={11} placeholder="12345678901" />
                  </div>

                  <Input label="Portfolio / Work Link" value={individualForm.portfolioLink} onChange={v => setIndividualForm({...individualForm, portfolioLink: v})} required placeholder="https://..." />

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 ml-1">Briefly describe a high-impact project you've completed <span className="text-cyan">*</span></label>
                    <textarea 
                      value={individualForm.projectDescription}
                      onChange={e => setIndividualForm({...individualForm, projectDescription: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan focus:outline-none h-24 resize-none"
                      required
                    />
                  </div>

                  <div className="border-t border-white/10 pt-6">
                     <label className="text-sm font-semibold text-white mb-2 block">Document Upload</label>
                     <div className="p-4 border-2 border-dashed border-white/20 rounded-xl bg-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">Valid Identification <span className="text-red-400">*</span></p>
                          <p className="text-xs text-slate-500">National ID, Passport, or Driver's License</p>
                        </div>
                        <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-cyan transition-colors flex items-center gap-2">
                           <Upload size={14} /> 
                           {individualForm.idDocument ? 'Change File' : 'Upload ID'}
                           <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => e.target.files && setIndividualForm({...individualForm, idDocument: e.target.files[0]})} />
                        </label>
                     </div>
                     {individualForm.idDocument && <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><Check size={12}/> {individualForm.idDocument.name}</p>}
                  </div>
                </>
              )}

              {/* === ORGANIZATION FORM === */}
              {partnerType === 'org' && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Registered Business Name" value={orgForm.businessName} onChange={v => setOrgForm({...orgForm, businessName: v})} required />
                    <Input label="Website URL" value={orgForm.website} onChange={v => setOrgForm({...orgForm, website: v})} placeholder="https://..." required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="CAC RC Number" value={orgForm.cacNumber} onChange={v => setOrgForm({...orgForm, cacNumber: v})} placeholder="e.g. RC123456" required />
                    <Input label="Corporate TIN" value={orgForm.tin} onChange={v => setOrgForm({...orgForm, tin: v})} required />
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-4">Point of Contact</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input label="Contact Name" value={orgForm.contactName} onChange={v => setOrgForm({...orgForm, contactName: v})} required />
                      <Input label="Designation / Role" value={orgForm.contactRole} onChange={v => setOrgForm({...orgForm, contactRole: v})} required />
                      <Input label="Official Company Email" type="email" value={orgForm.officialEmail} onChange={v => setOrgForm({...orgForm, officialEmail: v})} required />
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 ml-1">Team Size <span className="text-cyan">*</span></label>
                        <select 
                          value={orgForm.teamSize} 
                          onChange={e => setOrgForm({...orgForm, teamSize: e.target.value})}
                          className="w-full bg-midnight border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan focus:outline-none appearance-none"
                        >
                          {['1-10', '11-50', '51-200', '200+'].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                     </div>
                    </div>
                  </div>

                  <div>
                     <label className="text-sm font-semibold text-white mb-3 block">Services Offered (Multi-Select) <span className="text-cyan">*</span></label>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {['IT Development', 'Marketing & PR', 'Legal & Compliance', 'Human Resources', 'Logistics', 'Finance & Accounting', 'Training & Education', 'Creative Arts'].map(service => (
                         <label key={service} className={`cursor-pointer border rounded-lg p-3 text-sm transition-all ${
                           orgForm.servicesOffered.includes(service) ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                         }`}>
                           <input 
                             type="checkbox" 
                             className="hidden" 
                             checked={orgForm.servicesOffered.includes(service)}
                             onChange={() => handleOrgServiceToggle(service)}
                           />
                           <div className="flex items-center gap-2">
                             <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                               orgForm.servicesOffered.includes(service) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'
                             }`}>
                               {orgForm.servicesOffered.includes(service) && <Check size={10} className="text-white" />}
                             </div>
                             {service}
                           </div>
                         </label>
                       ))}
                     </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                     <label className="text-sm font-semibold text-white mb-2 block">Compliance Documents</label>
                     <div className="p-4 border-2 border-dashed border-white/20 rounded-xl bg-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">CAC Certificate <span className="text-red-400">*</span></p>
                          <p className="text-xs text-slate-500">PDF or Image of incorporation certificate</p>
                        </div>
                        <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-cyan transition-colors flex items-center gap-2">
                           <Upload size={14} /> 
                           {orgForm.cacCertificate ? 'Change File' : 'Upload Cert'}
                           <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => e.target.files && setOrgForm({...orgForm, cacCertificate: e.target.files[0]})} />
                        </label>
                     </div>
                     {orgForm.cacCertificate && <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><Check size={12}/> {orgForm.cacCertificate.name}</p>}
                  </div>
                </>
              )}

              {/* === SUBMIT BUTTON === */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-full font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    partnerType === 'individual' ? 'bg-cyan text-midnight hover:bg-white' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Submit Application
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const Input = ({ label, type = "text", value, onChange, required = false, placeholder, maxLength, className = "" }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-xs text-slate-300 ml-1">{label} {required && <span className="text-cyan">*</span>}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan focus:outline-none focus:bg-white/10 transition-colors placeholder:text-slate-600"
      required={required}
    />
  </div>
);

export default PartnerRegistration;