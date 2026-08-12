import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useMockData } from '../../services/mockDataService';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Eye,
  Award,
} from 'lucide-react';
import type { ResumeAttachment } from '../../types/database';

export const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidates, applications, resumes } = useMockData();
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);

  const candidateId = Number(id);
  const candidate = candidates.find((c) => c.id === candidateId);

  if (!candidate) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Candidate Profile Not Found
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          The requested candidate record ID #{id} was not found in the talent database.
        </p>
        <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/candidates')}>
          Return to Candidates Directory
        </Button>
      </div>
    );
  }

  // Find all applications submitted by this candidate
  const candidateApplications = applications.filter((app) => app.candidateId === candidate.id);
  // Find all resumes uploaded by candidate
  const candidateResumes = resumes.filter((r) => r.candidateId === candidate.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Top */}
      <div>
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/candidates')}
        >
          Back to Candidates Directory
        </Button>
      </div>

      {/* Candidate Profile Hero Banner */}
      <Card padding="lg">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              {candidate.name.charAt(0)}
            </div>

            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {candidate.name}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                Candidate ID #{candidate.id} • Registered {candidate.appliedDate}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {candidateResumes.length > 0 && (
              <Button
                variant="primary"
                icon={<FileText size={16} />}
                onClick={() => setSelectedResume(candidateResumes[0])}
              >
                View Main Resume
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Card: Contact & Background Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Contact & Personal Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{candidate.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{candidate.phone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Location</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{candidate.location}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={16} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Experience</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{candidate.experience}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={16} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest Education</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{candidate.education}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Verified Skills & Stack
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {candidate.skills.map((skill) => (
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
          </Card>

          {/* Uploaded Documents List */}
          <Card title="Submitted Resumes & Attachments">
            {candidateResumes.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No resume files attached.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {candidateResumes.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={20} style={{ color: 'var(--brand-primary)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {res.fileName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {res.fileSize} • Uploaded {res.uploadDate}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => setSelectedResume(res)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Card: Application History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title={`Application History (${candidateApplications.length})`}>
            {candidateApplications.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No active job applications found for this candidate.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {candidateApplications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                          {app.jobTitle}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {app.jobDepartment} • Applied {app.dateSubmitted}
                        </span>
                      </div>

                      <Badge
                        variant={
                          app.status === 'Selected'
                            ? 'published'
                            : app.status === 'Rejected'
                            ? 'closed'
                            : app.status === 'Shortlisted'
                            ? 'published'
                            : 'inherit'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={() => navigate(`/applications/${app.id}`)}
                      >
                        Open Application Record
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
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
