import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Upload, ShieldCheck, UserPlus, CreditCard, Loader2, Plus, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { CandidateRegistrationData, Acquaintance, Guarantor } from '../../types';
import { DbService } from '../../services/db';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CandidateOnboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const initialGuarantor: Guarantor = { 
    name: '', address: '', tel: '', email: '', dob: '', 
    occupation: '', workAddress: '', yearsKnown: '', relationship: '', idCardImage: null 
  };

  const [formData, setFormData] = useState<CandidateRegistrationData>({
    surname: '', firstName: '', otherName: '', address: '', dob: '', sex: '', nationality: 'Nigerian',
    stateOfOrigin: '', lga: '', religion: '', tel: '', email: '', whatsapp: '', maritalStatus: 'Single',
    handicap: '', handicapDescription: '',
    validIdNumber: '', idType: 'National ID',
    nextOfKin: { name: '', address: '', tel: '', email: '', relationship: '' },
    desiredPositions: ['', '', ''],
    jobLocations: ['', '', ''],
    jobMode: '',
    yearsExperience: '',
    guarantors: [
      { ...initialGuarantor },
      { ...initialGuarantor }
    ],
    guarantorConsent: false,
    acquaintances: [],
    agreedToTerms: false,
    paymentReference: ''
  });

  // Pre-fill user data from Auth Context
  useEffect(() => {
    if (user) {
      const names = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        surname: names.slice(1).join(' ') || '',
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const nextStep = () => {
    setStep(prev => prev + 1);
    scrollToTop();
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    scrollToTop();
  };

  const handleInputChange = (field: keyof CandidateRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'nextOfKin', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleGuarantorChange = (index: number, field: keyof Guarantor, value: string) => {
    const newGuarantors = [...formData.guarantors] as [Guarantor, Guarantor];
    newGuarantors[index] = { ...newGuarantors[index], [field]: value };
    setFormData(prev => ({ ...prev, guarantors: newGuarantors }));
  };

  const handleGuarantorFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newGuarantors = [...formData.guarantors] as [Guarantor, Guarantor];
      newGuarantors[index] = { ...newGuarantors[index], idCardImage: file };
      setFormData(prev => ({ ...prev, guarantors: newGuarantors }));
    }
  };

  const handleArrayChange = (arrayName: 'desiredPositions' | 'jobLocations', index: number, value: string) => {
    const newArray = [...formData[arrayName]] as [string, string, string];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addAcquaintance = () => {
    if (formData.acquaintances.length < 10) {
      setFormData(prev => ({
        ...prev,
        acquaintances: [...prev.acquaintances, { surname: '', firstName: '', otherName: '' }]
      }));
    }
  };

  const removeAcquaintance = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acquaintances: prev.acquaintances.filter((_, i) => i !== index)
    }));
  };

  const updateAcquaintance = (index: number, field: keyof Acquaintance, value: string) => {
    const updated = [...formData.acquaintances];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, acquaintances: updated }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, passportImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Add User UID if needed in DbService, for now we just submit
    const success = await DbService.submitCandidateRegistration(formData);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard', { state: { registrationSuccess: true } });
    } else {
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 relative z-10" ref={topRef}>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
        <p className="text-slate-400">Finalize your registration to access job opportunities.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0" />
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step >= num ? 'bg-cyan text-midnight shadow-[0_0_15px_rgba(0,212,255,0.5)]' : 'bg-midnight border border-white/20 text-slate-500'
          }`}>
            {step > num ? <Check size={16} /> : num}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <motion.div 
        className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Step 1: Terms & Conditions */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Terms & Conditions</h2>
            <div className="bg-black/20 rounded-xl p-6 space-y-4 max-h-[400px] overflow-y-auto text-sm text-slate-300">
              <p className="font-semibold text-white">By registering, you agree to the following terms set by Real Value & Stakes Limited (operating as Jackson Multifacet):</p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong className="text-cyan">Registration Fee:</strong> A non-refundable fee of ₦5,000 applies to all candidates.</li>
                <li><strong className="text-cyan">Agency Commission:</strong> We are entitled to 50% of your first full month's salary for every job placement. This applies only to the first month.</li>
                <li><strong className="text-cyan">New Placements:</strong> Each new job placement attracts a fresh 50% charge of the first month's salary.</li>
                <li><strong className="text-cyan">Early Exit:</strong> If you leave a job before one month, 50% of total earnings for days worked is owed to the agency.</li>
                <li><strong className="text-cyan">Salary Payment:</strong> First-month salaries must be paid directly to the agency account.</li>
                <li><strong className="text-cyan">Accuracy:</strong> False information or forgery will attract legal action.</li>
                <li><strong className="text-cyan">Liability:</strong> The agency is not liable for candidate misconduct (theft, fraud, etc.).</li>
                <li><strong className="text-cyan">Abscondment:</strong> Leaving without notice results in blacklisting and potential legal action.</li>
              </ul>
            </div>
            
            <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.agreedToTerms}
                onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                className="w-5 h-5 accent-cyan rounded"
              />
              <span className="text-sm text-white">I have read, understood, and agreed to all the terms above.</span>
            </label>

            <div className="flex justify-end pt-4">
              <button 
                onClick={nextStep}
                disabled={!formData.agreedToTerms}
                className="px-8 py-3 bg-cyan text-midnight font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan/90 transition-all flex items-center gap-2"
              >
                Accept & Continue <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Personal Bio Data */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white">Personal Details</h2>
              <div className="text-xs text-slate-400">Step 2 of 5</div>
            </div>

            {/* Passport Upload */}
            <div className="flex flex-col items-center p-6 border-2 border-dashed border-white/20 rounded-2xl bg-white/5">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {formData.passportImage ? (
                  <img src={URL.createObjectURL(formData.passportImage as File)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserPlus size={32} className="text-slate-500" />
                )}
              </div>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-cyan transition-colors flex items-center gap-2">
                  <Upload size={14} /> Upload Passport
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <p className="text-[10px] text-slate-500 mt-2">Required for registration card</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Surname" value={formData.surname} onChange={(v:any) => handleInputChange('surname', v)} required />
              <Input label="First Name" value={formData.firstName} onChange={(v:any) => handleInputChange('firstName', v)} required />
              <Input label="Other Name" value={formData.otherName} onChange={(v:any) => handleInputChange('otherName', v)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Date of Birth" type="date" value={formData.dob} onChange={(v:any) => handleInputChange('dob', v)} required />
                <Select label="Sex" value={formData.sex} onChange={(v:any) => handleInputChange('sex', v)} options={['M', 'F']} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nationality" value={formData.nationality} onChange={(v:any) => handleInputChange('nationality', v)} />
                <Input label="State of Origin" value={formData.stateOfOrigin} onChange={(v:any) => handleInputChange('stateOfOrigin', v)} required />
                <Input label="L.G.A" value={formData.lga} onChange={(v:any) => handleInputChange('lga', v)} required />
                <Input label="Religion" value={formData.religion} onChange={(v:any) => handleInputChange('religion', v)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Phone Number" type="tel" value={formData.tel} onChange={(v:any) => handleInputChange('tel', v)} required />
                <Input label="WhatsApp" type="tel" value={formData.whatsapp} onChange={(v:any) => handleInputChange('whatsapp', v)} />
                <Input label="Email Address" type="email" value={formData.email} onChange={(v:any) => handleInputChange('email', v)} required />
                <Select label="Marital Status" value={formData.maritalStatus} onChange={(v:any) => handleInputChange('maritalStatus', v)} options={['Single', 'Married', 'Divorced', 'Widowed']} />
            </div>

            <Input label="Residential Address" value={formData.address} onChange={(v:any) => handleInputChange('address', v)} required />

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <label className="text-sm text-slate-300 block mb-2">Do you have any physical handicap?</label>
              <div className="flex gap-6 mb-3">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={formData.handicap === opt} onChange={() => handleInputChange('handicap', opt)} className="accent-cyan"/>
                      <span className="text-sm text-white">{opt}</span>
                    </label>
                  ))}
              </div>
              {formData.handicap === 'Yes' && (
                <Input label="If yes, please describe:" value={formData.handicapDescription || ''} onChange={(v:any) => handleInputChange('handicapDescription', v)} />
              )}
            </div>

            {/* Next of Kin */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Next of Kin Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={formData.nextOfKin.name} onChange={(v:any) => handleNestedChange('nextOfKin', 'name', v)} required />
                <Input label="Relationship" value={formData.nextOfKin.relationship} onChange={(v:any) => handleNestedChange('nextOfKin', 'relationship', v)} required />
                <Input label="Phone" value={formData.nextOfKin.tel} onChange={(v:any) => handleNestedChange('nextOfKin', 'tel', v)} required />
                <Input label="Email" value={formData.nextOfKin.email} onChange={(v:any) => handleNestedChange('nextOfKin', 'email', v)} />
                <div className="md:col-span-2">
                  <Input label="Address" value={formData.nextOfKin.address} onChange={(v:any) => handleNestedChange('nextOfKin', 'address', v)} required />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={prevStep} className="text-slate-400 hover:text-white flex items-center gap-1"><ChevronLeft size={18} /> Back</button>
              <button onClick={nextStep} className="px-8 py-3 bg-cyan text-midnight font-bold rounded-full hover:bg-cyan/90 transition-all flex items-center gap-2">Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Employment Details */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white">Employment & ID</h2>
              <div className="text-xs text-slate-400">Step 3 of 5</div>
            </div>

            <div className="space-y-4">
              <label className="text-sm text-cyan font-semibold uppercase tracking-wider">Desired Positions</label>
              {[0, 1, 2].map(i => (
                <Input key={i} label={`Position Preference ${i + 1}`} value={formData.desiredPositions[i]} onChange={(v:any) => handleArrayChange('desiredPositions', i, v)} placeholder={i === 0 ? "e.g. Sales Manager" : ""} />
              ))}
            </div>

            <div className="space-y-4 mt-6">
              <label className="text-sm text-cyan font-semibold uppercase tracking-wider">Preferred Locations</label>
              {[0, 1, 2].map(i => (
                <Input key={i} label={`Location Preference ${i + 1}`} value={formData.jobLocations[i]} onChange={(v:any) => handleArrayChange('jobLocations', i, v)} placeholder={i === 0 ? "e.g. Lagos Island" : ""} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Select label="Preferred Job Mode" value={formData.jobMode} onChange={(v:any) => handleInputChange('jobMode', v)} options={['On-Site', 'Remote', 'Hybrid']} required />
              <Input label="Years of Experience" type="number" value={formData.yearsExperience} onChange={(v:any) => handleInputChange('yearsExperience', v)} />
            </div>

            <div className="p-6 bg-indigo-900/10 border border-indigo-500/30 rounded-xl mt-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-indigo-400"/> Identity Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="ID Type" value={formData.idType} onChange={(v:any) => handleInputChange('idType', v)} options={['National ID (NIN)', "Voter's Card", "Driver's License", "International Passport"]} required />
                  <Input label="ID Number" value={formData.validIdNumber} onChange={(v:any) => handleInputChange('validIdNumber', v)} required />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={prevStep} className="text-slate-400 hover:text-white flex items-center gap-1"><ChevronLeft size={18} /> Back</button>
              <button onClick={nextStep} className="px-8 py-3 bg-cyan text-midnight font-bold rounded-full hover:bg-cyan/90 transition-all flex items-center gap-2">Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

          {/* Step 4: Guarantor & References */}
          {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white">Guarantors & Refs</h2>
              <div className="text-xs text-slate-400">Step 4 of 5</div>
            </div>

            <p className="text-sm text-slate-400 -mt-4">
              Two (2) reliable guarantors are required. They must have known you for at least 3 years and provide a valid ID card.
            </p>

            {/* Guarantors Loop */}
            {[0, 1].map((index) => (
              <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-cyan text-midnight font-bold flex items-center justify-center shadow-lg border-4 border-midnight">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-4 pl-4">Guarantor {index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input label="Full Name" value={formData.guarantors[index].name} onChange={(v:any) => handleGuarantorChange(index, 'name', v)} required />
                  <Input label="Relationship" value={formData.guarantors[index].relationship} onChange={(v:any) => handleGuarantorChange(index, 'relationship', v)} required />
                  <Input label="Phone" value={formData.guarantors[index].tel} onChange={(v:any) => handleGuarantorChange(index, 'tel', v)} required />
                  <Input label="Email" value={formData.guarantors[index].email} onChange={(v:any) => handleGuarantorChange(index, 'email', v)} />
                  <Input label="Occupation" value={formData.guarantors[index].occupation} onChange={(v:any) => handleGuarantorChange(index, 'occupation', v)} required />
                  <Input label="Years Known" value={formData.guarantors[index].yearsKnown} onChange={(v:any) => handleGuarantorChange(index, 'yearsKnown', v)} required />
                  <div className="md:col-span-2">
                      <Input label="Residential Address" value={formData.guarantors[index].address} onChange={(v:any) => handleGuarantorChange(index, 'address', v)} required />
                  </div>
                    <div className="md:col-span-2">
                      <Input label="Work Address" value={formData.guarantors[index].workAddress} onChange={(v:any) => handleGuarantorChange(index, 'workAddress', v)} required />
                  </div>
                </div>

                {/* Guarantor ID Upload */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <label className="text-xs text-slate-300 mb-2 block">Upload Guarantor's Valid ID Card <span className="text-cyan">*</span></label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-cyan transition-colors border border-dashed border-white/20">
                      <Upload size={14} /> Choose File
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGuarantorFile(index, e)} />
                    </label>
                    <span className="text-xs text-slate-400 italic truncate max-w-[200px]">
                      {formData.guarantors[index].idCardImage ? (formData.guarantors[index].idCardImage as File).name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Guarantor Consent Agreement */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-xl">
                <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-indigo-400"/> Guarantor Declaration & Consent
                </h3>
                <div className="text-xs text-slate-300 bg-black/20 p-4 rounded-lg mb-4 h-32 overflow-y-auto leading-relaxed border border-white/5">
                  <p className="mb-2"><strong>To be acknowledged by the Candidate on behalf of the Guarantors:</strong></p>
                  <p>
                    I, the undersigned Guarantor, hereby confirm that I know the candidate and vouch for their character and integrity. 
                    I understand that Jackson Multifacet (Real Value & Stakes Ltd) will hold me liable for any financial loss, 
                    theft, or damage caused by the candidate during their employment if they abscond or refuse to pay. 
                  </p>
                  <p className="mt-2">
                    I consent to the verification of my identity and the details provided herein. I agree to produce the candidate 
                    whenever required by the company or law enforcement agencies in the event of any misconduct.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.guarantorConsent}
                    onChange={(e) => handleInputChange('guarantorConsent', e.target.checked)}
                    className="mt-1 w-5 h-5 accent-cyan rounded"
                  />
                  <span className="text-sm text-white">
                    I verify that my guarantors have read, understood, and agreed to the declaration above, and they have authorized me to submit their details and ID cards.
                  </span>
                </label>
            </div>

            {/* Acquaintances Section */}
            <div className="mt-8 border-t border-white/10 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Acquaintances / Referees</h3>
                  <button onClick={addAcquaintance} className="text-xs bg-cyan/20 text-cyan px-3 py-1 rounded-full flex items-center gap-1 hover:bg-cyan/30">
                    <Plus size={12} /> Add New
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-4">List people who can vouch for you (Optional, Max 10).</p>

                {formData.acquaintances.map((acq, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-end">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input placeholder="Surname" value={acq.surname} onChange={e => updateAcquaintance(index, 'surname', e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white" />
                      <input placeholder="First Name" value={acq.firstName} onChange={e => updateAcquaintance(index, 'firstName', e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white" />
                      <input placeholder="Other" value={acq.otherName} onChange={e => updateAcquaintance(index, 'otherName', e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white" />
                    </div>
                    <button onClick={() => removeAcquaintance(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={16} /></button>
                  </div>
                ))}
                {formData.acquaintances.length === 0 && (
                  <div className="text-center p-4 border border-dashed border-white/10 rounded-lg text-slate-500 text-sm">
                    No acquaintances added yet.
                  </div>
                )}
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={prevStep} className="text-slate-400 hover:text-white flex items-center gap-1"><ChevronLeft size={18} /> Back</button>
              <button 
                onClick={nextStep} 
                disabled={!formData.guarantorConsent}
                className="px-8 py-3 bg-cyan text-midnight font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan/90 transition-all flex items-center gap-2"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Final Step: Registration Fee</h2>
              <p className="text-slate-400">To complete your application, please pay the non-refundable fee of ₦5,000.</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-midnight border border-white/10 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard size={100} /></div>
              <div className="relative z-10 space-y-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Bank Name</span>
                  <div className="text-xl font-bold text-white">Ecobank</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Account Name</span>
                  <div className="text-xl font-bold text-cyan">Real Value and Stakes</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Account Number</span>
                  <div className="text-3xl font-mono font-bold text-white tracking-wider">3502032952</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
                <p className="text-sm text-white font-medium">Have you made the transfer?</p>
                <Input 
                  label="Sender Name / Transaction Reference" 
                  value={formData.paymentReference || ''} 
                  onChange={(v:any) => handleInputChange('paymentReference', v)} 
                  placeholder="Enter the name on the sending account"
                  required
                />
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 text-sm text-yellow-200">
                  <AlertTriangle size={20} className="shrink-0" />
                  <p>Registration is valid only after payment verification by official staff. Do not pay to any personal accounts.</p>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10 mt-6">
              <button onClick={prevStep} className="text-slate-400 hover:text-white flex items-center gap-1"><ChevronLeft size={18} /> Back</button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.paymentReference}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Submit Application
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

// Helper Components
const Input = ({ label, type = "text", value, onChange, required = false, placeholder, className = "" }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-xs text-slate-300 ml-1">{label} {required && <span className="text-cyan">*</span>}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan focus:outline-none focus:bg-white/10 transition-colors"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs text-slate-300 ml-1">{label} {required && <span className="text-cyan">*</span>}</label>
    <div className="relative">
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan focus:outline-none appearance-none"
      >
        <option value="" disabled>Select...</option>
        {options.map((opt: string) => <option key={opt} value={opt} className="bg-midnight">{opt}</option>)}
      </select>
      <div className="absolute right-3 top-3 pointer-events-none text-slate-500"><ChevronRight size={14} className="rotate-90" /></div>
    </div>
  </div>
);

export default CandidateOnboarding;