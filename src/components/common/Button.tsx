import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--brand-primary)',
          color: '#ffffff',
          border: '1px solid transparent',
        };
      case 'secondary':
        return {
          backgroundColor: '#f1f5f9',
          color: '#334155',
          border: '1px solid #cbd5e1',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#334155',
          border: '1px solid #cbd5e1',
        };
      case 'danger':
        return {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          border: '1px solid transparent',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#475569',
          border: '1px solid transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.8125rem' };
      case 'md':
        return { padding: '8px 16px', fontSize: '0.875rem' };
      case 'lg':
        return { padding: '12px 20px', fontSize: '1rem' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        transition: 'var(--transition-fast)',
        opacity: disabled || isLoading ? 0.65 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`custom-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};
