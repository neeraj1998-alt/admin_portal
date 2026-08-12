/**
 * Database schema type definitions strictly matching the provided reference PDFs.
 * Primary table: wp_posts
 */

export type WPPostStatus = 'publish' | 'draft' | 'inherit' | 'closed' | 'trash';

export type WPPostType = 
  | 'awsm_job_openings' 
  | 'awsm_job_application' 
  | 'attachment' 
  | 'page' 
  | 'revision' 
  | 'wp_navigation' 
  | 'wp_global_styles' 
  | 'wp_template_part';

export interface WPPost {
  ID: number;
  post_author: number;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: WPPostStatus;
  comment_status: 'open' | 'closed' | string;
  ping_status: 'open' | 'closed' | string;
  post_password?: string;
  post_name: string;
  to_ping?: string;
  pinged?: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered?: string;
  post_parent: number; // Links application -> job opening ID, attachment -> application ID
  guid: string;
  menu_order: number;
  post_type: WPPostType;
  post_mime_type: string;
  comment_count: number;
}

/**
 * Derived domain models for UI presentation (mapped strictly from wp_posts)
 */
export type ApplicationStageStatus = 'New' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  experience: string;
  salary: string;
  content: string; // Job description
  requirements: string;
  skills: string[];
  deadline: string;
  status: WPPostStatus; // 'publish' | 'draft' | 'closed' | 'trash'
  dateCreated: string;
  dateModified: string;
  slug: string;
  authorId: number;
  authorName?: string;
  applicationCount?: number;
}

export interface JobApplication {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobOpeningId: number;
  jobTitle?: string;
  jobDepartment?: string;
  dateSubmitted: string;
  status: ApplicationStageStatus;
  postStatus?: WPPostStatus;
  resumeAttachmentId?: number;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeMimeType?: string;
  coverLetter?: string;
  notes?: ApplicationNote[];
}

export interface ApplicationNote {
  id: number;
  authorName: string;
  date: string;
  text: string;
}

export interface ResumeAttachment {
  id: number;
  fileName: string;
  applicationId: number;
  candidateId: number;
  candidateName?: string;
  jobTitle?: string;
  uploadDate: string;
  fileUrl: string;
  mimeType: string;
  fileSize?: string;
  contentSnippet?: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  skills: string[];
  appliedDate: string;
  applicationsCount: number;
  latestJobTitle: string;
  latestStatus: ApplicationStageStatus;
  resumes: ResumeAttachment[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'Administrator' | 'HR Manager' | 'Recruiter';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface SystemSettings {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminTitle: string;
  companyName: string;
  contactEmail: string;
  portalTitle: string;
  currency: string;
  defaultLocation: string;
  allowedFileTypes: string[];
  maxFileSizeMB: number;
  autoAcknowledgeEmail: boolean;
  requireCoverLetter: boolean;
  emailOnNewApplication: boolean;
  emailDailyDigest: boolean;
  emailOnShortlist: boolean;
}

