import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { JobOpeningsPage } from '../pages/jobs/JobOpeningsPage';
import { JobApplicationsPage } from '../pages/applications/JobApplicationsPage';
import { ApplicationDetailPage } from '../pages/applications/ApplicationDetailPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { ResumesPage } from '../pages/resumes/ResumesPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { Skeleton } from '../components/common/Skeleton';

// Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)',
          gap: '16px',
        }}
      >
        <Skeleton width="180px" height="24px" />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Verifying Admin Credentials...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="jobs" element={<JobOpeningsPage />} />
        <Route path="applications" element={<JobApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        <Route path="resumes" element={<ResumesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
