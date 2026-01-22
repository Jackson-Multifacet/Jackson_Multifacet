import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  PieChart, 
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Define menu items based on role
  const getMenuItems = () => {
    const common = [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    if (user.role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard' },
        { icon: Users, label: 'Candidates', path: '/dashboard/candidates' },
        { icon: Briefcase, label: 'Active Projects', path: '/dashboard/projects' },
        { icon: Users, label: 'Partners', path: '/dashboard/partners' },
        { icon: PieChart, label: 'Financials', path: '/dashboard/financials' },
        ...common.slice(1)
      ];
    }

    if (user.role === 'candidate') {
      return [
        { icon: LayoutDashboard, label: 'My Status', path: '/dashboard' },
        { icon: Briefcase, label: 'Job Matches', path: '/dashboard/jobs' },
        { icon: FileText, label: 'My Applications', path: '/dashboard/applications' },
        ...common.slice(1)
      ];
    }

    if (user.role === 'client') {
      return [
        { icon: LayoutDashboard, label: 'Project Status', path: '/dashboard' },
        { icon: Users, label: 'Talent Shortlist', path: '/dashboard/shortlist' },
        { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
        ...common.slice(1)
      ];
    }

    // Partner
    return [
      { icon: LayoutDashboard, label: 'Work Board', path: '/dashboard' },
      { icon: Briefcase, label: 'Assigned Tasks', path: '/dashboard/tasks' },
      { icon: PieChart, label: 'Earnings', path: '/dashboard/earnings' },
      ...common.slice(1)
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-midnight text-white flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#050505] border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Jackson<span className="text-cyan">Dashboard</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              {user.role} Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-white/20" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 bg-midnight/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-slate-400">
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-64">
            <Search size={14} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;