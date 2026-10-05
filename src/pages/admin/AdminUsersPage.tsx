import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { UserProfile, UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../lib/utils';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(() => mockStorage.getAllUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [successAlert, setSuccessAlert] = useState('');

  const loadUsers = () => {
    setUsers(mockStorage.getAllUsers());
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    const updated = { ...userToUpdate, role: newRole, updatedAt: new Date().toISOString() };
    mockStorage.updateUser(updated);
    loadUsers();
    setSuccessAlert(`Updated role for ${updated.fullName} to ${newRole}`);
    setTimeout(() => setSuccessAlert(''), 2500);
  };

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-blue-700 dark:text-brand-blue-400" />
            User Management ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, filter, and manage talent profiles and platform permissions.
          </p>
        </div>
      </div>

      {successAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {successAlert}
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="student">Student</option>
            <option value="graduate">Graduate</option>
            <option value="job_seeker">Job Seeker</option>
            <option value="freelancer">Freelancer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Candidate / User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Strength</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.fullName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{u.fullName}</span>
                          {u.role === 'admin' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-blue-600" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="graduate">Graduate</option>
                      <option value="job_seeker">Job Seeker</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {u.location}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-brand-green-600 dark:text-brand-green-400">
                      {u.profileStrength}%
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/u/${u.fullName.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline"
                    >
                      View Portfolio
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

