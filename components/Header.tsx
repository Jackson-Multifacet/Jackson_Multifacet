import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Recruitment', href: '/recruitment' },
    { name: 'Business Dev', href: '/business-dev' },
    { name: 'IT Support', href: '/it-support' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'backdrop-blur-xl bg-midnight/60 border-b border-white/10 shadow-lg shadow-cyan-500/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <Link to="/" className="group">
          {/* Updated size to h-12 for better visibility of details */}
          <Logo className="h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors relative group ${
                location.pathname === link.href ? 'text-cyan' : 'text-slate-300 hover:text-cyan'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-cyan transition-all duration-300 ${
                 location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
             <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <LayoutDashboard size={16} />
                Portal
              </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[calc(100%-10px)] right-6 w-56 p-2 rounded-2xl md:hidden backdrop-blur-3xl bg-white/10 border border-white/20 shadow-2xl origin-top-right overflow-hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/10 block transition-colors ${
                    location.pathname === link.href ? 'text-cyan bg-white/5' : 'text-slate-200'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-1" />
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold px-4 py-3 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all block flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Portal Login
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;