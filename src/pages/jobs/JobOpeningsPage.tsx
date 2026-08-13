import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import { jobApiService } from '../../services/apiService';
import { useToast } from '../../components/common/Toast';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Users,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import type { JobOpening, WPPostStatus } from '../../types/database';

export const JobOpeningsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [viewingJob, setViewingJob] = useState<JobOpening | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Mumbai, MH (Hybrid)',
    employmentType: 'Full-time' as JobOpening['employmentType'],
    experience: '3 - 5 Years',
    salary: '₹12,00,000 - ₹18,00,000 P.A.',
    content: '',
    requirements: '',
    skills: 'React, TypeScript, Node.js',
    deadline: '2026-10-31',
    status: 'publish' as WPPostStatus,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await jobApiService.getJobs();
      setJobs(data);
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to fetch job openings.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Check state passed from navigation (e.g. create button from dashboard)
  useEffect(() => {
    const locState = location.state as { openCreateModal?: boolean; viewJobId?: number } | null;
    if (locState?.openCreateModal) {
      handleOpenCreateModal();
      navigate(location.pathname, { replace: true, state: {} });
    } else if (locState?.viewJobId && jobs.length > 0) {
      const targetJob = jobs.find((j) => j.id === locState.viewJobId);
      if (targetJob) {
        setViewingJob(targetJob);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, jobs, navigate, location.pathname]);

  // Departments list for filtering
  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesDept = departmentFilter === 'all' || job.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'Mumbai, MH (Hybrid)',
      employmentType: 'Full-time',
      experience: '3 - 5 Years',
      salary: '₹12,00,000 - ₹18,00,000 P.A.',
      content: '',
      requirements: '',
      skills: 'React, TypeScript, Node.js',
      deadline: '2026-10-31',
      status: 'publish',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (job: JobOpening) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      experience: job.experience,
      salary: job.salary,
      content: job.content,
      requirements: job.requirements,
      skills: job.skills.join(', '),
      deadline: job.deadline,
      status: job.status,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
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

  const handleSaveJob = async (targetStatus?: WPPostStatus) => {
    if (!validateForm()) return;

    const finalStatus = targetStatus || formData.status;
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSaving(true);
    try {
      if (editingJob) {
        await jobApiService.updateJob(editingJob.id, {
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
          status: finalStatus,
        });
        showToast('Job Updated', `"${formData.title}" updated successfully.`, 'success');
      } else {
        await jobApiService.createJob({
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
          status: finalStatus,
        });
        showToast('Job Created', `New vacancy "${formData.title}" created successfully.`, 'success');
      }

      setIsFormModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      showToast('Error', err?.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (job: JobOpening, newStatus: WPPostStatus) => {
    try {
      await jobApiService.updateJobStatus(job.id, newStatus);
      const labelMap: Record<WPPostStatus, string> = {
        publish: 'Published',
        draft: 'Saved as Draft',
        closed: 'Closed',
        inherit: 'Inherited',
        trash: 'Archived',
      };
      showToast('Status Updated', `Job status set to ${labelMap[newStatus]}`, 'info');
      fetchJobs();
    } catch (err: any) {
      showToast('Status Update Failed', err?.message || 'Failed to update job status.', 'error');
    }
  };

  const handleDeleteJob = async () => {
    if (deletingJobId) {
      const job = jobs.find((j) => j.id === deletingJobId);
      try {
        await jobApiService.deleteJob(deletingJobId);
        showToast('Job Archived', `Job vacancy "${job?.title || ''}" archived.`, 'error');
        setDeletingJobId(null);
        fetchJobs();
      } catch (err: any) {
        showToast('Delete Failed', err?.message || 'Failed to delete job.', 'error');
      }
    }
  };

  const columns: Column<JobOpening>[] = [
    {
      key: 'title',
      header: 'Job Title & Details',
      render: (job) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            onClick={() => setViewingJob(job)}
            style={{ fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}
          >
            {job.title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.employmentType}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Experience & Salary',
      render: (job) => (
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8125rem' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{job.experience}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{job.salary}</span>
        </div>
      ),
    },
    {
      key: 'applicationCount',
      header: 'Applications',
      align: 'center',
      render: (job) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/applications', { state: { jobId: job.id } })}
          style={{ fontWeight: 600, color: 'var(--brand-primary)' }}
        >
          <Users size={14} /> {job.applicationCount || 0}
        </Button>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (job) => <Badge status={job.status} />,
    },
    {
      key: 'dateCreated',
      header: 'Created Date',
      render: (job) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {job.dateCreated.split(' ')[0]}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (job) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            onClick={() => setViewingJob(job)}
            title="View Job Details"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit size={14} />}
            onClick={() => handleOpenEditModal(job)}
            title="Edit Job"
          />

          {job.status === 'publish' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(job, 'closed')}
              title="Close/Unpublish Job"
            >
              Close
            </Button>
          )}

          {(job.status === 'closed' || job.status === 'draft') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange(job, 'publish')}
              title="Publish Job"
            >
              Publish
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} style={{ color: '#ef4444' }} />}
            onClick={() => setDeletingJobId(job.id)}
            title="Archive Job"
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Job Openings Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Manage active vacancies, draft postings, and candidate application quotas.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="ghost"
            icon={<RefreshCw size={16} className={isLoading ? 'spin' : ''} />}
            onClick={fetchJobs}
            title="Refresh Openings"
          >
            Refresh
          </Button>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenCreateModal}>
            Post New Job Opening
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <Input
              placeholder="Search by job title, location, or required skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status:</span>
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
                <option value="all">All Statuses</option>
                <option value="publish">Published</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Jobs Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredJobs}
          keyExtractor={(job) => job.id}
          emptyText="No job openings found matching your criteria."
        />
      </Card>

      {/* CREATE / EDIT JOB MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingJob ? 'Edit Job Vacancy' : 'Post New Job Opening'}
        subtitle="Fill in job details, qualifications, and publication status."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleSaveJob('draft')} isLoading={isSaving} disabled={isSaving}>
              Save as Draft
            </Button>
            <Button variant="primary" onClick={() => handleSaveJob('publish')} isLoading={isSaving} disabled={isSaving}>
              {editingJob ? 'Update Job' : 'Publish Job'}
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
                list="dept-options"
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
              <datalist id="dept-options">
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

      {/* VIEW JOB DETAILS MODAL */}
      <Modal
        isOpen={!!viewingJob}
        onClose={() => setViewingJob(null)}
        title={viewingJob?.title || 'Job Opening Details'}
        subtitle={`${viewingJob?.department} • ${viewingJob?.location}`}
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewingJob(null)}>
              Close
            </Button>
            {viewingJob && (
              <Button
                variant="primary"
                icon={<Users size={16} />}
                onClick={() => {
                  const jId = viewingJob.id;
                  setViewingJob(null);
                  navigate('/applications', { state: { jobId: jId } });
                }}
              >
                View Applications ({viewingJob.applicationCount || 0})
              </Button>
            )}
          </>
        }
      >
        {viewingJob && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</p>
                <div style={{ marginTop: '4px' }}>
                  <Badge status={viewingJob.status} />
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Employment Type</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {viewingJob.employmentType}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {viewingJob.experience}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary Package</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {viewingJob.salary}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Application Deadline</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {viewingJob.deadline}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Job Description
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {viewingJob.content}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Requirements & Qualifications
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {viewingJob.requirements}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Required Skills
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {viewingJob.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--brand-light)',
                      color: 'var(--brand-primary)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={!!deletingJobId}
        onClose={() => setDeletingJobId(null)}
        title="Confirm Job Archive"
        subtitle="Are you sure you want to archive this job opening?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingJobId(null)}>
              Cancel
            </Button>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDeleteJob}>
              Archive Job
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Archiving this job will remove it from active listings. Existing candidate applications will remain safely saved in the database.
        </p>
      </Modal>
    </div>
  );
};
