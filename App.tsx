import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Background from './components/Background';
import AIChatBot from './components/AIChatBot';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Recruitment from './pages/Recruitment';
import BusinessDev from './pages/BusinessDev';
import ITSupport from './pages/ITSupport';
import PricingPage from './pages/PricingPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import CandidateRegistration from './pages/CandidateRegistration';
import PartnerRegistration from './pages/PartnerRegistration';

// Dashboard
import Login from './pages/dashboard/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardTasks from './pages/dashboard/DashboardTasks';
import DashboardEarnings from './pages/dashboard/DashboardEarnings';
import DashboardProjects from './pages/dashboard/DashboardProjects';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <Background />
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className="min-h-screen relative z-10">
        {children}
      </main>
      <Footer />
      <AIChatBot />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
          <Route path="/recruitment" element={<MainLayout><Recruitment /></MainLayout>} />
          <Route path="/business-dev" element={<MainLayout><BusinessDev /></MainLayout>} />
          <Route path="/it-support" element={<MainLayout><ITSupport /></MainLayout>} />
          <Route path="/pricing" element={<MainLayout><PricingPage /></MainLayout>} />
          <Route path="/news" element={<MainLayout><NewsPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          
          {/* Registration Portals */}
          <Route path="/candidate-registration" element={<MainLayout><CandidateRegistration /></MainLayout>} />
          <Route path="/partner-registration" element={<MainLayout><PartnerRegistration /></MainLayout>} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/tasks" element={<DashboardLayout><DashboardTasks /></DashboardLayout>} />
          <Route path="/dashboard/earnings" element={<DashboardLayout><DashboardEarnings /></DashboardLayout>} />
          <Route path="/dashboard/projects" element={<DashboardLayout><DashboardProjects /></DashboardLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;