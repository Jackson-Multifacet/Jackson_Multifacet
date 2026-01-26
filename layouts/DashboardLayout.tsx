import React, { useEffect, useState } from 'react';
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
  ShieldCheck,
  Building,
  UserPlus,
  Loader2,
  Newspaper,
  List,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DbService } from '../services/db';
import { AppNotification } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      // Mock fetching notifications
      DbService.getNotifications(user.uid).then(setNotifications);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAsRead = async (id: string) => {
    await DbService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    if (user) {
      await DbService.markAllNotificationsRead(user.uid);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="text-cyan animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Define menu items based on role
  const getMenuItems = () => {
    const common = [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
      { icon: Newspaper, label: 'News & Updates', path: '/dashboard/news' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' }, 
    ];

    if (user.role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard' },
        { icon: List, label: 'Manage Jobs', path: '/dashboard/admin-jobs' },
        { icon: Newspaper, label: 'Manage News', path: '/dashboard/news' },
        { icon: ShieldCheck, label: 'Verify Payments', path: '/dashboard/candidates-verify' },
        { icon: Building, label: 'Approve Partners', path: '/dashboard/partners-review' },
        { icon: Users, label: 'Candidate Pool', path: '/dashboard/candidates' }, 
        { icon: Briefcase, label: 'Projects', path: '/dashboard/projects' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' }, 
      ];
    }

    if (user.role === 'candidate') {
      return [
        { icon: LayoutDashboard, label: 'My Status', path: '/dashboard' },
        { icon: Brain, label: 'Career Copilot', path: '/dashboard/career-copilot' },
        { icon: UserPlus, label: 'Complete Registration', path: '/dashboard/onboarding' },
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
      { icon: Newspaper, label: 'Post Updates', path: '/dashboard/news' },
      { icon: Briefcase, label: 'Assigned Tasks', path: '/dashboard/tasks' },
      { icon: PieChart, label: 'Earnings', path: '/dashboard/earnings' },
      ...common.slice(2)
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
            {/* NOTIFICATION CENTER */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors outline-none"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0d1117] border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-cyan hover:underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 text-sm">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex gap-3 ${!n.read ? 'bg-white/[0.03]' : ''}`}
                            >
                              <div className={`mt-1 shrink-0 ${
                                n.type === 'success' ? 'text-green-400' :
                                n.type === 'warning' ? 'text-amber-400' :
                                n.type === 'error' ? 'text-red-400' :
                                'text-cyan'
                              }`}>
                                {n.type === 'success' ? <Check size={16} /> :
                                 n.type === 'warning' ? <AlertTriangle size={16} /> :
                                 n.type === 'error' ? <XCircle size={16} /> :
                                 <Info size={16} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</p>
                                  {!n.read && <div className="w-1.5 h-1.5 bg-cyan rounded-full mt-1.5" />}
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-slate-600 mt-2">{n.timestamp}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 overflow-y-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;