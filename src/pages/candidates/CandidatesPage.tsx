import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table, type Column } from '../../components/common/Table';
import { useMockData } from '../../services/mockDataService';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import { Search, Eye, FileText } from 'lucide-react';
import type { Candidate, ResumeAttachment } from '../../types/database';

export const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { candidates } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);

  const filteredCandidates = candidates.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.latestJobTitle.toLowerCase().includes(query) ||
      c.skills.some((s) => s.toLowerCase().includes(query))
    );
  });

  const columns: Column<Candidate>[] = [
    {
      key: 'name',
      header: 'Candidate Info',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
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
            {c.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              onClick={() => navigate(`/candidates/${c.id}`)}
              style={{ fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}
            >
              {c.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {c.email} • {c.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'latestJobTitle',
      header: 'Latest Applied Vacancy',
      render: (c) => (
        <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }} className="truncate">
          {c.latestJobTitle}
        </span>
      ),
    },
    {
      key: 'applicationsCount',
      header: 'Applications',
      align: 'center',
      render: (c) => (
        <span
          style={{
            fontWeight: 600,
            fontSize: '0.8125rem',
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {c.applicationsCount} submission{c.applicationsCount > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'latestStatus',
      header: 'Current Stage',
      align: 'center',
      render: (c) => {
        let variant: 'published' | 'draft' | 'inherit' | 'closed' | 'neutral' = 'neutral';
        if (c.latestStatus === 'New') variant = 'inherit';
        if (c.latestStatus === 'Under Review') variant = 'draft';
        if (c.latestStatus === 'Shortlisted') variant = 'published';
        if (c.latestStatus === 'Selected') variant = 'published';
        if (c.latestStatus === 'Rejected') variant = 'closed';

        return <Badge variant={variant}>{c.latestStatus}</Badge>;
      },
    },
    {
      key: 'appliedDate',
      header: 'Date Registered',
      render: (c) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.appliedDate}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            onClick={() => navigate(`/candidates/${c.id}`)}
          >
            Profile
          </Button>

          {c.resumes && c.resumes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<FileText size={14} />}
              onClick={() => setSelectedResume(c.resumes[0])}
            >
              Resume
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Candidates Talent Pool Directory
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Central database of candidate profiles, historical job applications, and uploaded resume attachments.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <Card padding="sm">
        <div style={{ maxWidth: '450px' }}>
          <Input
            placeholder="Search candidates by name, email, skills, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </Card>

      {/* Candidates Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredCandidates}
          keyExtractor={(c) => c.id}
          emptyText="No candidate profiles found matching your search."
        />
      </Card>

      {/* Resume Viewer Modal */}
      <ResumeViewerModal
        isOpen={!!selectedResume}
        onClose={() => setSelectedResume(null)}
        resume={selectedResume}
      />
    </div>
  );
};
