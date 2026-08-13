import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Download, FileText, ZoomIn, ZoomOut, Check, Eye, User, Briefcase, Calendar } from 'lucide-react';
import type { ResumeAttachment } from '../../types/database';
import { useToast } from './Toast';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeAttachment | null;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  resume,
}) => {
  const { showToast } = useToast();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!resume) return null;

  const handleDownload = () => {
    // Create a mock blob download
    const content = resume.contentSnippet || `Resume Document: ${resume.fileName}\nCandidate: ${resume.candidateName}\nJob Title: ${resume.jobTitle}\nDate Uploaded: ${resume.uploadDate}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resume.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Download Started', `Downloading ${resume.fileName}`, 'success');
  };

  const handleCopySnippet = () => {
    if (resume.contentSnippet) {
      navigator.clipboard.writeText(resume.contentSnippet);
      setIsCopied(true);
      showToast('Copied to Clipboard', 'Resume text snippet copied', 'info');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Document Viewer"
      subtitle={resume.fileName}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={<Download size={16} />} onClick={handleDownload}>
            Download Resume
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Document Header Metadata Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '12px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.2 }}>Candidate</p>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginTop: '2px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={resume.candidateName || 'N/A'}
              >
                {resume.candidateName || 'N/A'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Briefcase size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.2 }}>Job Applied</p>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginTop: '2px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={resume.jobTitle || 'N/A'}
              >
                {resume.jobTitle || 'N/A'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Calendar size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.2 }}>Uploaded Date</p>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginTop: '2px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={resume.uploadDate}
              >
                {resume.uploadDate}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.2 }}>File Info</p>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginTop: '2px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={`PDF (${resume.fileSize || '1.8 MB'})`}
              >
                PDF ({resume.fileSize || '1.8 MB'})
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Preview Mode ({zoomLevel}%)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
              style={{
                color: '#ffffff',
                padding: '4px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
              style={{
                color: '#ffffff',
                padding: '4px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleCopySnippet}
              style={{
                color: '#ffffff',
                padding: '4px 10px',
                backgroundColor: isCopied ? '#16a34a' : 'var(--brand-primary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {isCopied ? <Check size={12} /> : null}
              {isCopied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>

        {/* Document Content Paper Mockup */}
        <div
          style={{
            minHeight: '340px',
            maxHeight: '440px',
            overflowY: 'auto',
            backgroundColor: '#f1f5f9',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#ffffff',
              padding: '32px',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              fontFamily: 'system-ui, sans-serif',
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ borderBottom: '2px solid var(--brand-primary)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {resume.candidateName}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '4px' }}>
                {resume.jobTitle} Candidate
              </p>
            </div>

            <div style={{ whiteSpace: 'pre-line', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
              {resume.contentSnippet ||
                `RESUME DOCUMENT SUMMARY\n-----------------------\nCandidate Name: ${resume.candidateName}\nPosition Applied: ${resume.jobTitle}\nFile: ${resume.fileName}\n\nPROFESSIONAL SUMMARY:\nHighly qualified candidate with extensive background in database engineering, cloud infrastructure, software craftsmanship, and collaborative team operations.\n\nEDUCATION & QUALIFICATIONS:\n• Bachelor of Technology in Engineering / Computer Science\n• Certified Industry Specialist\n\nKEY COMPETENCIES:\n• Technical Problem Solving & Architecture\n• Database Administration & System Design\n• Performance Optimization & Cloud Security`}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
