import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { settingsApiService } from '../../services/apiService';
import { useToast } from '../../components/common/Toast';
import {
  User,
  Shield,
  Bell,
  Save,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  // Form State initialized from settingsApiService
  const [profileForm, setProfileForm] = useState({
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminTitle: '',
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [notificationForm, setNotificationForm] = useState({
    emailOnNewApplication: true,
    emailDailyDigest: true,
    emailOnShortlist: true,
  });

  useEffect(() => {
    const s = settingsApiService.getSettings();
    setProfileForm({
      adminName: s.adminName,
      adminEmail: s.adminEmail,
      adminPhone: s.adminPhone,
      adminTitle: s.adminTitle,
    });
    setNotificationForm({
      emailOnNewApplication: s.emailOnNewApplication,
      emailDailyDigest: s.emailDailyDigest,
      emailOnShortlist: s.emailOnShortlist,
    });
  }, []);

  // Action Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    settingsApiService.updateSettings({
      adminName: profileForm.adminName,
      adminEmail: profileForm.adminEmail,
      adminPhone: profileForm.adminPhone,
      adminTitle: profileForm.adminTitle,
    });
    showToast('Profile Updated', 'Administrator profile details saved.', 'success');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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

    setIsChangingPassword(true);
    try {
      await settingsApiService.changePassword(securityForm.currentPassword, securityForm.newPassword);
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password Changed', 'Security credentials updated successfully. Please use your new password on next login.', 'success');
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    settingsApiService.updateSettings({
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
          Profile and Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Manage administrator profile, security parameters, and notification alerts.
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
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Input
              label="New Password *"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password (min. 6 characters)"
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Input
              label="Confirm New Password *"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <Button variant="primary" icon={<Key size={16} />} type="submit" isLoading={isChangingPassword} disabled={isChangingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 3. NOTIFICATIONS TAB */}
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
