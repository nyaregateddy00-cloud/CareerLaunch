import React, { useState } from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Award,
  Languages,
  Plus,
  Trash2,
  Wand2
} from 'lucide-react';
import { CVData, Experience, Education, UserSkill, Project, Certification, Language } from '../../types';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';

interface CVEditorProps {
  cvData: CVData;
  onChange: (updated: CVData) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({ cvData, onChange }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'languages'>('personal');
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    onChange({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleEnhanceSummary = () => {
    setIsEnhancingSummary(true);
    setTimeout(() => {
      onChange({
        ...cvData,
        summary: `${cvData.personalInfo.headline || 'High-performing professional'} with proven technical proficiency in modern web frameworks, distributed architectures, and API integrations. Dedicated to building reliable digital infrastructure for African enterprises with strong problem-solving agility, clean code hygiene, and cross-functional leadership.`,
      });
      setIsEnhancingSummary(false);
    }, 500);
  };

  // --- Experience helpers ---
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      userId: '',
      company: 'New Company Ltd',
      position: 'Role / Title',
      employmentType: 'Full-time',
      location: 'Nairobi, Kenya',
      startDate: new Date().toISOString().split('T')[0],
      isCurrent: true,
      description: 'Key accomplishments, systems built, and measurable impact achieved.',
    };
    onChange({ ...cvData, experience: [newExp, ...cvData.experience] });
  };

  const updateExperience = (idx: number, updates: Partial<Experience>) => {
    const updated = [...cvData.experience];
    updated[idx] = { ...updated[idx], ...updates };
    onChange({ ...cvData, experience: updated });
  };

  const deleteExperience = (idx: number) => {
    onChange({ ...cvData, experience: cvData.experience.filter((_, i) => i !== idx) });
  };

  // --- Education helpers ---
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      userId: '',
      institution: 'University / Institute Name',
      degree: 'Degree / Diploma',
      fieldOfStudy: 'Field of Study',
      startDate: '2022-09-01',
      endDate: '2026-07-01',
      isCurrent: false,
      grade: 'Second Class Upper / Distinction',
    };
    onChange({ ...cvData, education: [newEdu, ...cvData.education] });
  };

  const updateEducation = (idx: number, updates: Partial<Education>) => {
    const updated = [...cvData.education];
    updated[idx] = { ...updated[idx], ...updates };
    onChange({ ...cvData, education: updated });
  };

  const deleteEducation = (idx: number) => {
    onChange({ ...cvData, education: cvData.education.filter((_, i) => i !== idx) });
  };

  // --- Project helpers ---
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      userId: '',
      title: 'New Featured Project',
      description: 'Describe the core problem solved, architecture used, and results.',
      tags: ['React', 'TypeScript'],
      isFeatured: true,
    };
    onChange({ ...cvData, projects: [newProj, ...cvData.projects] });
  };

  const updateProject = (idx: number, updates: Partial<Project>) => {
    const updated = [...cvData.projects];
    updated[idx] = { ...updated[idx], ...updates };
    onChange({ ...cvData, projects: updated });
  };

  const deleteProject = (idx: number) => {
    onChange({ ...cvData, projects: cvData.projects.filter((_, i) => i !== idx) });
  };

  // --- Skill helpers ---
  const addSkill = () => {
    const newSkill: UserSkill = {
      id: `sk-${Date.now()}`,
      userId: '',
      skillName: 'New Skill',
      category: 'Technical',
      proficiencyLevel: 'Intermediate',
      yearsOfExperience: 1,
    };
    onChange({ ...cvData, skills: [...cvData.skills, newSkill] });
  };

  const updateSkill = (idx: number, updates: Partial<UserSkill>) => {
    const updated = [...cvData.skills];
    updated[idx] = { ...updated[idx], ...updates };
    onChange({ ...cvData, skills: updated });
  };

  const deleteSkill = (idx: number) => {
    onChange({ ...cvData, skills: cvData.skills.filter((_, i) => i !== idx) });
  };

  // --- Language helpers ---
  const addLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: 'English',
      proficiency: 'Fluent',
    };
    onChange({ ...cvData, languages: [...(cvData.languages || []), newLang] });
  };

  const updateLanguage = (idx: number, updates: Partial<Language>) => {
    const list = [...(cvData.languages || [])];
    list[idx] = { ...list[idx], ...updates };
    onChange({ ...cvData, languages: list });
  };

  const deleteLanguage = (idx: number) => {
    onChange({
      ...cvData,
      languages: (cvData.languages || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden flex flex-col h-full">
      {/* Tab bar navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 overflow-x-auto scrollbar-none px-2 pt-2 gap-1">
        {[
          { id: 'personal', label: 'Personal', icon: User },
          { id: 'summary', label: 'Summary', icon: FileText },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'skills', label: 'Skills', icon: Sparkles },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'languages', label: 'Languages', icon: Languages },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-brand-blue-900 dark:text-brand-green-400 -mb-[1px]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Personal Details */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Header Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                value={cvData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={cvData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone"
                value={cvData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              />
              <Input
                label="Location (City, Country)"
                value={cvData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
              />
            </div>
            <Input
              label="Professional Headline"
              placeholder="e.g. Full-Stack Engineer | React & Node.js Specialist"
              value={cvData.personalInfo.headline}
              onChange={(e) => updatePersonalInfo('headline', e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="LinkedIn Profile"
                placeholder="linkedin.com/in/..."
                value={cvData.personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              />
              <Input
                label="GitHub Profile"
                placeholder="github.com/..."
                value={cvData.personalInfo.github || ''}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
              />
              <Input
                label="Portfolio URL"
                placeholder="careerlaunch.co.ke/u/..."
                value={cvData.personalInfo.website || ''}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Professional Bio & Summary
              </h4>
              <Button
                size="sm"
                variant="accent"
                onClick={handleEnhanceSummary}
                isLoading={isEnhancingSummary}
                leftIcon={<Wand2 className="w-3.5 h-3.5" />}
              >
                AI Enhance Summary
              </Button>
            </div>
            <Textarea
              rows={6}
              placeholder="Provide a concise 3-4 sentence summary of your background, core technical strengths, and what value you bring to an employer..."
              value={cvData.summary}
              onChange={(e) => onChange({ ...cvData, summary: e.target.value })}
            />
          </div>
        )}

        {/* Work Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Work Experience & Attachments
              </h4>
              <Button size="sm" variant="secondary" onClick={addExperience} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Position
              </Button>
            </div>

            {cvData.experience.map((exp, idx) => (
              <div key={exp.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-blue-700 dark:text-brand-blue-400">Role #{idx + 1}</span>
                  <button onClick={() => deleteExperience(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Position / Title"
                    value={exp.position}
                    onChange={(e) => updateExperience(idx, { position: e.target.value })}
                  />
                  <Input
                    label="Company / Organization"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, { company: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Start Date"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, { startDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    disabled={exp.isCurrent}
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(idx, { endDate: e.target.value })}
                  />
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id={`curr-${idx}`}
                      checked={exp.isCurrent}
                      onChange={(e) => updateExperience(idx, { isCurrent: e.target.checked })}
                      className="rounded text-brand-blue-600 focus:ring-brand-blue-500"
                    />
                    <label htmlFor={`curr-${idx}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Currently working here
                    </label>
                  </div>
                </div>
                <Textarea
                  label="Description / Impact Achievements"
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, { description: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Education & Training
              </h4>
              <Button size="sm" variant="secondary" onClick={addEducation} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Education
              </Button>
            </div>

            {cvData.education.map((edu, idx) => (
              <div key={edu.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-blue-700 dark:text-brand-blue-400">Education #{idx + 1}</span>
                  <button onClick={() => deleteEducation(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  label="Institution"
                  placeholder="e.g. University of Nairobi, Strathmore, JKUAT"
                  value={edu.institution}
                  onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Degree / Qualification"
                    placeholder="e.g. Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                  />
                  <Input
                    label="Field of Study"
                    placeholder="e.g. Computer Science"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(idx, { fieldOfStudy: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Graduation Year / Period"
                    placeholder="e.g. 2022 - 2026"
                    value={`${edu.startDate ? edu.startDate.substring(0, 4) : ''} - ${edu.endDate ? edu.endDate.substring(0, 4) : 'Present'}`}
                    onChange={(e) => updateEducation(idx, { grade: e.target.value })}
                  />
                  <Input
                    label="Honours / Grade"
                    placeholder="e.g. First Class Honours"
                    value={edu.grade || ''}
                    onChange={(e) => updateEducation(idx, { grade: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills on CV
              </h4>
              <Button size="sm" variant="secondary" onClick={addSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Skill
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cvData.skills.map((skill, idx) => (
                <div key={skill.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={skill.skillName}
                    onChange={(e) => updateSkill(idx, { skillName: e.target.value })}
                    className="flex-1 text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                  <select
                    value={skill.proficiencyLevel}
                    onChange={(e) => updateSkill(idx, { proficiencyLevel: e.target.value as any })}
                    className="text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button onClick={() => deleteSkill(idx)} className="text-rose-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Highlighted Projects
              </h4>
              <Button size="sm" variant="secondary" onClick={addProject} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Project
              </Button>
            </div>

            {cvData.projects.map((proj, idx) => (
              <div key={proj.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-blue-700 dark:text-brand-blue-400">Project #{idx + 1}</span>
                  <button onClick={() => deleteProject(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  label="Project Title"
                  value={proj.title}
                  onChange={(e) => updateProject(idx, { title: e.target.value })}
                />
                <Textarea
                  label="Description / Architecture"
                  rows={2}
                  value={proj.description}
                  onChange={(e) => updateProject(idx, { description: e.target.value })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Live Demo Link"
                    placeholder="https://..."
                    value={proj.link || ''}
                    onChange={(e) => updateProject(idx, { link: e.target.value })}
                  />
                  <Input
                    label="GitHub Link"
                    placeholder="https://github.com/..."
                    value={proj.githubLink || ''}
                    onChange={(e) => updateProject(idx, { githubLink: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {activeTab === 'languages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Spoken & Written Languages
              </h4>
              <Button size="sm" variant="secondary" onClick={addLanguage} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Language
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(cvData.languages || []).map((lang, idx) => (
                <div
                  key={lang.id || idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/50"
                >
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(idx, { name: e.target.value })}
                    className="flex-1 text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200"
                    placeholder="Language name"
                  />
                  <select
                    value={lang.proficiency}
                    onChange={(e) =>
                      updateLanguage(idx, { proficiency: e.target.value as Language['proficiency'] })
                    }
                    className="text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button
                    onClick={() => deleteLanguage(idx)}
                    className="text-rose-400 hover:text-rose-600 p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

