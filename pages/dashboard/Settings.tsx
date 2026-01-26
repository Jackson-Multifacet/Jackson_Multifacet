import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DbService } from '../../services/db';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Check, Loader2, Camera } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    
    // In a real app, we would upload the avatar here too
    const success = await DbService.updateUserProfile(user.uid, { name });
    
    setIsSaving(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Account Settings</h2>
        <p className="text-slate-400 text-sm">Manage your profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="relative inline-block mb-4 group cursor-pointer">
              <img 
                src={user?.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-midnight shadow-xl"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{user?.email}</p>
            
            <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role} Account
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-cyan" /> Profile Information
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-500 cursor-not-allowed">
                  <Mail size={16} />
                  {user?.email}
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Contact support to change email.</p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2 bg-cyan text-midnight font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
                {success && (
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <Check size={16} /> Saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Preferences Placeholder */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-75">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Bell size={20} className="text-indigo-400" /> Notifications
             </h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-sm text-slate-300">Email Alerts</span>
                   <div className="w-10 h-5 bg-cyan rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1" /></div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm text-slate-300">Marketing Updates</span>
                   <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1" /></div>
                </div>
             </div>
          </div>

          {/* Security Placeholder */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-75">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Shield size={20} className="text-red-400" /> Security
             </h3>
             <button className="text-sm text-red-400 hover:text-red-300 font-medium border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-lg transition-colors">
               Change Password
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;