import React, { useState } from 'react';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { CareerResource } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Footer } from '../../components/layout/Footer';

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<CareerResource | null>(null);

  const allResources = mockStorage.getResources();
  const categories = ['All', 'Industrial Attachment', 'Interview Prep', 'CV & Portfolio', 'Scholarships', 'Freelancing'];

  const filteredResources = allResources.filter(r =>
    selectedCategory === 'All' ? true : r.category === selectedCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-50 dark:bg-brand-green-950/60 text-brand-green-800 dark:text-brand-green-300 border border-brand-green-200 dark:border-brand-green-800/60 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning &amp; Playbooks</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            African Career Guides &amp; Playbooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Practical strategies written specifically for Kenyan and African university students, graduates, and early-career professionals.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/[0.08]'
              }`}
            >{cat}</button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <Card key={res.id} hoverEffect onClick={() => setActiveArticle(res)} className="cursor-pointer flex flex-col justify-between p-6 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="green" size="sm">{res.category}</Badge>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />{res.readTime}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-700 dark:group-hover:text-brand-green-400 transition-colors mb-2">{res.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">{res.summary}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {res.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 font-medium">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{res.author}</span>
                <span className="font-semibold text-brand-blue-700 dark:text-brand-green-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <Modal isOpen={Boolean(activeArticle)} onClose={() => setActiveArticle(null)} title={activeArticle.title} subtitle={`By ${activeArticle.author} • ${activeArticle.readTime}`} maxWidth="2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="green">{activeArticle.category}</Badge>
              {activeArticle.tags.map((t, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-500">#{t}</span>
              ))}
            </div>
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
              {activeArticle.content}
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setActiveArticle(null)}>Close Guide</Button>
            </div>
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
};
