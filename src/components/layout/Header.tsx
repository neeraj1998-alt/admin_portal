import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left Area: Mobile Menu Trigger + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenMobileMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
          }}
          className="mobile-menu-btn"
          aria-label="Open sidebar navigation"
        >
          <Menu size={20} />
        </button>

        <Breadcrumb />
      </div>

      {/* Right Area: User Profile & Actions */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.name || 'Admin User'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {user?.role || 'Administrator'}
            </span>
          </div>

          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setIsProfileOpen(false)}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                zIndex: 50,
                width: '230px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '4px',
                }}
              >
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Signed in as
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                  {user?.email || 'admin@mhtechin.com'}
                </p>
              </div>

              {/* Administrator Profile Link */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/settings');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color var(--transition-fast)',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <UserIcon size={14} style={{ color: 'var(--brand-primary)' }} />
                <span>Administrator Profile</span>
              </button>



              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

              {/* Logout Button */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: '#dc2626',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color var(--transition-fast)',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
