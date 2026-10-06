import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Search } from 'lucide-react';
import { deleteCareerResource, getCareerResources, saveCareerResource } from '../../lib/resources';
import { isSupabaseConfigured } from '../../lib/supabase';
import { CareerResource, ResourceCategory } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';

export const AdminResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<CareerResource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<CareerResource | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Career Guide');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try { setResources(await getCareerResources()); setError(''); }
    catch { setError('Resources could not be loaded. Check the database connection and your admin access.'); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditingRes(null);
    setTitle('');
    setCategory('Career Guide');
    setSummary('');
    setContent('');
    setReadTime('5 min read');
    setAuthor('');
    setIsModalOpen(true);
  };

  const openEdit = (res: CareerResource) => {
    setEditingRes(res);
    setTitle(res.title);
    setCategory(res.category);
    setSummary(res.summary);
    setContent(res.content);
    setReadTime(res.readTime);
    setAuthor(res.author);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const resToSave: CareerResource = {
      id: editingRes?.id || `res-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      summary,
      content,
      readTime,
      author,
      tags: [category, 'Africa Career'],
      isFeatured: false,
      publishedAt: editingRes?.publishedAt || new Date().toISOString().split('T')[0],
    };

    try {
      await saveCareerResource(resToSave);
      await loadData();
      setIsModalOpen(false);
    } catch {
      setError('The resource could not be saved. Confirm your admin access and try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this career resource?')) {
      try { await deleteCareerResource(id); await loadData(); }
      catch { setError('The resource could not be deleted. Confirm your admin access and try again.'); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-brand-blue-700 dark:text-brand-green-400" />
            Learning & Resources Management ({resources.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create and edit attachment playbooks, interview preparation manuals, and scholarship guides.
          </p>
          {isSupabaseConfigured && <p className="text-xs text-slate-500 mt-1">Changes publish to the shared resource library and require Supabase admin access.</p>}
        </div>

        <Button size="sm" variant="accent" onClick={openAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Article
        </Button>
      </div>

      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

      <Card className="p-0 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Author</th>
                <th className="px-6 py-3.5">Read Time</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-sm truncate">
                    {res.title}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="green" size="sm">{res.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {res.author}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {res.readTime}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(res)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRes ? 'Edit Resource' : 'Add New Resource'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Article Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none"
              >
                <option value="Industrial Attachment">Industrial Attachment</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="CV & Portfolio">CV & Portfolio</option>
                <option value="Career Guide">Career Guide</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Scholarships">Scholarships</option>
              </select>
            </div>

            <Input
              label="Author Name"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <Textarea
            label="Short Summary"
            rows={2}
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <Textarea
            label="Article Markdown Content"
            rows={6}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRes ? 'Save Changes' : 'Publish Resource'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

