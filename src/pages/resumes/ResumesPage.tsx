import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Table, type Column } from '../../components/common/Table';
import { useMockData } from '../../services/mockDataService';
import { useToast } from '../../components/common/Toast';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import {
  FileText,
  Search,
  Download,
  Eye,
} from 'lucide-react';
import type { ResumeAttachment } from '../../types/database';

export const ResumesPage: React.FC = () => {
  const { resumes } = useMockData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResume, setSelectedResume] = useState<ResumeAttachment | null>(null);

  const filteredResumes = resumes.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.fileName.toLowerCase().includes(q) ||
      (r.candidateName && r.candidateName.toLowerCase().includes(q)) ||
      (r.jobTitle && r.jobTitle.toLowerCase().includes(q))
    );
  });

  const handleDownload = (r: ResumeAttachment) => {
    const content = r.contentSnippet || `Resume Document: ${r.fileName}\nCandidate: ${r.candidateName}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = r.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Download Started', `Downloading ${r.fileName}`, 'success');
  };

  const columns: Column<ResumeAttachment>[] = [
    {
      key: 'fileName',
      header: 'Resume File Name',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-light)',
              color: 'var(--brand-primary)',
            }}
          >
            <FileText size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              onClick={() => setSelectedResume(r)}
              style={{ fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}
            >
              {r.fileName}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {r.mimeType} • {r.fileSize || '1.8 MB'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'candidateName',
      header: 'Candidate Name',
      render: (r) => (
        <span
          onClick={() => setSelectedResume(r)}
          style={{ fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}
          title="Preview Resume"
        >
          {r.candidateName || 'N/A'}
        </span>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Associated Job Position',
      render: (r) => (
        <span style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)' }} className="truncate">
          {r.jobTitle || 'N/A'}
        </span>
      ),
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      render: (r) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{r.uploadDate}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            onClick={() => setSelectedResume(r)}
          >
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => handleDownload(r)}
          >
            Download
          </Button>
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
            Resume & Document Repository
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Central database file attachments and candidate CV records.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card padding="sm">
        <div style={{ maxWidth: '450px' }}>
          <Input
            placeholder="Search resumes by candidate, file name, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </Card>

      {/* Main Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredResumes}
          keyExtractor={(r) => r.id}
          emptyText="No resume attachments found matching your search."
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
