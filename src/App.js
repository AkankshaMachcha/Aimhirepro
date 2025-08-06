
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScrollToTop from './components/common/ScrollToTop';
// Auth 
import Landing from './pages/Landing';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import NotFound from './pages/NotFound';

// Layout
import Footer from './components/layout/Footer/Footer';
import Header from './components/layout/Header/Header';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';


// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import ResumeCreatePage from './pages/dashboard/ResumeCreatePage';
import ProfilePage from './pages/dashboard/ProfilePage';
import UpgradePage from './pages/dashboard/UpgradePage';
import ChangePassword from './pages/dashboard/ChangePassword';
import ViewLatestResume from './pages/dashboard/ViewLatestResume';
import TemplatesPage from './pages/dashboard/TemplatesPage';
import AllResumesPage from './pages/dashboard/AllResumesPage';
import ViewResumeByVersionPage from './pages/dashboard/ViewResumeByVersionPage';
import MatchJDPage from './pages/dashboard/MatchJDPage';
import ResumeMatchPage from './pages/dashboard/ResumeMatchPage';
import MatchJDAnalysisPage from './pages/dashboard/MatchJDAnalysisPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminUserProfilePage from './pages/admin/AdminUserProfilePage';
import ViewPlansPage from './pages/ViewPlansPage';
import AdminContactMessagePage from './pages/admin/AdminContactMessagesPage';

import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TemplatesPublicPage from './pages/public/TemplatesPublicPage';

function App() {
  const user = useSelector((state) => state.auth.user);
  const authorities = (user?.authority || '').split(' ');

  const isAdmin = authorities.includes('ADMIN');

  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/pricing" element={<ViewPlansPage />} />

            {/* Protected Dashboard Route */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              {/* Redirect based on role */}
              <Route index element={<Navigate to={isAdmin ? "/dashboard/admin" : "/dashboard/create"} />} />

              {/* User-specific pages */}
              <Route path="create" element={<ResumeCreatePage />} />
              <Route path="view-latest" element={<ViewLatestResume />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="view-all" element={<AllResumesPage />} />
              <Route path="resume/view-all/:versionLabel" element={<ViewResumeByVersionPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="upgrade" element={<UpgradePage />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="match-jd" element={<MatchJDPage />} />
              <Route path="match-jd/:versionLabel" element={<ResumeMatchPage />} />
              <Route path="match-jd/analysis" element={<MatchJDAnalysisPage />} />

              {/* Admin-only route using AdminRoute wrapper */}
              <Route path="admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />


              <Route path="admin/users" element={
                <AdminRoute>
                  <AdminUserListPage />
                </AdminRoute>
              } />

              <Route path="admin/contacts" element={
                <AdminRoute>
                  <AdminContactMessagePage />
                </AdminRoute>
              } />

              <Route path="admin/user/email/:email" element={<AdminUserProfilePage />} />


            </Route>


              {/* // public paths */}

            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* <Route path="/careers" element={<CareersPage />} /> */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/templates" element={<TemplatesPublicPage />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
         <Footer />
      </div>
    </Router>
  );
}

export default App;
