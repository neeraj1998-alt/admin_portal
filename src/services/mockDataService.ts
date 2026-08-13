import { useState, useEffect } from 'react';
import type {
  JobOpening,
  JobApplication,
  Candidate,
  ResumeAttachment,
  AdminUser,
  SystemSettings,
  ApplicationStageStatus,
  WPPostStatus,
} from '../types/database';

// Initial Mock Datasets
const INITIAL_JOBS: JobOpening[] = [
  {
    id: 101,
    title: 'Senior Full Stack Developer (React & Node.js)',
    department: 'Engineering',
    location: 'Mumbai, MH (Hybrid)',
    employmentType: 'Full-time',
    experience: '4 - 7 Years',
    salary: '₹14,00,000 - ₹22,00,000 P.A.',
    content:
      'We are looking for a Senior Full Stack Developer to lead key module development in our enterprise products. You will build scalable web applications using React, TypeScript, and Node.js microservices.',
    requirements:
      '• 4+ years of professional full stack experience.\n• Proficiency in React 18+, TypeScript, and REST/GraphQL APIs.\n• Solid understanding of PostgreSQL/MySQL and database query optimization.\n• Familiarity with Docker and AWS/GCP CI/CD pipelines.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    deadline: '2026-09-30',
    status: 'publish',
    dateCreated: '2026-07-15 10:30:00',
    dateModified: '2026-08-01 14:20:00',
    slug: 'senior-full-stack-developer',
    authorId: 1,
    authorName: 'MHTECHIN HR Admin',
    applicationCount: 14,
  },
  {
    id: 102,
    title: 'Lead Database Administrator & Architect',
    department: 'Database & Infrastructure',
    location: 'Pune, MH (On-site)',
    employmentType: 'Full-time',
    experience: '6 - 10 Years',
    salary: '₹18,00,000 - ₹28,00,000 P.A.',
    content:
      'Seeking an experienced DBA to oversee enterprise database performance, query optimization, high availability, backup & recovery, and data security standards.',
    requirements:
      '• Expertise in MySQL, PostgreSQL, and Oracle database administration.\n• Deep knowledge of replication, indexing, clustering, and backup strategies.\n• Hands-on script writing in Bash and Python.\n• Certification in Database Administration is preferred.',
    skills: ['Database Admin', 'PostgreSQL', 'MySQL Performance Tuning', 'Backup & Recovery', 'Linux'],
    deadline: '2026-09-15',
    status: 'publish',
    dateCreated: '2026-07-20 11:15:00',
    dateModified: '2026-08-05 09:40:00',
    slug: 'lead-database-administrator',
    authorId: 1,
    authorName: 'MHTECHIN HR Admin',
    applicationCount: 9,
  },
  {
    id: 103,
    title: 'UI/UX Product Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '3 - 5 Years',
    salary: '₹10,00,000 - ₹16,00,000 P.A.',
    content:
      'Design clean, accessible, and high-converting user interfaces for our recruitment and enterprise data management applications.',
    requirements:
      '• Proven portfolio demonstrating user research, wireframing, and polished UI design.\n• Proficiency in Figma, Design Systems, and prototyping tools.\n• Strong understanding of responsive layout principles and WCAG accessibility standards.',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping'],
    deadline: '2026-10-10',
    status: 'publish',
    dateCreated: '2026-08-01 09:00:00',
    dateModified: '2026-08-08 16:00:00',
    slug: 'ui-ux-product-designer',
    authorId: 2,
    authorName: 'Priya Sharma',
    applicationCount: 18,
  },
  {
    id: 104,
    title: 'Data Analyst & Insights Specialist',
    department: 'Data Science',
    location: 'Bangalore, KA (Hybrid)',
    employmentType: 'Full-time',
    experience: '2 - 4 Years',
    salary: '₹8,00,000 - ₹12,00,000 P.A.',
    content:
      'Transform complex recruitment data into actionable executive insights, dashboards, and automated SQL reports.',
    requirements:
      '• Strong proficiency in SQL, Python/Pandas, and PowerBI or Tableau.\n• Experience creating data visualisations and KPI performance metrics.\n• Analytical mindset with keen attention to data accuracy.',
    skills: ['SQL', 'Python', 'PowerBI', 'Data Analysis', 'Tableau'],
    deadline: '2026-09-01',
    status: 'draft',
    dateCreated: '2026-08-05 14:30:00',
    dateModified: '2026-08-05 14:30:00',
    slug: 'data-analyst-insights-specialist',
    authorId: 2,
    authorName: 'Priya Sharma',
    applicationCount: 0,
  },
  {
    id: 105,
    title: 'DevOps & Cloud Systems Engineer',
    department: 'DevOps',
    location: 'Mumbai, MH (On-site)',
    employmentType: 'Full-time',
    experience: '3 - 6 Years',
    salary: '₹12,00,000 - ₹18,00,000 P.A.',
    content:
      'Manage CI/CD build pipelines, Kubernetes clusters, and cloud infrastructure monitoring for high availability services.',
    requirements:
      '• Solid experience with AWS/GCP, Terraform, Docker, and Kubernetes.\n• Experience with Jenkins / GitHub Actions CI/CD workflows.\n• Knowledge of monitoring tools (Prometheus, Grafana, ELK stack).',
    skills: ['DevOps', 'AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    deadline: '2026-08-10',
    status: 'closed',
    dateCreated: '2026-06-10 08:00:00',
    dateModified: '2026-08-11 18:00:00',
    slug: 'devops-cloud-systems-engineer',
    authorId: 1,
    authorName: 'MHTECHIN HR Admin',
    applicationCount: 22,
  },
];

const INITIAL_RESUMES: ResumeAttachment[] = [
  {
    id: 301,
    fileName: 'Aarav_Mehta_Resume_2026.pdf',
    applicationId: 201,
    candidateId: 501,
    candidateName: 'Aarav Mehta',
    jobTitle: 'Senior Full Stack Developer (React & Node.js)',
    uploadDate: '2026-08-10 14:22',
    fileUrl: '/mock-files/Aarav_Mehta_Resume_2026.pdf',
    mimeType: 'application/pdf',
    fileSize: '1.8 MB',
    contentSnippet:
      'Aarav Mehta | Senior Full Stack Developer\nEmail: aarav.mehta@example.com | Phone: +91 98201 12345\nExperience: 5 years at TechSolutions Ltd.\nKey Skills: React, Node.js, TypeScript, PostgreSQL, AWS, Microservices.\nEducation: B.Tech Computer Science, VJTI Mumbai (2021).',
  },
  {
    id: 302,
    fileName: 'Neha_Verma_CV_DBA.pdf',
    applicationId: 202,
    candidateId: 502,
    candidateName: 'Neha Verma',
    jobTitle: 'Lead Database Administrator & Architect',
    uploadDate: '2026-08-09 10:15',
    fileUrl: '/mock-files/Neha_Verma_CV_DBA.pdf',
    mimeType: 'application/pdf',
    fileSize: '2.4 MB',
    contentSnippet:
      'Neha Verma | Database Architect & DBA Specialist\nEmail: neha.verma@example.com | Phone: +91 97112 88492\nExperience: 7 years administering enterprise Oracle & PostgreSQL databases.\nKey Skills: MySQL Tuning, PostgreSQL, Backup & Recovery, Disaster Recovery, Linux Shell.',
  },
  {
    id: 303,
    fileName: 'Rohan_Kulkarni_Portfolio_Resume.pdf',
    applicationId: 203,
    candidateId: 503,
    candidateName: 'Rohan Kulkarni',
    jobTitle: 'UI/UX Product Designer',
    uploadDate: '2026-08-08 16:45',
    fileUrl: '/mock-files/Rohan_Kulkarni_Portfolio_Resume.pdf',
    mimeType: 'application/pdf',
    fileSize: '3.1 MB',
    contentSnippet:
      'Rohan Kulkarni | Senior UI/UX Designer\nEmail: rohan.k@example.com | Phone: +91 99870 54321\nExperience: 4 years designing mobile apps and SaaS analytics dashboards.\nKey Skills: Figma, User Research, Prototyping, Accessibility, Mobile UI Design.',
  },
  {
    id: 304,
    fileName: 'Sneha_Deshmukh_Resume.pdf',
    applicationId: 204,
    candidateId: 504,
    candidateName: 'Sneha Deshmukh',
    jobTitle: 'Senior Full Stack Developer (React & Node.js)',
    uploadDate: '2026-08-07 09:30',
    fileUrl: '/mock-files/Sneha_Deshmukh_Resume.pdf',
    mimeType: 'application/pdf',
    fileSize: '1.2 MB',
    contentSnippet:
      'Sneha Deshmukh | Software Engineer\nEmail: sneha.d@example.com | Phone: +91 98334 66789\nExperience: 4 years full stack engineering.\nKey Skills: React, Node.js, GraphQL, MongoDB, Express.',
  },
  {
    id: 305,
    fileName: 'Vikram_Singh_DBA_Profile.pdf',
    applicationId: 205,
    candidateId: 505,
    candidateName: 'Vikram Singh',
    jobTitle: 'Lead Database Administrator & Architect',
    uploadDate: '2026-08-06 11:20',
    fileUrl: '/mock-files/Vikram_Singh_DBA_Profile.pdf',
    mimeType: 'application/pdf',
    fileSize: '2.0 MB',
    contentSnippet:
      'Vikram Singh | Lead DBA\nEmail: vikram.s@example.com | Phone: +91 99401 22334\nExperience: 8 years in database engineering & high availability database clusters.',
  },
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 201,
    candidateId: 501,
    candidateName: 'Aarav Mehta',
    candidateEmail: 'aarav.mehta@example.com',
    candidatePhone: '+91 98201 12345',
    jobOpeningId: 101,
    jobTitle: 'Senior Full Stack Developer (React & Node.js)',
    jobDepartment: 'Engineering',
    dateSubmitted: '2026-08-10 14:22',
    status: 'New',
    postStatus: 'inherit',
    resumeAttachmentId: 301,
    resumeUrl: '/mock-files/Aarav_Mehta_Resume_2026.pdf',
    resumeFileName: 'Aarav_Mehta_Resume_2026.pdf',
    resumeMimeType: 'application/pdf',
    coverLetter:
      'Dear Hiring Team, I am writing to express my strong interest in the Senior Full Stack Developer position at MHTECHIN. With 5 years of hands-on experience building complex React and Node.js applications, I am confident in my ability to add immediate value to your engineering initiatives.',
    notes: [
      {
        id: 1,
        authorName: 'MHTECHIN HR Admin',
        date: '2026-08-10 15:00',
        text: 'Initial application received. Candidate has strong React and TypeScript experience.',
      },
    ],
  },
  {
    id: 202,
    candidateId: 502,
    candidateName: 'Neha Verma',
    candidateEmail: 'neha.verma@example.com',
    candidatePhone: '+91 97112 88492',
    jobOpeningId: 102,
    jobTitle: 'Lead Database Administrator & Architect',
    jobDepartment: 'Database & Infrastructure',
    dateSubmitted: '2026-08-09 10:15',
    status: 'Under Review',
    postStatus: 'inherit',
    resumeAttachmentId: 302,
    resumeUrl: '/mock-files/Neha_Verma_CV_DBA.pdf',
    resumeFileName: 'Neha_Verma_CV_DBA.pdf',
    resumeMimeType: 'application/pdf',
    coverLetter:
      'I am an experienced Database Administrator with 7 years managing mission-critical MySQL and PostgreSQL clusters. I look forward to contributing to MHTECHIN’s database reliability.',
    notes: [
      {
        id: 1,
        authorName: 'Priya Sharma',
        date: '2026-08-09 11:30',
        text: 'Resume reviewed. Good background in database backup & recovery strategies. Moving to technical round evaluation.',
      },
    ],
  },
  {
    id: 203,
    candidateId: 503,
    candidateName: 'Rohan Kulkarni',
    candidateEmail: 'rohan.k@example.com',
    candidatePhone: '+91 99870 54321',
    jobOpeningId: 103,
    jobTitle: 'UI/UX Product Designer',
    jobDepartment: 'Design',
    dateSubmitted: '2026-08-08 16:45',
    status: 'Shortlisted',
    postStatus: 'inherit',
    resumeAttachmentId: 303,
    resumeUrl: '/mock-files/Rohan_Kulkarni_Portfolio_Resume.pdf',
    resumeFileName: 'Rohan_Kulkarni_Portfolio_Resume.pdf',
    resumeMimeType: 'application/pdf',
    coverLetter:
      'Enclosed is my design portfolio showcasing modern SaaS user interface designs, design system creation, and interactive user flows.',
    notes: [
      {
        id: 1,
        authorName: 'MHTECHIN HR Admin',
        date: '2026-08-09 09:20',
        text: 'Portfolio looks outstanding. Shortlisted for panel interview on Friday.',
      },
    ],
  },
  {
    id: 204,
    candidateId: 504,
    candidateName: 'Sneha Deshmukh',
    candidateEmail: 'sneha.d@example.com',
    candidatePhone: '+91 98334 66789',
    jobOpeningId: 101,
    jobTitle: 'Senior Full Stack Developer (React & Node.js)',
    jobDepartment: 'Engineering',
    dateSubmitted: '2026-08-07 09:30',
    status: 'Selected',
    postStatus: 'inherit',
    resumeAttachmentId: 304,
    resumeUrl: '/mock-files/Sneha_Deshmukh_Resume.pdf',
    resumeFileName: 'Sneha_Deshmukh_Resume.pdf',
    resumeMimeType: 'application/pdf',
    coverLetter:
      'Excited to apply for the Senior Full Stack role! I bring 4 years of solid experience in React, TypeScript, and REST APIs.',
    notes: [
      {
        id: 1,
        authorName: 'MHTECHIN HR Admin',
        date: '2026-08-11 14:00',
        text: 'Final interview cleared. Offer letter released for Selected status.',
      },
    ],
  },
  {
    id: 205,
    candidateId: 505,
    candidateName: 'Vikram Singh',
    candidateEmail: 'vikram.s@example.com',
    candidatePhone: '+91 99401 22334',
    jobOpeningId: 102,
    jobTitle: 'Lead Database Administrator & Architect',
    jobDepartment: 'Database & Infrastructure',
    dateSubmitted: '2026-08-06 11:20',
    status: 'Rejected',
    postStatus: 'inherit',
    resumeAttachmentId: 305,
    resumeUrl: '/mock-files/Vikram_Singh_DBA_Profile.pdf',
    resumeFileName: 'Vikram_Singh_DBA_Profile.pdf',
    resumeMimeType: 'application/pdf',
    coverLetter: 'Applying for the Lead DBA role with 8 years of database management experience.',
    notes: [
      {
        id: 1,
        authorName: 'Priya Sharma',
        date: '2026-08-07 10:00',
        text: 'Candidate expectations do not align with current budget for this position.',
      },
    ],
  },
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 501,
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98201 12345',
    location: 'Mumbai, India',
    experience: '5 Years',
    education: 'B.Tech Computer Science, VJTI Mumbai',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    appliedDate: '2026-08-10',
    applicationsCount: 1,
    latestJobTitle: 'Senior Full Stack Developer (React & Node.js)',
    latestStatus: 'New',
    resumes: [INITIAL_RESUMES[0]],
  },
  {
    id: 502,
    name: 'Neha Verma',
    email: 'neha.verma@example.com',
    phone: '+91 97112 88492',
    location: 'Pune, India',
    experience: '7 Years',
    education: 'M.Tech Information Technology, COEP Pune',
    skills: ['MySQL', 'PostgreSQL', 'Oracle', 'Linux Shell', 'Database Admin'],
    appliedDate: '2026-08-09',
    applicationsCount: 1,
    latestJobTitle: 'Lead Database Administrator & Architect',
    latestStatus: 'Under Review',
    resumes: [INITIAL_RESUMES[1]],
  },
  {
    id: 503,
    name: 'Rohan Kulkarni',
    email: 'rohan.k@example.com',
    phone: '+91 99870 54321',
    location: 'Bangalore, India',
    experience: '4 Years',
    education: 'B.Des Interaction Design, NID',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'User Research'],
    appliedDate: '2026-08-08',
    applicationsCount: 1,
    latestJobTitle: 'UI/UX Product Designer',
    latestStatus: 'Shortlisted',
    resumes: [INITIAL_RESUMES[2]],
  },
  {
    id: 504,
    name: 'Sneha Deshmukh',
    email: 'sneha.d@example.com',
    phone: '+91 98334 66789',
    location: 'Mumbai, India',
    experience: '4 Years',
    education: 'B.E. Information Technology, SPIT Mumbai',
    skills: ['React', 'Node.js', 'GraphQL', 'MongoDB', 'Express'],
    appliedDate: '2026-08-07',
    applicationsCount: 1,
    latestJobTitle: 'Senior Full Stack Developer (React & Node.js)',
    latestStatus: 'Selected',
    resumes: [INITIAL_RESUMES[3]],
  },
  {
    id: 505,
    name: 'Vikram Singh',
    email: 'vikram.s@example.com',
    phone: '+91 99401 22334',
    location: 'Nagpur, India',
    experience: '8 Years',
    education: 'B.E. Computer Technology, VNIT Nagpur',
    skills: ['Database Admin', 'High Availability', 'Disaster Recovery', 'Oracle'],
    appliedDate: '2026-08-06',
    applicationsCount: 1,
    latestJobTitle: 'Lead Database Administrator & Architect',
    latestStatus: 'Rejected',
    resumes: [INITIAL_RESUMES[4]],
  },
];

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    name: 'MHTECHIN HR Admin',
    email: 'admin@mhtechin.com',
    role: 'Administrator',
    status: 'active',
    lastLogin: '2026-08-12 12:30',
    createdAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@mhtechin.com',
    role: 'HR Manager',
    status: 'active',
    lastLogin: '2026-08-11 16:45',
    createdAt: '2026-02-15',
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@mhtechin.com',
    role: 'Recruiter',
    status: 'active',
    lastLogin: '2026-08-10 09:15',
    createdAt: '2026-04-01',
  },
  {
    id: 4,
    name: 'Kavita Roy',
    email: 'kavita.roy@mhtechin.com',
    role: 'Recruiter',
    status: 'inactive',
    lastLogin: '2026-07-25 14:00',
    createdAt: '2026-05-12',
  },
];

