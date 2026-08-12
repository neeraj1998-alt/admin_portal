import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();

  // Generate fallback breadcrumbs from pathname if items not passed explicitly
  const generateItems = (): BreadcrumbItem[] => {
    if (items && items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbList: BreadcrumbItem[] = [{ label: 'Dashboard', path: '/dashboard' }];

    let accumulatedPath = '';
    pathSegments.forEach((segment) => {
      accumulatedPath += `/${segment}`;
      if (segment === 'dashboard') return;

      const formattedLabel = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbList.push({
        label: formattedLabel,
        path: accumulatedPath,
      });
    });

    return breadcrumbList;
  };

  const list = generateItems();

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
      <Link
        to="/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)',
          transition: 'color var(--transition-fast)',
        }}
      >
        <Home size={14} />
      </Link>

      {list.map((item, index) => {
        const isLast = index === list.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
            {isLast || !item.path ? (
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
