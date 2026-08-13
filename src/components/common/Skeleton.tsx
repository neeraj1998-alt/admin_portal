import React from 'react';

export interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e2e8f0',
        animation: 'pulse 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1)',
      }}
      className={className}
    />
  );
};