const INITIAL_SETTINGS: SystemSettings = {
  adminName: 'MHTECHIN HR Admin',
  adminEmail: 'admin@mhtechin.com',
  adminPhone: '+91 22 4000 8888',
  adminTitle: 'Lead Recruitment Administrator',
  companyName: 'MHTECHIN Solutions Pvt. Ltd.',
  contactEmail: 'careers@mhtechin.com',
  portalTitle: 'MHTECHIN Database Admin Recruitment Portal',
  currency: 'INR (₹)',
  defaultLocation: 'Mumbai, Maharashtra',
  allowedFileTypes: ['.pdf', '.doc', '.docx'],
  maxFileSizeMB: 10,
  autoAcknowledgeEmail: true,
  requireCoverLetter: false,
  emailOnNewApplication: true,
  emailDailyDigest: true,
  emailOnShortlist: true,
};

// Global reactive state store
class MockDataStore {
  private jobs: JobOpening[] = [...INITIAL_JOBS];
  private applications: JobApplication[] = [...INITIAL_APPLICATIONS];
  private candidates: Candidate[] = [...INITIAL_CANDIDATES];
  private resumes: ResumeAttachment[] = [...INITIAL_RESUMES];
  private adminUsers: AdminUser[] = [...INITIAL_ADMIN_USERS];
  private settings: SystemSettings = { ...INITIAL_SETTINGS };

  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- JOBS API ---
  public getJobs(): JobOpening[] {
    return [...this.jobs];
  }

