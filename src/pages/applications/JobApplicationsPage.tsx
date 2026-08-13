import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table, type Column } from '../../components/common/Table';
import { applicationApiService, jobApiService, documentApiService } from '../../services/apiService';
import { useToast } from '../../components/common/Toast';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Briefcase,
  RefreshCw,
} from 'lucide-react';
import type { JobApplication, ApplicationStageStatus, ResumeAttachment, JobOpening } from '../../types/database';

export const JobApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [resumes, setResumes] = useState<ResumeAttachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [appsData, jobsData, docsData] = await Promise.allSettled([
        applicationApiService.getApplications(),
        jobApiService.getJobs(),
        documentApiService.getAllDocuments(),
      ]);

      if (appsData.status === 'fulfilled') {
        setApplications(appsData.value);
      }
      if (jobsData.status === 'fulfilled') {
        setJobs(jobsData.value);
      }
      if (docsData.status === 'fulfilled') {
        setResumes(docsData.value);
      }
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to fetch applications.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check state from navigation (e.g. from Jobs page or Dashboard)
  useEffect(() => {
    const locState = location.state as { jobId?: number } | null;
    if (locState?.jobId) {
      setJobFilter(String(locState.jobId));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesJob = jobFilter === 'all' || String(app.jobOpeningId) === jobFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  });

  const handleStatusChange = async (appId: number, candidateName: string, newStatus: ApplicationStageStatus) => {
    try {
      await applicationApiService.updateApplicationStatus(appId, newStatus);
      showToast('Application Status Updated', `Updated ${candidateName}'s status to ${newStatus}`, 'success');
      fetchData();
    } catch (err: any) {
      showToast('Status Update Failed', err?.message || 'Failed to update application status.', 'error');
    }
  };

  const columns: Column<JobApplication>[] = [
    {
      key: 'candidateName',
      header: 'Candidate Name & Email',
      render: (app) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            onClick={() => navigate(`/applications/${app.id}`)}
            style={{ fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}
          >
            {app.candidateName}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {app.candidateEmail} • {app.candidatePhone}
          </span>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Job Applied For',
      render: (app) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            onClick={() => navigate('/jobs', { state: { viewJobId: app.jobOpeningId } })}
            style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            {app.jobTitle}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.jobDepartment}</span>
        </div>
      ),
    },
    {
      key: 'dateSubmitted',
      header: 'Applied Date',
      render: (app) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{app.dateSubmitted}</span>
      ),
    },
    {
      key: 'status',
      header: 'Recruitment Stage',
      align: 'center',
      render: (app) => {
        let variant: 'published' | 'draft' | 'inherit' | 'closed' | 'neutral' = 'neutral';
        if (app.status === 'New') variant = 'inherit';
        if (app.status === 'Under Review') variant = 'draft';
        if (app.status === 'Shortlisted') variant = 'published';
        if (app.status === 'Selected') variant = 'published';
        if (app.status === 'Rejected') variant = 'closed';

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Badge variant={variant}>{app.status}</Badge>
          </div>
        );
      },
    },
    {
      key: 'quickStatus',
      header: 'Update Stage',
      align: 'center',
      render: (app) => (
        <select
          value={app.status}
          onChange={(e) => handleStatusChange(app.id, app.candidateName, e.target.value as ApplicationStageStatus)}
          style={{
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <option value="New">1. New</option>
          <option value="Under Review">2. Under Review</option>
          <option value="Shortlisted">3. Shortlisted</option>
          <option value="Selected">4. Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (app) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            onClick={() => navigate(`/applications/${app.id}`)}
            title="View Application & Candidate Detail"
          >
            Details
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
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Job Applications Directory
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Manage candidate applications, recruitment stages, and application records.
          </p>
        </div>

        <Button
          variant="ghost"
          icon={<RefreshCw size={16} className={isLoading ? 'spin' : ''} />}
          onClick={fetchData}
          title="Refresh Applications"
        >
          Refresh
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card padding="sm">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <Input
              placeholder="Search by candidate name, email, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Job Opening Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Job Opening:</span>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  maxWidth: '220px',
                }}
              >
                <option value="all">All Vacancies</option>
                {jobs.map((job) => (
                  <option key={job.id} value={String(job.id)}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Stage:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="all">All Stages</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Applications Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredApplications}
          keyExtractor={(app) => app.id}
          emptyText="No applications found for the selected filters."
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
