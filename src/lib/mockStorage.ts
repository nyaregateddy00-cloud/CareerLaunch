import {
  UserProfile,
  Opportunity,
  JobApplication,
  UserSkill,
  Experience,
  Education,
  Project,
  Certification,
  CareerResource,
  AdminStats,
  PortfolioConfig,
  CVDocument,
  Notification,
  RoleSkillGap,
  Language
} from '../types';
import {
  INITIAL_USER_TEDDY,
  INITIAL_USER_AMINA,
  INITIAL_USER_ADMIN,
  INITIAL_SKILLS,
  INITIAL_EDUCATION,
  INITIAL_EXPERIENCE,
  INITIAL_PROJECTS,
  INITIAL_CERTIFICATIONS,
  INITIAL_LANGUAGES,
  INITIAL_PORTFOLIO,
  INITIAL_CV,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_SAVED_OPP_IDS,
  INITIAL_RESOURCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SKILL_GAPS,
  INITIAL_ADMIN_STATS
} from './mockData';
import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'careerlaunch_current_user',
  USERS: 'careerlaunch_users',
  OPPORTUNITIES: 'careerlaunch_opportunities',
  APPLICATIONS: 'careerlaunch_applications',
  SAVED_OPP_IDS: 'careerlaunch_saved_opp_ids',
  USER_SKILLS: 'careerlaunch_user_skills',
  EXPERIENCE: 'careerlaunch_experience',
  EDUCATION: 'careerlaunch_education',
  PROJECTS: 'careerlaunch_projects',
  CERTIFICATIONS: 'careerlaunch_certifications',
  LANGUAGES: 'careerlaunch_languages',
  PORTFOLIO: 'careerlaunch_portfolio',
  CV: 'careerlaunch_cv',
  RESOURCES: 'careerlaunch_resources',
  NOTIFICATIONS: 'careerlaunch_notifications',
  ADMIN_STATS: 'careerlaunch_admin_stats',
  THEME: 'careerlaunch_theme',
};

const CLOUD_WORKSPACE_KEYS = [
  STORAGE_KEYS.APPLICATIONS,
  STORAGE_KEYS.SAVED_OPP_IDS,
  STORAGE_KEYS.USER_SKILLS,
  STORAGE_KEYS.EXPERIENCE,
  STORAGE_KEYS.EDUCATION,
  STORAGE_KEYS.PROJECTS,
  STORAGE_KEYS.CERTIFICATIONS,
  STORAGE_KEYS.LANGUAGES,
  STORAGE_KEYS.PORTFOLIO,
  STORAGE_KEYS.CV,
  STORAGE_KEYS.NOTIFICATIONS,
];
const EMPTY_FOR_NEW_ACCOUNT = new Set([
  STORAGE_KEYS.APPLICATIONS,
  STORAGE_KEYS.SAVED_OPP_IDS,
  STORAGE_KEYS.USER_SKILLS,
  STORAGE_KEYS.EXPERIENCE,
  STORAGE_KEYS.EDUCATION,
  STORAGE_KEYS.PROJECTS,
  STORAGE_KEYS.CERTIFICATIONS,
  STORAGE_KEYS.LANGUAGES,
  STORAGE_KEYS.NOTIFICATIONS,
]);
let remoteUserId: string | null = null;
let hydratingWorkspace = false;
const storageKeyFor = (key: string, userId = remoteUserId) =>
  userId && CLOUD_WORKSPACE_KEYS.includes(key) ? `${key}:${userId}` : key;

function scheduleWorkspaceSave(userId: string): void {
  if (!isSupabaseConfigured || hydratingWorkspace) return;
  queueMicrotask(() => {
    const payload: Record<string, unknown> = {};
    for (const key of CLOUD_WORKSPACE_KEYS) {
      const raw = localStorage.getItem(storageKeyFor(key, userId));
      if (!raw) continue;
      try { payload[key] = JSON.parse(raw); } catch { /* Ignore corrupt browser cache entries. */ }
    }
    void supabase.from('workspace_snapshots').upsert({
      user_id: userId,
      payload,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' }).then(({ error }) => {
      if (error) window.dispatchEvent(new CustomEvent('careerlaunch_persistence_error', { detail: error.message }));
    });
  });
}

