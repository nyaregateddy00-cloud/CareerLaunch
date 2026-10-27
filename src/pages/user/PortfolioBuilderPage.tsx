import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Copy,
  CheckCircle2,
  Save,
  Palette,
  Github,
  Linkedin,
  Eye,
} from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { PublicPortfolio, PortfolioTheme } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';

export const PortfolioBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [portfolio, setPortfolio] = useState<PublicPortfolio>(() => mockStorage.getPortfolio());
  const [copied, setCopied] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  const publicUrl = `/u/${portfolio.slug}`;

  const handleCopyLink = () => {
    const full = `${window.location.origin}${publicUrl}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    showToast('Public portfolio link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockStorage.savePortfolio(portfolio);
    setSavedAlert(true);
    showToast('Portfolio settings saved successfully', 'success');
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const themes: { id: PortfolioTheme; label: string; previewColor: string }[] = [
    { id: 'modern-navy', label: 'Modern Navy & White', previewColor: 'bg-brand-blue-900' },
    { id: 'emerald-minimal', label: 'Emerald Minimalist', previewColor: 'bg-brand-green-500' },
    { id: 'dark-tech', label: 'Dark Tech Cyber', previewColor: 'bg-slate-900' },
    { id: 'creative-clean', label: 'Creative Clean', previewColor: 'bg-brand-blue-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900 dark:text-[#f8fafc]">
      <PageHeader
        title="Public Portfolio Builder"
        subtitle={`Configure and preview your live public portfolio at ${window.location.origin}${publicUrl}`}
        breadcrumbs={[{ label: 'Portfolio Builder' }]}
        badge={
          <Badge variant={portfolio.isPublished ? 'green' : 'amber'} size="sm">
            {portfolio.isPublished ? 'Published' : 'Draft Mode'}
          </Badge>
        }
        action={
          <Link to={publicUrl} target="_blank">
            <Button size="sm" variant="secondary" rightIcon={<ExternalLink className="w-4 h-4" />}>
              View Live Page
            </Button>
          </Link>
        }
      />

      {savedAlert && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Portfolio published and updated successfully.
        </div>
      )}

      {/* Shareable Link Banner Card */}
      <div className="p-6 rounded-xl bg-brand-blue-900 dark:bg-[#0c1a30] text-white border border-brand-blue-800 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green-400">
            Your Live Portfolio Link
          </span>
          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
            {window.location.origin}{publicUrl}
          </div>
          <p className="text-xs text-brand-blue-100 dark:text-slate-300 mt-1">
            Total Recruiter Views: <span className="font-bold text-white">{portfolio.viewCount}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" variant="accent" onClick={handleCopyLink} leftIcon={<Copy className="w-3.5 h-3.5" />}>
            {copied ? 'Link Copied!' : 'Copy Link'}
          </Button>
          <Link to={publicUrl} target="_blank">
            <Button size="sm" variant="secondary" leftIcon={<Eye className="w-3.5 h-3.5" />}>
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Form Settings */}
      <Card className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vanity URL Slug"
              value={portfolio.slug}
              onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              helperText={`Your page will be reachable at /u/${portfolio.slug}`}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Visibility Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={portfolio.isPublished}
                  onChange={(e) => setPortfolio({ ...portfolio, isPublished: e.target.checked })}
                  className="rounded text-brand-green-600 focus:ring-brand-green-500"
                />
                <label htmlFor="pub" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Published &amp; Accessible to Recruiters
                </label>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Portfolio Design Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setPortfolio({ ...portfolio, theme: t.id })}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between h-20 transition-all ${
                    portfolio.theme === t.id
                      ? 'border-brand-green-500 ring-2 ring-brand-green-500/20 bg-brand-green-50/50 dark:bg-brand-green-950/40 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-white dark:bg-[#111111]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${t.previewColor}`} />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Hero Tagline / Headline"
            value={portfolio.headline}
            onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })}
            placeholder="e.g. Full-Stack Developer crafting reliable digital products for the African continent"
          />

          <Textarea
            label="About / Bio Summary"
            rows={4}
            value={portfolio.bio}
            onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
            placeholder="Tell your story, your technical background, and the types of problems you enjoy solving..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Handle or Link"
              value={portfolio.socialLinks.github || ''}
              onChange={(e) => setPortfolio({
                ...portfolio,
                socialLinks: { ...portfolio.socialLinks, github: e.target.value }
              })}
              leftIcon={<Github className="w-4 h-4" />}
            />
            <Input
              label="LinkedIn Handle or Link"
              value={portfolio.socialLinks.linkedin || ''}
              onChange={(e) => setPortfolio({
                ...portfolio,
                socialLinks: { ...portfolio.socialLinks, linkedin: e.target.value }
              })}
              leftIcon={<Linkedin className="w-4 h-4" />}
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/[0.08]">
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save &amp; Publish Portfolio
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
