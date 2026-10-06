import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Languages,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../lib/mockStorage';
import {
  Experience,
  Education,
  Project,
  Certification,
  UserSkill,
  Language,
} from '../../types';
import { Card } from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { useToast } from '../../hooks/useToast';
import { formatMonthYear, fireCelebrationConfetti, safeExternalUrl } from '../../lib/utils';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  // Basic Profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(user?.twitterUrl || '');

  // Sub-entities state
  const [experience, setExperience] = useState<Experience[]>(() => mockStorage.getExperience());
  const [education, setEducation] = useState<Education[]>(() => mockStorage.getEducation());
  const [projects, setProjects] = useState<Project[]>(() => mockStorage.getProjects());
  const [certifications, setCertifications] = useState<Certification[]>(() => mockStorage.getCertifications());
  const [skills, setSkills] = useState<UserSkill[]>(() => mockStorage.getUserSkills());
  const [languages, setLanguages] = useState<Language[]>(() => mockStorage.getLanguages());
  const loadedUserId = useRef(user?.id);

  // Language input state
  const [newLangName, setNewLangName] = useState('');
  const [newLangProficiency, setNewLangProficiency] = useState<Language['proficiency']>('Fluent');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setHeadline(user.headline);
      setBio(user.bio);
      setLocation(user.location);
      setPhone(user.phone || '');
      setWebsiteUrl(user.websiteUrl || '');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setTwitterUrl(user.twitterUrl || '');
    }
  }, [user]);

  useEffect(() => {
    if (!user || loadedUserId.current === user.id) return;
    loadedUserId.current = user.id;
    setExperience(mockStorage.getExperience());
    setEducation(mockStorage.getEducation());
    setProjects(mockStorage.getProjects());
    setCertifications(mockStorage.getCertifications());
    setSkills(mockStorage.getUserSkills());
    setLanguages(mockStorage.getLanguages());
  }, [user?.id]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      headline,
      bio,
      location,
      phone,
      websiteUrl,
      githubUrl,
      linkedinUrl,
      twitterUrl,
    });
    fireCelebrationConfetti();
    showToast('Profile information saved successfully!', 'success');
  };

  // --- Experience helpers ---
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      userId: user?.id || '',
      company: 'Safaricom / FinTech Partner',
      position: 'Junior Software Engineer',
      employmentType: 'Full-time',
      location: 'Nairobi, Kenya',
      startDate: '2026-01-10',
      isCurrent: true,
      description: 'Built scalable backend microservices and payment webhook integration.',
    };
    mockStorage.saveExperience(newExp);
    setExperience(mockStorage.getExperience());
    showToast('New experience entry added', 'success');
  };

  const handleDeleteExperience = (id: string) => {
    mockStorage.deleteExperience(id);
    setExperience(mockStorage.getExperience());
    showToast('Experience entry removed', 'info');
  };

  // --- Education helpers ---
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      userId: user?.id || '',
      institution: 'University of Nairobi',
      degree: 'BSc',
      fieldOfStudy: 'Computer Science',
      startDate: '2022-09-01',
      endDate: '2026-11-30',
      isCurrent: true,
      grade: 'First Class Honours (Expected)',
      description: 'Specialization in Distributed Systems and Software Engineering.',
    };
    mockStorage.saveEducation(newEdu);
    setEducation(mockStorage.getEducation());
    showToast('New education entry added', 'success');
  };

  const handleDeleteEducation = (id: string) => {
    mockStorage.deleteEducation(id);
    setEducation(mockStorage.getEducation());
    showToast('Education entry removed', 'info');
  };

  // --- Projects helpers ---
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      userId: user?.id || '',
      title: 'M-Pesa Webhook Reconciler',
      description: 'Idempotent microservice validating HMAC signatures and storing payment receipts.',
      tags: ['TypeScript', 'Express', 'Redis', 'M-Pesa'],
      link: 'https://github.com',
      isFeatured: false,
    };
    mockStorage.saveProject(newProj);
    setProjects(mockStorage.getProjects());
    showToast('New project added', 'success');
  };

  const handleDeleteProject = (id: string) => {
    mockStorage.deleteProject(id);
    setProjects(mockStorage.getProjects());
    showToast('Project removed', 'info');
  };

  // --- Language helpers ---
  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;

    const newLang: Language = {
      id: `lang-${Date.now()}`,
      userId: user?.id || '',
      name: newLangName.trim(),
      proficiency: newLangProficiency,
    };

    mockStorage.saveLanguage(newLang);
    setLanguages(mockStorage.getLanguages());
    setNewLangName('');
    showToast(`Added language: ${newLang.name}`, 'success');
  };

  const handleDeleteLanguage = (id: string) => {
    mockStorage.deleteLanguage(id);
    setLanguages(mockStorage.getLanguages());
    showToast('Language removed', 'info');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile & Professional Identity"
        subtitle="Manage your personal background, education, work experience, proof of work, and languages."
        breadcrumbs={[{ label: 'Profile' }]}
        badge={
          <Badge variant="blue" size="sm">
            {user?.role === 'student' ? 'Student Profile' : 'Professional Profile'}
          </Badge>
        }
      />

      {/* Avatar and Overview Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
              }
              alt={user?.fullName || 'User Profile'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <button
              onClick={() =>
                showToast('Photo upload connects to Supabase Storage when configured.', 'info')
              }
              className="absolute inset-0 bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change Photo"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Change</span>
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {fullName || 'Your Name'}
            </h2>
            <p className="text-sm font-medium text-brand-blue-700 dark:text-brand-blue-400">
              {headline || 'Professional Headline'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location || 'Location'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </span>
              {phone && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {phone}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Personal Information Form */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-xs text-slate-500">Your core contact information and career bio</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Professional Headline"
              placeholder="e.g. Junior Full-Stack Engineer | React & Node.js"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g. Nairobi, Kenya"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              placeholder="+254 7..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Textarea
            label="Professional Bio / Career Summary"
            rows={3}
            placeholder="Tell recruiters about your background, projects, and career goals..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Professional Links & Socials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Portfolio / Website URL"
                placeholder="https://careerlaunch.co.ke/u/username"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
              />
              <Input
                label="GitHub URL"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                leftIcon={<Github className="w-4 h-4" />}
              />
              <Input
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                leftIcon={<Linkedin className="w-4 h-4" />}
              />
              <Input
                label="Twitter / X Link"
                placeholder="https://x.com/..."
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                leftIcon={<Twitter className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Basic Details
            </Button>
          </div>
        </form>
      </Card>

      {/* Languages Section */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Languages</h3>
              <p className="text-xs text-slate-500">
                Spoken and written language proficiencies (English, Swahili, French, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Add Language inline form */}
        <form onSubmit={handleAddLanguage} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Language"
              placeholder="e.g. English, Swahili, French"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Proficiency"
              value={newLangProficiency}
              onChange={(e) =>
                setNewLangProficiency(e.target.value as Language['proficiency'])
              }
              options={[
                { value: 'Native', label: 'Native' },
                { value: 'Fluent', label: 'Fluent' },
                { value: 'Conversational', label: 'Conversational' },
                { value: 'Basic', label: 'Basic' },
              ]}
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Language
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lang.name}</h4>
                <p className="text-xs font-semibold text-brand-green-600 dark:text-brand-green-400">
                  {lang.proficiency}
                </p>
              </div>
              <button
                onClick={() => handleDeleteLanguage(lang.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Work Experience Section */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Experience & Attachments
              </h3>
              <p className="text-xs text-slate-500">
                Corporate roles, internships, and industrial attachments
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddExperience}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Experience
          </Button>
        </div>

        <div className="space-y-4">
          {experience.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {exp.position}
                </h4>
                <p className="text-xs font-semibold text-brand-blue-700 dark:text-brand-blue-400">
                  {exp.company} • <span className="text-slate-500">{exp.location}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formatMonthYear(exp.startDate)} –{' '}
                  {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate)} ({exp.employmentType})
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
              <button
                onClick={() => handleDeleteExperience(exp.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Education & Bootcamp Training
              </h3>
              <p className="text-xs text-slate-500">Degree programs, TVET, and technical bootcamps</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddEducation}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Education
          </Button>
        </div>

        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {edu.degree} in {edu.fieldOfStudy}
                </h4>
                <p className="text-xs font-semibold text-brand-green-700 dark:text-brand-green-400">
                  {edu.institution} {edu.grade ? `• ${edu.grade}` : ''}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {edu.startDate ? edu.startDate.substring(0, 4) : ''} –{' '}
                  {edu.isCurrent ? 'Present' : edu.endDate ? edu.endDate.substring(0, 4) : ''}
                </p>
                {edu.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteEducation(edu.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects Section */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Projects & Proof of Work
              </h3>
              <p className="text-xs text-slate-500">Project details and links you choose to add</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddProject}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {proj.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              {safeExternalUrl(proj.link) && (
                <a
                  href={safeExternalUrl(proj.link)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline inline-flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
