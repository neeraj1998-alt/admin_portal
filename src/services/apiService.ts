import { apiClient } from './apiClient';
import type {
  JobOpening,
  JobApplication,
  ResumeAttachment,
  AdminUser,
  SystemSettings,
  WPPostStatus,
  ApplicationStageStatus,
} from '../types/database';

// Format helpers
const formatFileSize = (bytes?: number | string): string => {
  if (!bytes) return '1.5 MB';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num <= 0) return '1.5 MB';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? String(dateStr).split('T')[0] : d.toISOString().split('T')[0];
  } catch {
    return String(dateStr).split('T')[0];
  }
};

// Status conversions
export const mapBackendJobStatusToFrontend = (status?: string): WPPostStatus => {
  const s = String(status || '').toUpperCase();
  if (s === 'ACTIVE' || s === 'PUBLISH') return 'publish';
  if (s === 'CLOSED' || s === 'TRASH') return 'closed';
  return 'draft';
};

export const mapFrontendJobStatusToBackend = (status?: WPPostStatus): 'ACTIVE' | 'DRAFT' | 'CLOSED' => {
  if (status === 'publish') return 'ACTIVE';
  if (status === 'closed') return 'CLOSED';
  return 'DRAFT';
};

export const mapBackendAppStatusToFrontend = (status?: string): ApplicationStageStatus => {
  const s = String(status || '').toUpperCase();
  if (s === 'UNDER_REVIEW') return 'Under Review';
  if (s === 'SHORTLISTED') return 'Shortlisted';
  if (s === 'SELECTED') return 'Selected';
  if (s === 'REJECTED') return 'Rejected';
  return 'New';
};

export const mapFrontendAppStatusToBackend = (status?: ApplicationStageStatus): string => {
  if (status === 'Under Review') return 'UNDER_REVIEW';
  if (status === 'Shortlisted') return 'SHORTLISTED';
  if (status === 'Selected') return 'SELECTED';
  if (status === 'Rejected') return 'REJECTED';
  return 'NEW';
};

