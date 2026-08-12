import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useMockData } from '../../services/mockDataService';
import { useToast } from '../../components/common/Toast';
import {
  User,
  Shield,
  Building,
  FileCheck,
  Bell,
  Save,
  Key,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, service } = useMockData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'company' | 'application' | 'notifications'>('profile');

  // Form State initialized from mock settings
  const [profileForm, setProfileForm] = useState({
    adminName: settings.adminName,
    adminEmail: settings.adminEmail,
    adminPhone: settings.adminPhone,
    adminTitle: settings.adminTitle,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: settings.companyName,
    contactEmail: settings.contactEmail,
    portalTitle: settings.portalTitle,
    currency: settings.currency,
    defaultLocation: settings.defaultLocation,
  });

  const [applicationForm, setApplicationForm] = useState({
    maxFileSizeMB: settings.maxFileSizeMB,
    autoAcknowledgeEmail: settings.autoAcknowledgeEmail,
    requireCoverLetter: settings.requireCoverLetter,
  });

  const [notificationForm, setNotificationForm] = useState({
    emailOnNewApplication: settings.emailOnNewApplication,
    emailDailyDigest: settings.emailDailyDigest,
    emailOnShortlist: settings.emailOnShortlist,
  });

  // Action Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    service.updateSettings({
      adminName: profileForm.adminName,
      adminEmail: profileForm.adminEmail,
      adminPhone: profileForm.adminPhone,
      adminTitle: profileForm.adminTitle,
    });
    showToast('Profile Updated', 'Administrator profile details saved.', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.currentPassword) {
      showToast('Validation Error', 'Please enter your current password.', 'error');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      showToast('Validation Error', 'New password must be at least 6 characters.', 'error');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('Validation Error', 'New password and confirmation do not match.', 'error');
      return;
    }

    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password Changed', 'Security credentials updated successfully.', 'success');
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    service.updateSettings({
      companyName: companyForm.companyName,
      contactEmail: companyForm.contactEmail,
      portalTitle: companyForm.portalTitle,
      currency: companyForm.currency,
      defaultLocation: companyForm.defaultLocation,
    });
    showToast('Company Info Saved', 'Recruitment portal company settings updated.', 'success');
  };

  const handleSaveApplicationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    service.updateSettings({
      maxFileSizeMB: Number(applicationForm.maxFileSizeMB),
      autoAcknowledgeEmail: applicationForm.autoAcknowledgeEmail,
      requireCoverLetter: applicationForm.requireCoverLetter,
    });
    showToast('Application Preferences Saved', 'Job application submission parameters updated.', 'success');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    service.updateSettings({
      emailOnNewApplication: notificationForm.emailOnNewApplication,
      emailDailyDigest: notificationForm.emailDailyDigest,
      emailOnShortlist: notificationForm.emailOnShortlist,
    });
    showToast('Notification Preferences Saved', 'Recruiter alert notifications updated.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          System Administration & Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Manage admin profile, recruitment preferences, security parameters, and notification alerts.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'profile' ? 600 : 500,
            color: activeTab === 'profile' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'profile' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            marginBottom: '-5px',
            transition: 'var(--transition-fast)',
          }}
        >
          <User size={16} /> Admin Profile
        </button>

        <button
          onClick={() => setActiveTab('security')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'security' ? 600 : 500,
            color: activeTab === 'security' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'security' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            marginBottom: '-5px',
            transition: 'var(--transition-fast)',
          }}
        >
          <Shield size={16} /> Password & Security
        </button>

        <button
          onClick={() => setActiveTab('company')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'company' ? 600 : 500,
            color: activeTab === 'company' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'company' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            marginBottom: '-5px',
            transition: 'var(--transition-fast)',
          }}
        >
          <Building size={16} /> Company & Portal Info
        </button>

        <button
          onClick={() => setActiveTab('application')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'application' ? 600 : 500,
            color: activeTab === 'application' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'application' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            marginBottom: '-5px',
            transition: 'var(--transition-fast)',
          }}
        >
          <FileCheck size={16} /> Application Preferences
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'notifications' ? 600 : 500,
            color: activeTab === 'notifications' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'notifications' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            marginBottom: '-5px',
            transition: 'var(--transition-fast)',
          }}
        >
          <Bell size={16} /> Notifications
        </button>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. ADMIN PROFILE TAB */}
      {activeTab === 'profile' && (
        <Card title="Administrator Profile Information" subtitle="Update your admin details and contact card.">
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
            <Input
              label="Full Name"
              value={profileForm.adminName}
              onChange={(e) => setProfileForm({ ...profileForm, adminName: e.target.value })}
            />

            <Input
              label="Primary Email Address"
              type="email"
              value={profileForm.adminEmail}
              onChange={(e) => setProfileForm({ ...profileForm, adminEmail: e.target.value })}
            />

            <Input
              label="Phone Number"
              value={profileForm.adminPhone}
              onChange={(e) => setProfileForm({ ...profileForm, adminPhone: e.target.value })}
            />

            <Input
              label="Administrative Title"
              value={profileForm.adminTitle}
              onChange={(e) => setProfileForm({ ...profileForm, adminTitle: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <Button variant="primary" icon={<Save size={16} />} type="submit">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 2. PASSWORD & SECURITY TAB */}
      {activeTab === 'security' && (
        <Card title="Security & Credentials" subtitle="Manage account password and authentication settings.">
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
            <Input
              label="Current Password *"
              type="password"
              placeholder="Enter current password"
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
            />

            <Input
              label="New Password *"
              type="password"
              placeholder="Enter new password (min. 6 characters)"
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
            />

            <Input
              label="Confirm New Password *"
              type="password"
              placeholder="Confirm new password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <Button variant="primary" icon={<Key size={16} />} type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 3. COMPANY & PORTAL INFO TAB */}
      {activeTab === 'company' && (
        <Card title="Company & Recruitment Portal Parameters" subtitle="Configure organization details and portal branding.">
          <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
            <Input
              label="Company Name"
              value={companyForm.companyName}
              onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
            />

            <Input
              label="HR Inquiry Email"
              type="email"
              value={companyForm.contactEmail}
              onChange={(e) => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
            />

            <Input
              label="Portal Display Title"
              value={companyForm.portalTitle}
              onChange={(e) => setCompanyForm({ ...companyForm, portalTitle: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <Input
                label="Currency Symbol / Code"
                value={companyForm.currency}
                onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
              />

              <Input
                label="Default Location"
                value={companyForm.defaultLocation}
                onChange={(e) => setCompanyForm({ ...companyForm, defaultLocation: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <Button variant="primary" icon={<Save size={16} />} type="submit">
                Save Company Info
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 4. APPLICATION PREFERENCES TAB */}
      {activeTab === 'application' && (
        <Card title="Candidate Job Application Rules" subtitle="Set file attachment limits and submission behavior.">
          <form onSubmit={handleSaveApplicationSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
            <Input
              label="Maximum Resume File Size (MB)"
              type="number"
              value={applicationForm.maxFileSizeMB}
              onChange={(e) => setApplicationForm({ ...applicationForm, maxFileSizeMB: Number(e.target.value) })}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  Auto-acknowledge Application Email
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Send automated receipt email to candidates upon submitting application.
                </span>
              </div>
              <input
                type="checkbox"
                checked={applicationForm.autoAcknowledgeEmail}
                onChange={(e) => setApplicationForm({ ...applicationForm, autoAcknowledgeEmail: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  Mandatory Cover Letter
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Require candidates to attach or write a cover letter when applying.
                </span>
              </div>
              <input
                type="checkbox"
                checked={applicationForm.requireCoverLetter}
                onChange={(e) => setApplicationForm({ ...applicationForm, requireCoverLetter: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <Button variant="primary" icon={<Save size={16} />} type="submit">
                Save Application Rules
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 5. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <Card title="Recruiter Email Notifications" subtitle="Configure email alerts for candidate application milestones.">
          <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  New Application Instant Alerts
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Receive email notification whenever a new candidate applies to an active vacancy.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationForm.emailOnNewApplication}
                onChange={(e) => setNotificationForm({ ...notificationForm, emailOnNewApplication: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  Daily Digest Summary Email
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Receive a daily morning summary of all application activity and new submissions.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationForm.emailDailyDigest}
                onChange={(e) => setNotificationForm({ ...notificationForm, emailDailyDigest: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  Candidate Shortlist & Selection Alerts
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Notify assigned recruiters when a candidate status is updated to Shortlisted or Selected.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationForm.emailOnShortlist}
                onChange={(e) => setNotificationForm({ ...notificationForm, emailOnShortlist: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <Button variant="primary" icon={<Save size={16} />} type="submit">
                Save Notification Preferences
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
