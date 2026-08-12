import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import { useMockData } from '../../services/mockDataService';
import { useToast } from '../../components/common/Toast';
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
  IndianRupee,
} from 'lucide-react';
import type { JobOpening, JobApplication, ResumeAttachment, WPPostStatus } from '../../types/database';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, applications, stats, resumes, service } = useMockData();
  const { showToast } = useToast();
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);

  // Create Job Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Mumbai, MH (Hybrid)',
    employmentType: 'Full-time' as JobOpening['employmentType'],
    experience: '3 - 5 Years',
    salary: '12,00,000 - 18,00,000 P.A.',
    content: '',
    requirements: '',
    skills: 'React, TypeScript, Node.js',
    deadline: '2026-10-31',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenCreateModal = () => {
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'Mumbai, MH (Hybrid)',
      employmentType: 'Full-time',
      experience: '3 - 5 Years',
      salary: '12,00,000 - 18,00,000 P.A.',
      content: '',
      requirements: '',
      skills: 'React, TypeScript, Node.js',
      deadline: '2026-10-31',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Job Title is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.content.trim()) errors.content = 'Job description is required';
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveJob = (status: WPPostStatus = 'publish') => {
    if (!validateForm()) return;

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    service.createJob({
      title: formData.title,
      department: formData.department,
      location: formData.location,
      employmentType: formData.employmentType,
      experience: formData.experience,
      salary: formData.salary,
      content: formData.content,
      requirements: formData.requirements,
      skills: skillsArray,
      deadline: formData.deadline,
      status,
      authorId: 1,
      authorName: 'MHTECHIN HR Admin',
    });

    showToast(
      status === 'publish' ? 'Job Published' : 'Draft Saved',
      `"${formData.title}" was ${status === 'publish' ? 'published' : 'saved as draft'} successfully.`,
      'success'
    );

    setIsCreateModalOpen(false);
  };

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
          {job.applicationCount || 0} applicants
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
            onClick={handleOpenCreateModal}
          >
            Create Job
          </Button>
          <Button variant="outline" icon={<Users size={16} />} onClick={() => navigate('/applications')}>
            View Applications
          </Button>
          <Button variant="outline" icon={<FileText size={16} />} onClick={() => navigate('/resumes')}>
            View Resumes
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
          title="Recent Applications"
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

      {/* CREATE JOB MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Post New Job Opening"
        subtitle="Fill in job details, qualifications, and publication status."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleSaveJob('draft')}>
              Save as Draft
            </Button>
            <Button variant="primary" onClick={() => handleSaveJob('publish')}>
              Publish Job
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Input
              label="Job Title *"
              placeholder="e.g. Senior Full Stack Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={formErrors.title}
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Department / Category *
              </label>
              <input
                type="text"
                list="dept-options-dash"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                }}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              <datalist id="dept-options-dash">
                <option value="Engineering" />
                <option value="Database & Infrastructure" />
                <option value="Design" />
                <option value="Data Science" />
                <option value="Marketing" />
                <option value="HR & Admin" />
              </datalist>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Input
              label="Location *"
              placeholder="e.g. Mumbai, MH (Hybrid)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as JobOpening['employmentType'] })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <Input
              label="Experience Requirement"
              placeholder="e.g. 3 - 5 Years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />

            <Input
              label="Salary / Stipend"
              placeholder="e.g. 12,00,000 - 18,00,000 P.A."
              icon={<IndianRupee size={15} />}
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Job Description *
            </label>
            <textarea
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${formErrors.content ? '#ef4444' : 'var(--border-color)'}`,
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="Detailed description of job roles and responsibilities..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {formErrors.content && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{formErrors.content}</span>}
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Requirements & Qualifications *
            </label>
            <textarea
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${formErrors.requirements ? '#ef4444' : 'var(--border-color)'}`,
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="• Key qualification bullet points..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Input
              label="Required Skills (Comma separated)"
              placeholder="e.g. React, TypeScript, Node.js"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />

            <Input
              type="date"
              label="Application Deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