export function setRemoteWorkspaceUser(userId: string | null): void {
  remoteUserId = isSupabaseConfigured ? userId : null;
}

export async function restoreRemoteWorkspace(): Promise<void> {
  if (!isSupabaseConfigured || !remoteUserId) return;
  const currentUserId = remoteUserId;
  const { data, error } = await supabase
    .from('workspace_snapshots')
    .select('payload')
    .eq('user_id', currentUserId)
    .maybeSingle();
  if (error) throw error;
  hydratingWorkspace = true;
  try {
    const payload = data?.payload as Record<string, unknown> | undefined;
    for (const key of CLOUD_WORKSPACE_KEYS) {
      const value = payload?.[key];
      if (value !== undefined) localStorage.setItem(storageKeyFor(key, currentUserId), JSON.stringify(value));
    }
  } finally {
    hydratingWorkspace = false;
  }
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(storageKeyFor(key));
    if (item) return JSON.parse(item);
    if (remoteUserId && EMPTY_FOR_NEW_ACCOUNT.has(key)) return [] as T;
    if (remoteUserId && key === STORAGE_KEYS.CV) {
      const profile = getItem<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER_TEDDY);
      return {
        ...INITIAL_CV,
        id: `cv-${remoteUserId}`,
        userId: remoteUserId,
        title: `${profile.fullName} - CV`,
        content: {
          ...INITIAL_CV.content,
          personalInfo: { fullName: profile.fullName, email: profile.email, phone: profile.phone || '', location: profile.location, headline: profile.headline },
          summary: '', experience: [], education: [], skills: [], projects: [], certifications: [], languages: [],
        },
      } as T;
    }
    if (remoteUserId && key === STORAGE_KEYS.PORTFOLIO) {
      const profile = getItem<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER_TEDDY);
      return {
        ...INITIAL_PORTFOLIO,
        id: `portfolio-${remoteUserId}`,
        userId: remoteUserId,
        slug: `${profile.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${remoteUserId.slice(-6)}`,
        headline: profile.headline,
        bio: profile.bio,
        isPublished: false,
        socialLinks: { email: profile.email },
        featuredProjectIds: [],
        viewCount: 0,
      } as T;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(storageKeyFor(key), JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('careerlaunch_storage_change', { detail: { key } }));
    if (remoteUserId && CLOUD_WORKSPACE_KEYS.includes(key)) scheduleWorkspaceSave(remoteUserId);
  } catch (e) {
    console.error(`Error saving to localStorage key ${key}`, e);
  }
}

