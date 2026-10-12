import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  Tag,
  ArrowRight,
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { mockStorage } from '../../lib/mockStorage';
import { CareerResource } from '../../types';
import { useToast } from '../../hooks/useToast';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const LearningPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<CareerResource | null>(null);
  const [savedResourceIds, setSavedResourceIds] = useLocalStorage<string[]>(
    'careerlaunch_saved_resources',
    []
  );
  const [completedResourceIds, setCompletedResourceIds] = useLocalStorage<string[]>(
    'careerlaunch_completed_resources',
    []
  );

  const allResources = mockStorage.getResources();

  const categories = [
    'All',
    'Industrial Attachment',
    'Interview Prep',
    'CV & Portfolio',
    'Scholarships',
    'Freelancing',
    'Career Skills',
    'Technology',
  ];

  const filteredResources = useMemo(() => {
    return allResources.filter((res) => {
      const matchesCategory =
        selectedCategory === 'All' ? true : res.category === selectedCategory;
      const matchesSearch =
        searchQuery === ''
          ? true
          : res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allResources, selectedCategory, searchQuery]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = savedResourceIds.includes(id);
    if (isSaved) {
      setSavedResourceIds((prev) => prev.filter((item) => item !== id));
      showToast('Removed from reading list', 'info');
    } else {
      setSavedResourceIds((prev) => [...prev, id]);
      showToast('Saved to reading list', 'success');
    }
  };

  const toggleCompleted = (id: string) => {
    const isCompleted = completedResourceIds.includes(id);
    if (isCompleted) {
      setCompletedResourceIds((prev) => prev.filter((item) => item !== id));
      showToast('Marked as unread', 'info');
    } else {
      setCompletedResourceIds((prev) => [...prev, id]);
      showToast('Completed reading! Great job.', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning & Resources"
        subtitle="Curated African career playbooks, interview preparation roadmaps, and attachment guides."
        breadcrumbs={[{ label: 'Learning & Resources' }]}
        badge={
          <Badge variant="accent" size="sm">
            {allResources.length} Guides Available
          </Badge>
        }
      />

      {/* Featured Learning Highlight Card */}
      <div className="bg-gradient-to-r from-brand-blue-900 to-brand-blue-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-green-400" />
            <span>Recommended for Kenyan Students & Job Seekers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            The Comprehensive Kenyan Industrial Attachment Guide (2026)
          </h2>
          <p className="text-sm text-slate-200">
            How to secure attachments at Safaricom, Equity Group, Twiga, and government ministries.
            Covers NITA requirements, insurance letters, and cold email templates.
          </p>
        </div>
        <Button
          variant="accent"
          size="md"
          className="shrink-0"
          onClick={() => {
            const featured = allResources.find((r) => r.isFeatured) || allResources[0];
            if (featured) setActiveArticle(featured);
          }}
        >
          Read Playbook
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides, topics (e.g. CV, interview, M-Pesa, freelance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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

      {/* Articles Grid */}
      {filteredResources.length === 0 ? (
        <EmptyState
          title="No guides found"
          description="Try adjusting your search query or selecting a different category."
          icon={<BookOpen className="w-10 h-10 text-slate-400" />}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const isSaved = savedResourceIds.includes(res.id);
            const isCompleted = completedResourceIds.includes(res.id);

            return (
              <Card
                key={res.id}
                hoverEffect
                onClick={() => setActiveArticle(res)}
                className="flex flex-col justify-between cursor-pointer border border-slate-200/80 dark:border-slate-800 transition-all hover:border-brand-blue-500/40 relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="blue" size="sm">
                      {res.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs text-brand-green-600 dark:text-brand-green-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Read
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleSave(res.id, e)}
                        className={`p-1 rounded-lg transition-colors ${
                          isSaved
                            ? 'text-brand-green-600 dark:text-brand-green-400 bg-brand-green-50 dark:bg-brand-green-950/50'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title={isSaved ? 'Saved to reading list' : 'Save to reading list'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-900 dark:group-hover:text-brand-blue-400 transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {res.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {res.readTime}
                    </span>
                    <span>By {res.author}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {res.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      {activeArticle && (
        <Modal
          isOpen={Boolean(activeArticle)}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  {activeArticle.category}
                </Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}
                </span>
                <span>•</span>
                <span>By {activeArticle.author}</span>
              </div>
              <Button
                variant={completedResourceIds.includes(activeArticle.id) ? 'outline' : 'accent'}
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => toggleCompleted(activeArticle.id)}
              >
                {completedResourceIds.includes(activeArticle.id)
                  ? 'Completed'
                  : 'Mark as Finished'}
              </Button>
            </div>

            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 whitespace-pre-line font-normal">
              {activeArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setActiveArticle(null)}>
                Close Article
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
