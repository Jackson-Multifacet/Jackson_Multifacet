import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, AlertCircle, DollarSign, 
  Briefcase, TrendingUp, Users, FileText, Building2,
  Calendar, Layers, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  // --- PARTNER VIEW (Staff/Freelancers) ---
  if (user?.role === 'partner') {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Partner Portal</h2>
            <p className="text-slate-400">Welcome back, {user.name}. Here is your mission control.</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-slate-500 uppercase tracking-widest">Current Rating</p>
             <div className="flex items-center gap-1 text-cyan">
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} className="opacity-50" />
               <span className="text-white font-bold ml-1">4.8</span>
             </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Layers} label="Active Tasks" value="4" color="indigo" />
          <StatCard icon={CheckCircle} label="Completed (Mo)" value="12" color="green" />
          <StatCard icon={DollarSign} label="Pending Payout" value="₦150k" color="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Urgent Tasks */}
           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">Urgent Assignments</h3>
               <Link to="/dashboard/tasks" className="text-xs text-cyan hover:underline">View Board</Link>
             </div>
             <div className="space-y-4">
               {[
                 { title: 'Design Homepage Mockup', project: 'Dangote Rebrand', due: 'Today', priority: 'High' },
                 { title: 'Candidate Screening: Senior Dev', project: 'Recruitment Batch A', due: 'Tomorrow', priority: 'Medium' }
               ].map((task, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/30 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                       <div>
                         <h4 className="font-bold text-white group-hover:text-cyan transition-colors">{task.title}</h4>
                         <p className="text-xs text-slate-400">{task.project}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-medium text-slate-300 flex items-center gap-1 justify-end">
                         <Calendar size={12} /> {task.due}
                       </span>
                    </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Quick Actions / Announcements */}
           <div className="bg-gradient-to-br from-indigo-900/40 to-midnight border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Announcements</h3>
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                 <p className="text-sm text-slate-200 mb-2">New Payment Policy</p>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   All invoices submitted before the 25th will be processed within 3 business days.
                 </p>
              </div>
              <button className="w-full py-3 bg-cyan/10 border border-cyan/50 text-cyan rounded-xl text-sm font-bold hover:bg-cyan hover:text-midnight transition-all">
                Submit Invoice
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- CANDIDATE VIEW ---
  if (user?.role === 'candidate') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back, {user.name}</h2>
          <p className="text-slate-400">Your career journey is on track.</p>
        </div>

        {/* Application Tracker */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Application Status</h3>
          <div className="relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2" />
             <div className="absolute top-1/2 left-0 w-[50%] h-1 bg-cyan -translate-y-1/2 shadow-[0_0_10px_#00d4ff]" />
             
             <div className="relative z-10 flex justify-between">
                {[
                  { label: 'Registered', status: 'done' },
                  { label: 'Payment', status: 'done' },
                  { label: 'Guarantor Check', status: 'current' },
                  { label: 'Interview', status: 'pending' },
                  { label: 'Placed', status: 'pending' }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.status === 'done' ? 'bg-cyan border-cyan text-midnight' : 
                      step.status === 'current' ? 'bg-midnight border-cyan text-cyan animate-pulse' : 
                      'bg-midnight border-white/20 text-slate-500'
                    }`}>
                      {step.status === 'done' ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.label}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="mt-8 bg-cyan/10 border border-cyan/20 rounded-lg p-4 flex items-start gap-3">
             <Clock className="text-cyan shrink-0 mt-0.5" size={18} />
             <div>
               <p className="text-sm font-bold text-white">Action Required: Guarantor ID</p>
               <p className="text-xs text-slate-400">One of your guarantors has not uploaded their ID. Please remind them.</p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Briefcase} label="Matched Jobs" value="12" color="indigo" />
          <StatCard icon={TrendingUp} label="Profile Strength" value="85%" color="green" />
          <StatCard icon={FileText} label="Applications" value="3" color="amber" />
        </div>
      </div>
    );
  }

  // --- CLIENT VIEW ---
  if (user?.role === 'client') {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name} Dashboard</h2>
            <p className="text-slate-400">Overview of your active engagements.</p>
          </div>
          <button className="px-4 py-2 bg-cyan text-midnight font-bold rounded-lg text-sm">
            + New Request
          </button>
        </div>

        {/* Project Roadmap */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-white">Active Project: Corporate Website Rebrand</h3>
             <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase">In Progress</span>
           </div>
           
           <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Completion</span>
                <span>65%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase">Current Phase</p>
                    <p className="text-white font-bold">Frontend Development</p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase">Next Milestone</p>
                    <p className="text-white font-bold">CMS Integration</p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase">Est. Delivery</p>
                    <p className="text-white font-bold">Nov 12, 2025</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Shortlisted Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
             <h3 className="text-lg font-bold text-white mb-4">Talent Shortlist (3)</h3>
             <div className="space-y-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-700" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">Candidate #{20240 + i}</p>
                      <p className="text-xs text-slate-400">Senior React Developer • 5 Yrs Exp</p>
                    </div>
                    <button className="text-xs px-3 py-1.5 bg-cyan/20 text-cyan rounded hover:bg-cyan hover:text-midnight transition-colors">View</button>
                 </div>
               ))}
             </div>
           </div>
           
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Invoices</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 border-b border-white/5">
                    <div>
                      <p className="text-sm text-white">Inv-0023 (Deposit)</p>
                      <p className="text-xs text-slate-500">Oct 20, 2025</p>
                    </div>
                    <span className="text-sm font-mono text-white">₦250,000</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Paid</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Command Center</h2>
        <p className="text-slate-400">System overview and critical alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Candidates" value="2,543" color="cyan" />
        <StatCard icon={Building2} label="Active Clients" value="128" color="indigo" />
        <StatCard icon={Briefcase} label="Open Jobs" value="45" color="purple" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value="₦4.2M" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
             <button className="text-xs text-cyan hover:underline">View All</button>
           </div>
           <div className="space-y-4">
             {[
               { name: 'Sarah Connor', role: 'Individual Partner', time: '2 mins ago', status: 'Pending' },
               { name: 'TechCorp Ltd', role: 'Agency Partner', time: '1 hour ago', status: 'Review' },
               { name: 'James Smith', role: 'Candidate', time: '3 hours ago', status: 'Approved' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white">
                     {item.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">{item.name}</p>
                     <p className="text-xs text-slate-400">{item.role}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className={`text-xs px-2 py-0.5 rounded ${
                     item.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                     item.status === 'Review' ? 'bg-amber-500/20 text-amber-400' :
                     'bg-slate-500/20 text-slate-400'
                   }`}>{item.status}</span>
                   <p className="text-[10px] text-slate-500 mt-1">{item.time}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* System Health */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">System Health</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Server Load</span>
                <span className="text-green-400">Normal (12%)</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[12%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Database Capacity</span>
                <span className="text-cyan">45% Used</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan w-[45%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const colorClasses = {
    cyan: "bg-cyan/20 text-cyan",
    indigo: "bg-indigo-500/20 text-indigo-400",
    purple: "bg-purple-500/20 text-purple-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400"
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default DashboardHome;