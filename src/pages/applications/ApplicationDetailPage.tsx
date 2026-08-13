import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { applicationApiService } from '../../services/apiService';
import { useToast } from '../../components/common/Toast';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Download,
  Send,
} from 'lucide-react';
import type { ApplicationStageStatus, ResumeAttachment, JobApplication, ApplicationNote } from '../../types/database';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [documents, setDocuments] = useState<ResumeAttachment[]>([]);
  const [localNotes, setLocalNotes] = useState<ApplicationNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const applicationId = Number(id);

  const fetchApplicationDetails = useCallback(async () => {
    if (!applicationId || isNaN(applicationId)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [appData, docsData] = await Promise.allSettled([
        applicationApiService.getApplicationById(applicationId),
        applicationApiService.getApplicationDocuments(applicationId),
      ]);

      if (appData.status === 'fulfilled') {
        setApplication(appData.value);
        if (appData.value.notes) {
          setLocalNotes(appData.value.notes);
        }
      } else {
        // Not found or error
        setApplication(null);
      }

      if (docsData.status === 'fulfilled') {
        setDocuments(docsData.value);
      }
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to fetch application details.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, showToast]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const stages: ApplicationStageStatus[] = ['New', 'Under Review', 'Shortlisted', 'Selected'];

  const handleStageChange = async (newStage: ApplicationStageStatus) => {
    if (!application) return;

    try {
      const updated = await applicationApiService.updateApplicationStatus(application.id, newStage);
      setApplication((prev) => (prev ? { ...prev, status: updated.status } : prev));
      showToast('Stage Transitioned', `Application moved to "${newStage}" stage.`, 'success');
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to update stage.', 'error');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !application) return;

    const newNote: ApplicationNote = {
      id: Date.now(),
      authorName: 'Recruiter Admin',
      date: new Date().toISOString().split('T')[0],
      text: newNoteText.trim(),
    };

    setLocalNotes((prev) => [newNote, ...prev]);
    setNewNoteText('');
    showToast('Note Added', 'Recruiter note saved to application record.', 'success');
  };

  const resume = documents.length > 0 ? documents[0] : null;

  const handleDownloadResume = () => {
    if (!resume) return;
    window.open(resume.fileUrl, '_blank');
    showToast('Download Started', `Downloading ${resume.fileName}`, 'success');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
        <Skeleton width="200px" height="36px" />
        <Skeleton width="100%" height="220px" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <Skeleton width="100%" height="300px" />
          <Skeleton width="100%" height="300px" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Application Record Not Found
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          The requested candidate application ID #{id} does not exist in the database.
        </p>
        <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/applications')}>
          Return to Applications List
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/applications')}
        >
          Back to Applications List
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="outline"
            size="sm"
            icon={<Briefcase size={16} />}
            onClick={() => navigate('/jobs', { state: { viewJobId: application.jobOpeningId } })}
          >
            View Job Opening
          </Button>
        </div>
      </div>

      {/* Main Candidate Application Profile Banner Header */}
      <Card padding="lg">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              {application.candidateName.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {application.candidateName}
                </h1>
                <Badge
                  variant={
                    application.status === 'Selected'
                      ? 'published'
                      : application.status === 'Rejected'
                      ? 'closed'
                      : application.status === 'Shortlisted'
                      ? 'published'
                      : 'inherit'
                  }
                >
                  {application.status}
                </Badge>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                Application for <strong style={{ color: 'var(--text-primary)' }}>{application.jobTitle}</strong> ({application.jobDepartment})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {resume && (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<FileText size={16} />}
                  onClick={() => setSelectedResume(resume)}
                >
                  Preview Resume
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Download size={16} />}
                  onClick={handleDownloadResume}
                >
                  Download CV
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Visual Recruitment Workflow Stepper */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Recruitment Stage Progress
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
            }}
          >
            {stages.map((stage, idx) => {
              const currentIdx = stages.indexOf(application.status as ApplicationStageStatus);
              const isCurrent = application.status === stage;
              const isPassed = currentIdx > idx && application.status !== 'Rejected';

              let bgColor = '#f1f5f9';
              let textColor = '#64748b';
              let borderColor = '#e2e8f0';

              if (isCurrent) {
                bgColor = 'var(--brand-primary)';
                textColor = '#ffffff';
                borderColor = 'var(--brand-primary)';
              } else if (isPassed) {
                bgColor = '#dcfce7';
                textColor = '#15803d';
                borderColor = '#86efac';
              }

              return (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: bgColor,
                    color: textColor,
                    border: `1px solid ${borderColor}`,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    fontWeight: isCurrent ? 700 : 500,
                    fontSize: '0.8125rem',
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', opacity: 0.85 }}>Stage {idx + 1}</span>
                  <span>{stage}</span>
                </button>
              );
            })}

            {/* Rejected Button */}
            <button
              onClick={() => handleStageChange('Rejected')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: application.status === 'Rejected' ? '#fee2e2' : '#f1f5f9',
                color: application.status === 'Rejected' ? '#b91c1c' : '#64748b',
                border: `1px solid ${application.status === 'Rejected' ? '#fca5a5' : '#e2e8f0'}`,
                cursor: 'pointer',
                fontWeight: application.status === 'Rejected' ? 700 : 500,
                fontSize: '0.8125rem',
              }}
            >
              <span style={{ fontSize: '0.6875rem', opacity: 0.85 }}>Action</span>
              <span>Reject</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Candidate & Application Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Candidate Overview">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{application.candidateEmail}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{application.candidatePhone}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  Mumbai, India
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  Applied On: {application.dateSubmitted}
                </span>
              </div>
            </div>
          </Card>

          {/* Cover Letter Card */}
          {application.coverLetter && (
            <Card title="Submitted Cover Letter">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {application.coverLetter}
              </p>
            </Card>
          )}
        </div>

        {/* Right Column: Recruiter Notes & Activity Trail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Recruiter Notes & Evaluation History">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  rows={3}
                  placeholder="Add evaluation note or interview feedback..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" size="sm" icon={<Send size={14} />} type="submit">
                    Save Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {(!localNotes || localNotes.length === 0) ? (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                    No recruiter notes recorded yet.
                  </p>
                ) : (
                  localNotes.map((note) => (
                    <div
                      key={note.id}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {note.authorName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{note.date}</span>
                      </div>
                      <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                        {note.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
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