  public getJobById(id: number): JobOpening | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  public createJob(jobData: Omit<JobOpening, 'id' | 'dateCreated' | 'dateModified' | 'slug' | 'applicationCount'>): JobOpening {
    const newId = Math.max(...this.jobs.map((j) => j.id), 100) + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const slug = jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newJob: JobOpening = {
      ...jobData,
      id: newId,
      slug,
      dateCreated: now,
      dateModified: now,
      applicationCount: 0,
    };

    this.jobs = [newJob, ...this.jobs];
    this.notify();
    return newJob;
  }

  public updateJob(id: number, updates: Partial<JobOpening>): JobOpening | undefined {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
      dateModified: now,
    };

    // If job title changed, update related applications
    if (updates.title) {
      this.applications = this.applications.map((app) =>
        app.jobOpeningId === id ? { ...app, jobTitle: updates.title } : app
      );
    }

    this.notify();
    return this.jobs[index];
  }

  public updateJobStatus(id: number, status: WPPostStatus): JobOpening | undefined {
    return this.updateJob(id, { status });
  }

  public deleteJob(id: number): boolean {
    this.jobs = this.jobs.filter((j) => j.id !== id);
    this.notify();
    return true;
  }

  // --- APPLICATIONS API ---
  public getApplications(): JobApplication[] {
    return [...this.applications];
  }

  public getApplicationById(id: number): JobApplication | undefined {
    return this.applications.find((a) => a.id === id);
  }

  public updateApplicationStatus(id: number, status: ApplicationStageStatus): JobApplication | undefined {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    this.applications[index] = {
      ...this.applications[index],
      status,
    };

    // Sync candidate's latest status
    const candidateId = this.applications[index].candidateId;
    const candidateIdx = this.candidates.findIndex((c) => c.id === candidateId);
    if (candidateIdx !== -1) {
      this.candidates[candidateIdx] = {
        ...this.candidates[candidateIdx],
        latestStatus: status,
      };
    }

    this.notify();
    return this.applications[index];
  }

  public addApplicationNote(id: number, noteText: string, authorName = 'MHTECHIN HR Admin'): JobApplication | undefined {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    const currentNotes = this.applications[index].notes || [];
    const newNote = {
      id: Date.now(),
      authorName,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: noteText,
    };

    this.applications[index] = {
      ...this.applications[index],
      notes: [...currentNotes, newNote],
    };

    this.notify();
    return this.applications[index];
  }

  // --- CANDIDATES API ---
  public getCandidates(): Candidate[] {
    return [...this.candidates];
  }

  public getCandidateById(id: number): Candidate | undefined {
    return this.candidates.find((c) => c.id === id);
  }

  // --- RESUMES API ---
  public getResumes(): ResumeAttachment[] {
    return [...this.resumes];
  }

  public getResumeById(id: number): ResumeAttachment | undefined {
    return this.resumes.find((r) => r.id === id);
  }

  // --- ADMIN USERS API ---
  public getAdminUsers(): AdminUser[] {
    return [...this.adminUsers];
  }

  public addAdminUser(userData: Omit<AdminUser, 'id' | 'lastLogin' | 'createdAt'>): AdminUser {
    const newId = Math.max(...this.adminUsers.map((u) => u.id), 0) + 1;
    const now = new Date().toISOString().split('T')[0];

    const newUser: AdminUser = {
      ...userData,
      id: newId,
      lastLogin: 'Never',
      createdAt: now,
    };

    this.adminUsers = [...this.adminUsers, newUser];
    this.notify();
    return newUser;
  }

  public updateAdminUser(id: number, updates: Partial<AdminUser>): AdminUser | undefined {
    const index = this.adminUsers.findIndex((u) => u.id === id);
    if (index === -1) return undefined;

    this.adminUsers[index] = {
      ...this.adminUsers[index],
      ...updates,
    };

    this.notify();
    return this.adminUsers[index];
  }

  public toggleUserStatus(id: number): AdminUser | undefined {
    const user = this.adminUsers.find((u) => u.id === id);
    if (!user) return undefined;
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    return this.updateAdminUser(id, { status: nextStatus });
  }

  // --- SETTINGS API ---
  public getSettings(): SystemSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
    this.notify();
    return { ...this.settings };
  }

  // --- DASHBOARD METRICS API ---
  public getDashboardStats() {
    const totalJobs = this.jobs.length;
    const activeJobs = this.jobs.filter((j) => j.status === 'publish').length;
    const draftJobs = this.jobs.filter((j) => j.status === 'draft').length;
    const closedJobs = this.jobs.filter((j) => j.status === 'closed').length;

    const totalApplications = this.applications.length;
    const newApplications = this.applications.filter((a) => a.status === 'New').length;
    const underReviewApplications = this.applications.filter((a) => a.status === 'Under Review').length;
    const shortlistedCandidates = this.applications.filter((a) => a.status === 'Shortlisted').length;
    const selectedCandidates = this.applications.filter((a) => a.status === 'Selected').length;
    const rejectedApplications = this.applications.filter((a) => a.status === 'Rejected').length;

    return {
      totalJobs,
      activeJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      newApplications,
      underReviewApplications,
      shortlistedCandidates,
      selectedCandidates,
      rejectedApplications,
    };
  }
}

export const mockDataService = new MockDataStore();

// React hook for consuming state Reactively
export function useMockData() {
  const [data, setData] = useState(() => ({
    jobs: mockDataService.getJobs(),
    applications: mockDataService.getApplications(),
    candidates: mockDataService.getCandidates(),
    resumes: mockDataService.getResumes(),
    adminUsers: mockDataService.getAdminUsers(),
    settings: mockDataService.getSettings(),
    stats: mockDataService.getDashboardStats(),
    service: mockDataService,
  }));

  useEffect(() => {
    const unsubscribe = mockDataService.subscribe(() => {
      setData({
        jobs: mockDataService.getJobs(),
        applications: mockDataService.getApplications(),
        candidates: mockDataService.getCandidates(),
        resumes: mockDataService.getResumes(),
        adminUsers: mockDataService.getAdminUsers(),
        settings: mockDataService.getSettings(),
        stats: mockDataService.getDashboardStats(),
        service: mockDataService,
      });
    });
    return unsubscribe;
  }, []);

  return data;
}