export const mockStorage = {
  // --- USERS & AUTH ---
  getCurrentUser(): UserProfile {
    return getItem<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER_TEDDY);
  },
  setCurrentUser(user: UserProfile): void {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },
  getAllUsers(): UserProfile[] {
    return getItem<UserProfile[]>(STORAGE_KEYS.USERS, [
      INITIAL_USER_TEDDY,
      INITIAL_USER_AMINA,
      INITIAL_USER_ADMIN,
    ]);
  },
  updateUser(updated: UserProfile): void {
    const users = this.getAllUsers().map(u => (u.id === updated.id ? updated : u));
    setItem(STORAGE_KEYS.USERS, users);
    const currentUser = this.getCurrentUser();
    if (currentUser.id === updated.id) {
      setItem(STORAGE_KEYS.CURRENT_USER, updated);
    }
  },

  // --- OPPORTUNITIES ---
  getOpportunities(): Opportunity[] {
    return getItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  },
  saveOpportunity(opp: Opportunity): void {
    const list = this.getOpportunities();
    const index = list.findIndex(o => o.id === opp.id);
    if (index >= 0) {
      list[index] = opp;
    } else {
      list.unshift(opp);
    }
    setItem(STORAGE_KEYS.OPPORTUNITIES, list);
  },
  deleteOpportunity(id: string): void {
    const list = this.getOpportunities().filter(o => o.id !== id);
    setItem(STORAGE_KEYS.OPPORTUNITIES, list);
  },

  // --- SAVED OPPORTUNITIES ---
  getSavedOpportunityIds(): string[] {
    return getItem<string[]>(STORAGE_KEYS.SAVED_OPP_IDS, INITIAL_SAVED_OPP_IDS);
  },
  toggleSaveOpportunity(oppId: string): boolean {
    const saved = this.getSavedOpportunityIds();
    const exists = saved.includes(oppId);
    let updated: string[];
    if (exists) {
      updated = saved.filter(id => id !== oppId);
    } else {
      updated = [...saved, oppId];
    }
    setItem(STORAGE_KEYS.SAVED_OPP_IDS, updated);
    return !exists;
  },

  // --- APPLICATIONS (KANBAN) ---
  getApplications(): JobApplication[] {
    return getItem<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },
  saveApplication(app: JobApplication): void {
    const list = this.getApplications();
    const index = list.findIndex(a => a.id === app.id);
    if (index >= 0) {
      list[index] = { ...app, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...app, updatedAt: new Date().toISOString() });
    }
    setItem(STORAGE_KEYS.APPLICATIONS, list);
  },
  updateApplicationStage(appId: string, stage: JobApplication['stage']): void {
    const list = this.getApplications().map(a =>
      a.id === appId ? { ...a, stage, updatedAt: new Date().toISOString() } : a
    );
    setItem(STORAGE_KEYS.APPLICATIONS, list);
  },
  deleteApplication(appId: string): void {
    const list = this.getApplications().filter(a => a.id !== appId);
    setItem(STORAGE_KEYS.APPLICATIONS, list);
  },

  // --- SKILLS ---
  getUserSkills(): UserSkill[] {
    return getItem<UserSkill[]>(STORAGE_KEYS.USER_SKILLS, INITIAL_SKILLS);
  },
  saveUserSkill(skill: UserSkill): void {
    const list = this.getUserSkills();
    const index = list.findIndex(s => s.id === skill.id || s.skillName.toLowerCase() === skill.skillName.toLowerCase());
    if (index >= 0) {
      list[index] = skill;
    } else {
      list.push(skill);
    }
    setItem(STORAGE_KEYS.USER_SKILLS, list);
  },
  deleteUserSkill(skillId: string): void {
    const list = this.getUserSkills().filter(s => s.id !== skillId);
    setItem(STORAGE_KEYS.USER_SKILLS, list);
  },
  getSkillGaps(): RoleSkillGap[] {
    return INITIAL_SKILL_GAPS;
  },

  // --- WORK EXPERIENCE ---
  getExperience(): Experience[] {
    return getItem<Experience[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
  },
  saveExperience(exp: Experience): void {
    const list = this.getExperience();
    const index = list.findIndex(e => e.id === exp.id);
    if (index >= 0) {
      list[index] = exp;
    } else {
      list.unshift(exp);
    }
    setItem(STORAGE_KEYS.EXPERIENCE, list);
  },
  deleteExperience(id: string): void {
    const list = this.getExperience().filter(e => e.id !== id);
    setItem(STORAGE_KEYS.EXPERIENCE, list);
  },

  // --- EDUCATION ---
  getEducation(): Education[] {
    return getItem<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
  },
  saveEducation(edu: Education): void {
    const list = this.getEducation();
    const index = list.findIndex(e => e.id === edu.id);
    if (index >= 0) {
      list[index] = edu;
    } else {
      list.unshift(edu);
    }
    setItem(STORAGE_KEYS.EDUCATION, list);
  },
  deleteEducation(id: string): void {
    const list = this.getEducation().filter(e => e.id !== id);
    setItem(STORAGE_KEYS.EDUCATION, list);
  },

  // --- PROJECTS ---
  getProjects(): Project[] {
    return getItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },
  saveProject(proj: Project): void {
    const list = this.getProjects();
    const index = list.findIndex(p => p.id === proj.id);
    if (index >= 0) {
      list[index] = proj;
    } else {
      list.unshift(proj);
    }
    setItem(STORAGE_KEYS.PROJECTS, list);
  },
  deleteProject(id: string): void {
    const list = this.getProjects().filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PROJECTS, list);
  },

  // --- CERTIFICATIONS ---
  getCertifications(): Certification[] {
    return getItem<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, INITIAL_CERTIFICATIONS);
  },
  saveCertification(cert: Certification): void {
    const list = this.getCertifications();
    const index = list.findIndex(c => c.id === cert.id);
    if (index >= 0) {
      list[index] = cert;
    } else {
      list.unshift(cert);
    }
    setItem(STORAGE_KEYS.CERTIFICATIONS, list);
  },
  deleteCertification(id: string): void {
    const list = this.getCertifications().filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CERTIFICATIONS, list);
  },

  // --- LANGUAGES ---
  getLanguages(): Language[] {
    return getItem<Language[]>(STORAGE_KEYS.LANGUAGES, INITIAL_LANGUAGES);
  },
  saveLanguage(lang: Language): void {
    const list = this.getLanguages();
    const index = list.findIndex(l => l.id === lang.id);
    if (index >= 0) {
      list[index] = lang;
    } else {
      list.push(lang);
    }
    setItem(STORAGE_KEYS.LANGUAGES, list);
  },
  deleteLanguage(id: string): void {
    const list = this.getLanguages().filter(l => l.id !== id);
    setItem(STORAGE_KEYS.LANGUAGES, list);
  },

  // --- CV DOCUMENT ---
  getCV(): CVDocument {
    return getItem<CVDocument>(STORAGE_KEYS.CV, INITIAL_CV);
  },
  saveCV(cv: CVDocument): void {
    setItem(STORAGE_KEYS.CV, { ...cv, updatedAt: new Date().toISOString() });
  },

  // --- PORTFOLIO CONFIG ---
  getPortfolio(): PortfolioConfig {
    return getItem<PortfolioConfig>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
  },
  savePortfolio(portfolio: PortfolioConfig): void {
    setItem(STORAGE_KEYS.PORTFOLIO, { ...portfolio, updatedAt: new Date().toISOString() });
  },

  // --- RESOURCES & GUIDES ---
  getResources(): CareerResource[] {
    return getItem<CareerResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  },
  saveResource(resource: CareerResource): void {
    const list = this.getResources();
    const index = list.findIndex(r => r.id === resource.id);
    if (index >= 0) {
      list[index] = resource;
    } else {
      list.unshift(resource);
    }
    setItem(STORAGE_KEYS.RESOURCES, list);
  },
  deleteResource(id: string): void {
    const list = this.getResources().filter(r => r.id !== id);
    setItem(STORAGE_KEYS.RESOURCES, list);
  },

  // --- NOTIFICATIONS ---
  getNotifications(): Notification[] {
    return getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map(n => (n.id === id ? { ...n, isRead: true } : n));
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, isRead: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // --- ADMIN STATS ---
  getAdminStats(): AdminStats {
    const apps = this.getApplications();
    const opps = this.getOpportunities();
    const base = getItem<AdminStats>(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
    return {
      ...base,
      activeOpportunities: opps.filter(o => o.status === 'published').length,
      applicationsTracked: apps.length + 28904,
    };
  },

  // --- RESET ALL TO DEFAULT ---
  resetAll(): void {
    localStorage.clear();
    window.location.reload();
  }
};