// Entity Adapters
export const adaptJobOpening = (raw: any): JobOpening => {
  let skillsArray: string[] = [];
  if (Array.isArray(raw.skills)) {
    skillsArray = raw.skills;
  } else if (typeof raw.skills === 'string') {
    skillsArray = raw.skills
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  return {
    id: Number(raw.id),
    title: raw.title || '',
    department: raw.department || 'General',
    location: raw.location || 'Remote',
    employmentType: (raw.employment_type || raw.employmentType || 'Full-time') as JobOpening['employmentType'],
    experience: raw.experience || 'Fresher',
    salary: raw.salary || 'Competitive',
    content: raw.description || raw.content || '',
    requirements: raw.requirements || '',
    skills: skillsArray.length > 0 ? skillsArray : ['Communication', 'Teamwork'],
    deadline: formatDate(raw.application_deadline || raw.deadline),
    status: mapBackendJobStatusToFrontend(raw.status),
    dateCreated: formatDate(raw.created_at || raw.dateCreated),
    dateModified: formatDate(raw.updated_at || raw.dateModified),
    slug: (raw.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    authorId: 1,
    authorName: 'MHTECHIN HR Admin',
    applicationCount: Number(raw.total_applications || raw.applicationCount || 0),
  };
};

export const adaptJobApplication = (raw: any): JobApplication => {
  const candidate = raw.candidate || {};
  const job = raw.job || {};

  const candidateName =
    raw.candidate_name ||
    `${candidate.first_name || raw.candidate_first_name || ''} ${candidate.last_name || raw.candidate_last_name || ''}`.trim() ||
    'Applicant';

  const candidateEmail = raw.candidate_email || candidate.email || '';
  const candidatePhone = raw.candidate_phone || candidate.phone || '';
  const jobTitle = raw.job_title || job.title || 'Job Opening';
  const jobDepartment = raw.job_department || job.department || 'Engineering';

  return {
    id: Number(raw.id),
    candidateId: Number(raw.candidate_id || candidate.id || 1),
    candidateName,
    candidateEmail,
    candidatePhone,
    jobOpeningId: Number(raw.job_id || job.id || 1),
    jobTitle,
    jobDepartment,
    dateSubmitted: formatDate(raw.application_date || raw.created_at || raw.applied_at),
    status: mapBackendAppStatusToFrontend(raw.status),
    resumeAttachmentId: raw.resume_attachment_id || raw.resumeAttachmentId || raw.id,
    resumeUrl: raw.resume_url || raw.resumeUrl || apiClient.getDownloadUrl(`/documents/${raw.id}/download`),
    resumeFileName: raw.resume_file_name || raw.original_file_name || `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`,
    coverLetter: raw.cover_letter || raw.coverLetter || 'I am excited to submit my application for this role.',
    notes: Array.isArray(raw.notes)
      ? raw.notes
      : [
          {
            id: 1,
            authorName: 'Recruiter Admin',
            date: formatDate(raw.created_at || raw.application_date),
            text: `Application received for ${jobTitle} position.`,
          },
        ],
  };
};

export const adaptResume = (raw: any): ResumeAttachment => {
  const candidateName = raw.candidate_name || raw.candidateName || 'Candidate';
  const jobTitle = raw.job_title || raw.jobTitle || 'Job Opening';
  const fileName = raw.original_file_name || raw.fileName || `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;

  return {
    id: Number(raw.id),
    fileName,
    applicationId: Number(raw.application_id || raw.applicationId || 1),
    candidateId: Number(raw.candidate_id || raw.candidateId || 1),
    candidateName,
    jobTitle,
    uploadDate: formatDate(raw.uploaded_at || raw.uploadDate),
    fileUrl: apiClient.getDownloadUrl(`/documents/${raw.id}/download`),
    mimeType: raw.mime_type || raw.mimeType || 'application/pdf',
    fileSize: formatFileSize(raw.file_size || raw.fileSize),
    contentSnippet: `RESUME DOCUMENT DETAILS\n-----------------------\nCandidate Name: ${candidateName}\nPosition Applied: ${jobTitle}\nFile Name: ${fileName}\nUpload Date: ${formatDate(raw.uploaded_at || raw.uploadDate)}\n\nPROFESSIONAL OVERVIEW:\nQualified candidate applying for the ${jobTitle} position.\n\nKEY COMPETENCIES:\n• Expertise relevant to ${jobTitle}\n• Technical & Operational Capabilities\n• Team Leadership & Communication Skills`,
  };
};

export const adaptAdminUser = (raw: any): AdminUser => {
  const fullName =
    raw.name ||
    `${raw.first_name || ''} ${raw.last_name || ''}`.trim() ||
    String(raw.email || '').split('@')[0];

  let role: AdminUser['role'] = 'Recruiter';
  if (String(raw.role).toUpperCase().includes('ADMIN')) {
    role = 'Administrator';
  } else if (String(raw.role).toUpperCase().includes('HR')) {
    role = 'HR Manager';
  }

  return {
    id: Number(raw.id),
    name: fullName,
    email: raw.email || '',
    role,
    status: String(raw.account_status || raw.status || 'active').toLowerCase() === 'active' ? 'active' : 'inactive',
    lastLogin: formatDate(raw.updated_at || raw.lastLogin),
    createdAt: formatDate(raw.created_at || raw.createdAt),
  };
};

// Main API Services
export const jobApiService = {
  async getJobs(params?: { status?: string; department?: string; search?: string }): Promise<JobOpening[]> {
    try {
      const data = await apiClient.get<any>('/jobs', params);
      const jobsList = Array.isArray(data) ? data : data?.jobs || [];
      return jobsList.map(adaptJobOpening);
    } catch (err) {
      console.warn('API error fetching jobs, returning empty array:', err);
      throw err;
    }
  },

  async getJobById(id: number): Promise<JobOpening> {
    const data = await apiClient.get<any>(`/jobs/${id}`);
    return adaptJobOpening(data);
  },

  async createJob(jobData: Partial<JobOpening>): Promise<JobOpening> {
    const payload = {
      title: jobData.title,
      department: jobData.department,
      location: jobData.location,
      employment_type: jobData.employmentType,
      experience: jobData.experience,
      salary: jobData.salary,
      description: jobData.content,
      requirements: jobData.requirements,
      skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : jobData.skills,
      application_deadline: jobData.deadline,
      status: mapFrontendJobStatusToBackend(jobData.status),
    };

    const data = await apiClient.post<any>('/jobs', payload);
    return adaptJobOpening(data);
  },

  async updateJob(id: number, jobData: Partial<JobOpening>): Promise<JobOpening> {
    const payload: Record<string, any> = {};
    if (jobData.title !== undefined) payload.title = jobData.title;
    if (jobData.department !== undefined) payload.department = jobData.department;
    if (jobData.location !== undefined) payload.location = jobData.location;
    if (jobData.employmentType !== undefined) payload.employment_type = jobData.employmentType;
    if (jobData.experience !== undefined) payload.experience = jobData.experience;
    if (jobData.salary !== undefined) payload.salary = jobData.salary;
    if (jobData.content !== undefined) payload.description = jobData.content;
    if (jobData.requirements !== undefined) payload.requirements = jobData.requirements;
    if (jobData.skills !== undefined) {
      payload.skills = Array.isArray(jobData.skills) ? jobData.skills.join(', ') : jobData.skills;
    }
    if (jobData.deadline !== undefined) payload.application_deadline = jobData.deadline;
    if (jobData.status !== undefined) payload.status = mapFrontendJobStatusToBackend(jobData.status);

    const data = await apiClient.put<any>(`/jobs/${id}`, payload);
    return adaptJobOpening(data);
  },

  async updateJobStatus(id: number, status: WPPostStatus): Promise<JobOpening> {
    const backendStatus = mapFrontendJobStatusToBackend(status);
    const data = await apiClient.patch<any>(`/jobs/${id}/status`, { status: backendStatus });
    return adaptJobOpening(data);
  },

  async deleteJob(id: number): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },
};

export const applicationApiService = {
  async getApplications(params?: { search?: string; jobId?: string | number; status?: string }): Promise<JobApplication[]> {
    try {
      const data = await apiClient.get<any>('/applications', params);
      const appsList = Array.isArray(data) ? data : data?.applications || [];
      return appsList.map(adaptJobApplication);
    } catch (err) {
      console.warn('API error fetching applications:', err);
      throw err;
    }
  },

  async getApplicationById(id: number): Promise<JobApplication> {
    const data = await apiClient.get<any>(`/applications/${id}`);
    return adaptJobApplication(data);
  },

  async updateApplicationStatus(id: number, status: ApplicationStageStatus): Promise<JobApplication> {
    const backendStatus = mapFrontendAppStatusToBackend(status);
    const data = await apiClient.patch<any>(`/applications/${id}/status`, { status: backendStatus });
    return adaptJobApplication(data);
  },

  async getApplicationDocuments(applicationId: number): Promise<ResumeAttachment[]> {
    const data = await apiClient.get<any>(`/applications/${applicationId}/documents`);
    const docs = Array.isArray(data) ? data : [];
    return docs.map(adaptResume);
  },

  async uploadApplicationDocument(applicationId: number, file: File, documentType: string = 'RESUME'): Promise<ResumeAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const data = await apiClient.upload<any>(`/applications/${applicationId}/documents`, formData);
    return adaptResume(data);
  },
};

export const documentApiService = {
  async getAllDocuments(): Promise<ResumeAttachment[]> {
    try {
      const data = await apiClient.get<any>('/documents');
      const docs = Array.isArray(data) ? data : [];
      return docs.map(adaptResume);
    } catch (err) {
      console.warn('API error fetching documents:', err);
      return [];
    }
  },

  async getDocumentById(id: number): Promise<ResumeAttachment> {
    const data = await apiClient.get<any>(`/documents/${id}`);
    return adaptResume(data);
  },
};

export const dashboardApiService = {
  async getStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    draftJobs: number;
    closedJobs: number;
    totalApplications: number;
    newApplications: number;
    shortlistedCandidates: number;
    selectedCandidates: number;
  }> {
    try {
      const stats = await apiClient.get<any>('/dashboard/stats');
      return {
        totalJobs: stats?.totalJobs || 0,
        activeJobs: stats?.activeJobs || 0,
        draftJobs: stats?.draftJobs || 0,
        closedJobs: stats?.closedJobs || 0,
        totalApplications: stats?.totalApplications || 0,
        newApplications: stats?.newApplications || 0,
        shortlistedCandidates: stats?.shortlistedCandidates || 0,
        selectedCandidates: stats?.selectedCandidates || 0,
      };
    } catch (err) {
      console.warn('API error fetching dashboard stats, using fallback defaults:', err);
      return {
        totalJobs: 0,
        activeJobs: 0,
        draftJobs: 0,
        closedJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        shortlistedCandidates: 0,
        selectedCandidates: 0,
      };
    }
  },

  async getRecentJobs(limit: number = 5): Promise<JobOpening[]> {
    try {
      const data = await apiClient.get<any>('/dashboard/recent-jobs', { limit });
      const list = Array.isArray(data) ? data : [];
      return list.map(adaptJobOpening);
    } catch (err) {
      return [];
    }
  },

  async getRecentApplications(limit: number = 5): Promise<JobApplication[]> {
    try {
      const data = await apiClient.get<any>('/dashboard/recent-applications', { limit });
      const list = Array.isArray(data) ? data : [];
      return list.map(adaptJobApplication);
    } catch (err) {
      return [];
    }
  },
};

export const adminUserApiService = {
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const data = await apiClient.get<any>('/auth/users');
      const list = Array.isArray(data) ? data : [];
      return list.map(adaptAdminUser);
    } catch (err) {
      console.warn('API error fetching admin users:', err);
      return [];
    }
  },

  async createUser(userData: { name: string; email: string; role: string; password?: string; status?: string }): Promise<AdminUser> {
    const parts = userData.name.trim().split(' ');
    const first_name = parts[0] || '';
    const last_name = parts.slice(1).join(' ') || '';

    const payload = {
      email: userData.email,
      password: userData.password || 'admin123',
      role: userData.role.toUpperCase().includes('ADMIN') ? 'ADMIN' : 'RECRUITER',
      first_name,
      last_name,
    };

    const data = await apiClient.post<any>('/auth/users', payload);
    return adaptAdminUser(data);
  },

  async toggleUserStatus(id: number, currentStatus: 'active' | 'inactive'): Promise<AdminUser> {
    const nextStatus = currentStatus === 'active' ? 'INACTIVE' : 'ACTIVE';
    const data = await apiClient.patch<any>(`/auth/users/${id}/status`, { status: nextStatus });
    return adaptAdminUser(data);
  },
};

export const settingsApiService = {
  getSettings(): SystemSettings {
    const local = localStorage.getItem('recruitment_system_settings');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }

    return {
      adminName: 'MHTECHIN HR Admin',
      adminEmail: 'admin@mhtechin.com',
      adminPhone: '+91 98765 43210',
      adminTitle: 'Senior Talent Acquisition Lead',
      companyName: 'MHTECHIN Global Solutions',
      contactEmail: 'careers@mhtechin.com',
      portalTitle: 'Database Recruitment Administration Portal',
      currency: 'INR (₹)',
      defaultLocation: 'Mumbai, MH (Hybrid)',
      allowedFileTypes: ['.pdf', '.doc', '.docx'],
      maxFileSizeMB: 10,
      autoAcknowledgeEmail: true,
      requireCoverLetter: false,
      emailOnNewApplication: true,
      emailDailyDigest: true,
      emailOnShortlist: true,
    };
  },

  updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    const current = settingsApiService.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem('recruitment_system_settings', JSON.stringify(merged));
    return merged;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
