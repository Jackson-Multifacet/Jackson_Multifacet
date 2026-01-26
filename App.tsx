import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Recruitment from './pages/Recruitment';
import BusinessDev from './pages/BusinessDev';
import ITSupport from './pages/ITSupport';
import PricingPage from './pages/PricingPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import PartnerRegistration from './pages/PartnerRegistration';

// Dashboard Pages
import Login from './pages/dashboard/Login';
import DashboardHome from './pages/dashboard/DashboardHome';
import AdminCandidates from './pages/dashboard/AdminCandidates';
import AdminCandidatePool from './pages/dashboard/AdminCandidatePool';
import AdminPartners from './pages/dashboard/AdminPartners';
import DashboardTasks from './pages/dashboard/DashboardTasks';
import DashboardEarnings from './pages/dashboard/DashboardEarnings';
import DashboardProjects from './pages/dashboard/DashboardProjects';
import CandidateOnboarding from './pages/dashboard/CandidateOnboarding';
import DashboardNews from './pages/dashboard/DashboardNews';
import CandidateJobs from './pages/dashboard/CandidateJobs';
import CandidateApplications from './pages/dashboard/CandidateApplications';
import ClientShortlist from './pages/dashboard/ClientShortlist';
import ClientInvoices from './pages/dashboard/ClientInvoices';
import AdminJobs from './pages/dashboard/AdminJobs';
import Settings from './pages/dashboard/Settings';
import CareerCopilot from './pages/dashboard/CareerCopilot';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
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
          <Route path="/partner-registration" element={<MainLayout><PartnerRegistration /></MainLayout>} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/onboarding" element={<DashboardLayout><CandidateOnboarding /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          
          {/* Candidate Routes */}
          <Route path="/dashboard/career-copilot" element={<DashboardLayout><CareerCopilot /></DashboardLayout>} />
          <Route path="/dashboard/jobs" element={<DashboardLayout><CandidateJobs /></DashboardLayout>} />
          <Route path="/dashboard/applications" element={<DashboardLayout><CandidateApplications /></DashboardLayout>} />
          
          {/* Client Routes */}
          <Route path="/dashboard/shortlist" element={<DashboardLayout><ClientShortlist /></DashboardLayout>} />
          <Route path="/dashboard/invoices" element={<DashboardLayout><ClientInvoices /></DashboardLayout>} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/candidates-verify" element={<DashboardLayout><AdminCandidates /></DashboardLayout>} />
          <Route path="/dashboard/candidates" element={<DashboardLayout><AdminCandidatePool /></DashboardLayout>} />
          <Route path="/dashboard/partners-review" element={<DashboardLayout><AdminPartners /></DashboardLayout>} />
          <Route path="/dashboard/admin-jobs" element={<DashboardLayout><AdminJobs /></DashboardLayout>} />
          
          {/* Partner Routes */}
          <Route path="/dashboard/tasks" element={<DashboardLayout><DashboardTasks /></DashboardLayout>} />
          <Route path="/dashboard/earnings" element={<DashboardLayout><DashboardEarnings /></DashboardLayout>} />
          
          {/* Common Routes */}
          <Route path="/dashboard/projects" element={<DashboardLayout><DashboardProjects /></DashboardLayout>} />
          <Route path="/dashboard/news" element={<DashboardLayout><DashboardNews /></DashboardLayout>} />
          
          <Route path="/dashboard/*" element={<DashboardLayout><div className="text-white p-6">Module Under Construction</div></DashboardLayout>} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;