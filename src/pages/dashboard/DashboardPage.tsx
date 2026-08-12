import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table, type Column } from '../../components/common/Table';
import { useMockData } from '../../services/mockDataService';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import {
  Briefcase,
  Users,
  CheckCircle,
  Plus,
  Eye,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { JobOpening, JobApplication, ResumeAttachment } from '../../types/database';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, applications, stats, resumes } = useMockData();
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);

  const recentJobs = jobs.slice(0, 5);
  const recentApplications = applications.slice(0, 5);

  const jobColumns: Column<JobOpening>[] = [
    {
      key: 'title',
      header: 'Job Title',
      render: (job) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            onClick={() => navigate('/jobs', { state: { viewJobId: job.id } })}
            style={{ fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}
          >
            {job.title}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {job.department} • {job.location}
          </span>
        </div>
      ),
    },
    {
      key: 'employmentType',
      header: 'Type',
      render: (job) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{job.employmentType}</span>,
    },
    {
      key: 'applicationCount',
      header: 'Applications',
      align: 'center',
      render: (job) => (
        <span
          onClick={() => navigate('/applications', { state: { jobId: job.id } })}
          style={{
            fontWeight: 600,
            color: 'var(--brand-primary)',
            cursor: 'pointer',
            backgroundColor: 'var(--brand-light)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
          }}
        >
          {job.applicationCount || 0} candidates
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (job) => <Badge status={job.status} />,
    },
  ];

  const applicationColumns: Column<JobApplication>[] = [
    {
      key: 'candidateName',
      header: 'Candidate Name',
      render: (app) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            onClick={() => navigate(`/applications/${app.id}`)}
            style={{ fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}
          >
            {app.candidateName}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.candidateEmail}</span>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Job Applied For',
      render: (app) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }} className="truncate">
          {app.jobTitle}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Stage Status',
      align: 'center',
      render: (app) => {
        let variant: 'published' | 'draft' | 'inherit' | 'closed' | 'neutral' = 'neutral';
        if (app.status === 'New') variant = 'inherit';
        if (app.status === 'Under Review') variant = 'draft';
        if (app.status === 'Shortlisted') variant = 'published';
        if (app.status === 'Selected') variant = 'published';
        if (app.status === 'Rejected') variant = 'closed';

        return <Badge variant={variant}>{app.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (app) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            onClick={() => navigate(`/applications/${app.id}`)}
            title="View Details"
          >
            View
          </Button>
          {app.resumeAttachmentId && (
            <Button
              variant="outline"
              size="sm"
              icon={<FileText size={14} />}
              onClick={() => {
                const res = resumes.find((r) => r.id === app.resumeAttachmentId);
                if (res) setSelectedResume(res);
              }}
              title="View Resume"
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
      {/* Top Banner Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Recruitment Executive Dashboard
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--brand-primary)',
                backgroundColor: 'var(--brand-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} /> Live Frontend Mock
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Real-time metric summary, vacancy analytics, and active candidate pipelines.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/jobs', { state: { openCreateModal: true } })}
          >
            Create Job
          </Button>
          <Button variant="outline" icon={<Users size={16} />} onClick={() => navigate('/applications')}>
            View Applications
          </Button>
          <Button variant="outline" icon={<Briefcase size={16} />} onClick={() => navigate('/candidates')}>
            View Candidates
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Total Jobs */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Total Jobs</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                {stats.totalJobs}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-published-text)', fontWeight: 500 }}>
                {stats.activeJobs} Published Active
              </span>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Briefcase size={22} />
            </div>
          </div>
        </Card>

        {/* Active Published Vacancies */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Active Vacancies</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                {stats.activeJobs}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {stats.draftJobs} Drafts • {stats.closedJobs} Closed
              </span>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={22} />
            </div>
          </div>
        </Card>

        {/* Total Applications */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Total Applications</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                {stats.totalApplications}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 500 }}>
                {stats.newApplications} New Unreviewed
              </span>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={22} />
            </div>
          </div>
        </Card>

        {/* Shortlisted Candidates */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Shortlisted</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                {stats.shortlistedCandidates}
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 500 }}>
                Ready for Interview
              </span>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={22} />
            </div>
          </div>
        </Card>

        {/* Selected Candidates */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Selected</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                {stats.selectedCandidates}
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 500 }}>
                Offer Released
              </span>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={22} />
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Section: Recent Job Openings & Recent Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Recent Job Openings */}
        <Card
          title="Recent Job Openings"
          subtitle="Latest vacancies posted in the recruitment database"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate('/jobs')}
            >
              View All Jobs
            </Button>
          }
          padding="none"
        >
          <Table
            columns={jobColumns}
            data={recentJobs}
            keyExtractor={(job) => job.id}
            emptyText="No job openings available."
          />
        </Card>

        {/* Recent Applications */}
        <Card
          title="Recent Candidate Applications"
          subtitle="Latest candidate submissions across active vacancies"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate('/applications')}
            >
              View All Applications
            </Button>
          }
          padding="none"
        >
          <Table
            columns={applicationColumns}
            data={recentApplications}
            keyExtractor={(app) => app.id}
            emptyText="No candidate applications found."
          />
        </Card>
      </div>

      {/* Resume Viewer Modal */}
      <ResumeViewerModal
        isOpen={!!selectedResume}
        onClose={() => setSelectedResume(null)}
        resume={selectedResume}
      />
    </div>
  );
};
