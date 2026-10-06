import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ExternalLink,
  Save,
  CheckCircle2,
  Copy,
  Eye,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Palette
} from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { useAuth } from '../../context/AuthContext';
import { PortfolioConfig, PortfolioTheme } from '../../types';
import { savePortfolioConfig } from '../../lib/portfolio';
import { Card } from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { fireCelebrationConfetti } from '../../lib/utils';

export const PortfolioBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioConfig>(() => mockStorage.getPortfolio());
  const [copied, setCopied] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const projects = mockStorage.getProjects().filter((project) => project.userId === user?.id);

  const publicUrl = `/u/${portfolio.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${publicUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveError('');
    try {
      await savePortfolioConfig(portfolio);
      setSavedAlert(true);
      fireCelebrationConfetti();
      setTimeout(() => setSavedAlert(false), 2500);
    } catch {
      setSaveError('Portfolio could not be saved. Check your connection, slug availability, and account access.');
    } finally { setSaving(false); }
  };

  const themes: { id: PortfolioTheme; label: string; previewColor: string }[] = [
    { id: 'modern-navy', label: 'Modern Navy & White', previewColor: 'bg-brand-blue-900' },
    { id: 'emerald-minimal', label: 'Emerald Minimalist', previewColor: 'bg-brand-green-500' },
    { id: 'dark-tech', label: 'Dark Tech Cyber', previewColor: 'bg-slate-900' },
    { id: 'creative-clean', label: 'Creative Clean', previewColor: 'bg-purple-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-brand-green-500" />
            Public Portfolio Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Preview and share your portfolio at <span className="font-semibold text-brand-blue-700 dark:text-brand-green-400">{window.location.origin}{publicUrl}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={publicUrl} target="_blank">
            <Button size="sm" variant="secondary" rightIcon={<ExternalLink className="w-4 h-4" />}>
              View Live Page
            </Button>
          </Link>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Portfolio settings saved. {portfolio.isPublished ? 'Your selected sections are public.' : 'Your portfolio remains private.'}
        </div>
      )}

      {/* Shareable Link Banner Card */}
      <Card className="p-6 bg-gradient-to-r from-brand-blue-900 to-brand-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green-400">
            Your Portfolio URL
          </span>
          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
            {window.location.origin}{publicUrl}
          </div>
          <p className="text-xs text-brand-blue-200 mt-1">
            Only sections you select below are shown publicly.
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
      </Card>

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
                  className="rounded text-brand-green-500 focus:ring-brand-green-500"
                />
                <label htmlFor="pub" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Published & publicly accessible
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            Publishing shares only the sections you select. Do not include confidential, sensitive, or third-party information.
          </div>

          <fieldset className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <legend className="px-1 text-xs font-bold text-slate-800 dark:text-white">Choose public sections</legend>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              {([
                ['photo', 'Profile photo'], ['headline', 'Headline'], ['bio', 'About summary'], ['projects', 'Featured projects'], ['experience', 'Work experience'], ['education', 'Education'],
                ['skills', 'Skills'], ['socialLinks', 'Social links'], ['location', 'Location'], ['email', 'Email contact'],
              ] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={Boolean(portfolio.publicSections?.[key])} onChange={(event) => setPortfolio({ ...portfolio, publicSections: { photo: false, headline: false, bio: false, projects: false, experience: false, education: false, skills: false, socialLinks: false, location: false, email: false, ...portfolio.publicSections, [key]: event.target.checked } })} />
                {label}
              </label>)}
            </div>
          </fieldset>

          {portfolio.publicSections?.projects && <fieldset className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <legend className="px-1 text-xs font-bold text-slate-800 dark:text-white">Choose projects to display</legend>
            {projects.length ? <div className="space-y-2 pt-2">{projects.map((project) => <label key={project.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"><input type="checkbox" checked={portfolio.featuredProjectIds.includes(project.id)} onChange={(event) => setPortfolio({ ...portfolio, featuredProjectIds: event.target.checked ? [...portfolio.featuredProjectIds, project.id] : portfolio.featuredProjectIds.filter((id) => id !== project.id) })} />{project.title}</label>)}</div> : <p className="pt-2 text-xs text-slate-500">Add projects to your profile before featuring them here.</p>}
          </fieldset>}

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
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                    portfolio.theme === t.id
                      ? 'border-brand-green-500 ring-2 ring-brand-green-500/20 bg-brand-green-50/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${t.previewColor}`} />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{t.label}</span>
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
            placeholder="Tell your story, your tech passion, and the kind of problems you love solving..."
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
          {portfolio.publicSections?.email && <Input label="Public contact email" type="email" value={portfolio.socialLinks.email || ''} onChange={(e) => setPortfolio({ ...portfolio, socialLinks: { ...portfolio.socialLinks, email: e.target.value } })} />}

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" size="md" disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
              {saving ? 'Saving…' : 'Save portfolio settings'}
            </Button>
          </div>
        </form>
      </Card>
      {saveError && <p role="alert" className="text-sm text-rose-600">{saveError}</p>}
    </div>
  );
};

