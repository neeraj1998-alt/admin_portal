import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import { useMockData } from '../../services/mockDataService';
import { useToast } from '../../components/common/Toast';
import {
  Plus,
  Search,
  Edit,
  UserX,
  UserCheck,
  Filter,
} from 'lucide-react';
import type { AdminUser } from '../../types/database';

export const AdminUsersPage: React.FC = () => {
  const { adminUsers, service } = useMockData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Recruiter' as AdminUser['role'],
    status: 'active' as AdminUser['status'],
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Recruiter',
      status: 'active',
      password: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required';
    if (!editingUser && !formData.password) errs.password = 'Password is required for new accounts';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveUser = () => {
    if (!validate()) return;

    if (editingUser) {
      service.updateAdminUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });
      showToast('Account Updated', `Admin user "${formData.name}" updated successfully.`, 'success');
    } else {
      service.addAdminUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });
      showToast('Account Created', `New ${formData.role} account created for ${formData.name}.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (user: AdminUser) => {
    const updated = service.toggleUserStatus(user.id);
    if (updated) {
      showToast(
        'Account Status Changed',
        `Account for ${user.name} is now ${updated.status.toUpperCase()}`,
        updated.status === 'active' ? 'success' : 'info'
      );
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Admin / Recruiter User',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: u.status === 'active' ? 'var(--brand-light)' : '#f1f5f9',
              color: u.status === 'active' ? 'var(--brand-primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {u.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => (
        <span
          style={{
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: u.role === 'Administrator' ? '#1d4ed8' : u.role === 'HR Manager' ? '#047857' : '#475569',
            backgroundColor: u.role === 'Administrator' ? '#eff6ff' : u.role === 'HR Manager' ? '#ecfdf5' : '#f1f5f9',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      align: 'center',
      render: (u) => (
        <Badge variant={u.status === 'active' ? 'published' : 'closed'}>
          {u.status === 'active' ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Portal Login',
      render: (u) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.lastLogin}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created On',
      render: (u) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.createdAt}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit size={14} />}
            onClick={() => handleOpenEditModal(u)}
            title="Edit User Role / Details"
          />

          <Button
            variant={u.status === 'active' ? 'outline' : 'primary'}
            size="sm"
            icon={u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
            onClick={() => handleToggleStatus(u)}
            title={u.status === 'active' ? 'Disable Account' : 'Enable Account'}
          >
            {u.status === 'active' ? 'Disable' : 'Enable'}
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
            Admin & Recruiter User Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Manage portal access credentials, administrator roles, and recruiter account privileges.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenAddModal}>
          Add Admin / Recruiter
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <Input
              placeholder="Search by name or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="all">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          emptyText="No admin accounts found matching your query."
        />
      </Card>

      {/* ADD / EDIT ADMIN USER MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Account' : 'Add New Admin / Recruiter'}
        subtitle="Specify account holder information, role privileges, and credentials."
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
              {editingUser ? 'Update Account' : 'Create Account'}
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Full Name *"
            placeholder="e.g. Ananya Roy"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. ananya@mhtechin.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Assigned System Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminUser['role'] })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="Administrator">Administrator (Full Access)</option>
                <option value="HR Manager">HR Manager (Jobs & Pipeline)</option>
                <option value="Recruiter">Recruiter (Applications)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Account Access Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminUser['status'] })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="active">Active (Enabled)</option>
                <option value="inactive">Disabled (Revoked)</option>
              </select>
            </div>
          </div>

          <Input
            label={editingUser ? 'Reset Password (Optional)' : 'Password *'}
            type="password"
            placeholder={editingUser ? 'Leave blank to keep existing password' : 'Enter password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
        </form>
      </Modal>
    </div>
  );
};
