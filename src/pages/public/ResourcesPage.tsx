import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Tag, ArrowRight, Sparkles, X, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getCareerResources } from '../../lib/resources';
import { isDevelopmentDemoMode, isSupabaseConfigured } from '../../lib/supabase';
import { CareerResource } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Footer } from '../../components/layout/Footer';

export const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<CareerResource | null>(null);
  const [allResources, setAllResources] = useState<CareerResource[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    getCareerResources().then((items) => { if (active) setAllResources(items); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => { setSearchQuery(searchParams.get('q') || ''); }, [searchParams]);

  const categories = ['All', 'Industrial Attachment', 'Interview Prep', 'CV & Portfolio', 'Scholarships', 'Freelancing'];

  const filteredResources = allResources.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const needle = searchQuery.trim().toLowerCase();
    const matchesSearch = !needle || [resource.title, resource.summary, resource.category, ...resource.tags].some((value) => value.toLowerCase().includes(needle));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 border border-brand-green-200 dark:border-brand-green-800 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learning & Career Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            African Career Guides & Playbooks
          </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Practical career guides and learning resources published by CareerLaunch.
          </p>
        </div>
        <label className="flex max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search learning resources</span>
          <input value={searchQuery} onChange={(event) => { const value = event.target.value; setSearchQuery(value); const next = new URLSearchParams(searchParams); if (value.trim()) next.set('q', value); else next.delete('q'); setSearchParams(next, { replace: true }); }} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search guides, topics, or tags" />
        </label>
        {isDevelopmentDemoMode && <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3">Preview library: sample guide content is for local demonstration. Published production guides load from Supabase.</p>}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadError && <p role="alert" className="text-sm text-rose-600">We couldn't load resources. Please try again later.</p>}
          {!loadError && isSupabaseConfigured && allResources.length === 0 && <p className="text-sm text-slate-500">No published career guides are available yet.</p>}
          {!loadError && !isSupabaseConfigured && !isDevelopmentDemoMode && <p role="alert" className="text-sm text-rose-600">Career guides are temporarily unavailable because this site is not connected to its database.</p>}
          {filteredResources.map((res) => (
            <Card
              key={res.id}
              hoverEffect
              onClick={() => setActiveArticle(res)}
              className="cursor-pointer flex flex-col justify-between p-6 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="green" size="sm">{res.category}</Badge>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {res.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400 transition-colors mb-2">
                  {res.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {res.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {res.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{res.author}</span>
                <span className="font-bold text-brand-blue-700 dark:text-brand-green-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <Modal
          isOpen={Boolean(activeArticle)}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          subtitle={`By ${activeArticle.author} • ${activeArticle.readTime}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="green">{activeArticle.category}</Badge>
              {activeArticle.tags.map((t, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  #{t}
                </span>
              ))}
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
              {activeArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setActiveArticle(null)}>
                Close Guide
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

