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
  PortfolioConfig,
  CVDocument,
  Notification,
  RoleSkillGap,
  Language,
  InterviewPracticeSession,
  UserPreferences
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
  INITIAL_APPLICATIONS,
  INITIAL_SAVED_OPP_IDS,
  INITIAL_RESOURCES,
  INITIAL_NOTIFICATIONS,
} from './mockData';
import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'careerlaunch_current_user',
  USERS: 'careerlaunch_users',
  OPPORTUNITIES: 'careerlaunch_opportunities',
  APPLICATIONS: 'careerlaunch_applications',
  SAVED_OPP_IDS: 'careerlaunch_saved_opp_ids',
  SAVED_RESOURCES: 'careerlaunch_saved_resources',
  COMPLETED_RESOURCES: 'careerlaunch_completed_resources',
  TARGET_ROLE: 'careerlaunch_target_role',
  TARGET_ROLE_SKILLS: 'careerlaunch_target_role_skills',
  INTERVIEW_SESSIONS: 'careerlaunch_interview_sessions',
  PREFERENCES: 'careerlaunch_preferences',
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
  THEME: 'careerlaunch_theme',
};

const CLOUD_WORKSPACE_KEYS = [
  STORAGE_KEYS.APPLICATIONS,
  STORAGE_KEYS.SAVED_OPP_IDS,
  STORAGE_KEYS.SAVED_RESOURCES,
  STORAGE_KEYS.COMPLETED_RESOURCES,
  STORAGE_KEYS.TARGET_ROLE,
  STORAGE_KEYS.TARGET_ROLE_SKILLS,
  STORAGE_KEYS.INTERVIEW_SESSIONS,
  STORAGE_KEYS.PREFERENCES,
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
  STORAGE_KEYS.SAVED_RESOURCES,
  STORAGE_KEYS.COMPLETED_RESOURCES,
  STORAGE_KEYS.TARGET_ROLE,
  STORAGE_KEYS.TARGET_ROLE_SKILLS,
  STORAGE_KEYS.INTERVIEW_SESSIONS,
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
let pendingWorkspaceTimer: ReturnType<typeof setTimeout> | undefined;
const pendingWorkspaceChanges = new Map<string, { userId: string; collection: string; before: unknown; after: unknown }>();
let workspaceWriteChain: Promise<void> = Promise.resolve();
const storageKeyFor = (key: string, userId = remoteUserId) =>
  userId && CLOUD_WORKSPACE_KEYS.includes(key) ? `${key}:${userId}` : key;

function toDatabaseRecords(collection: string, value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      if (typeof entry === 'string') return entry;
      if (!entry || typeof entry !== 'object') return {};
      const row = entry as Record<string, unknown>;
      const fields: Record<string, string> = {
        userId: 'user_id', skillName: 'skill_name', category: 'category', proficiencyLevel: 'proficiency_level', yearsOfExperience: 'years_of_experience',
        employmentType: 'employment_type', startDate: 'start_date', endDate: 'end_date', isCurrent: 'is_current', fieldOfStudy: 'field_of_study',
        githubLink: 'github_link', imageUrl: 'image_url', isFeatured: 'is_featured', issueDate: 'issue_date', expiryDate: 'expiry_date',
        credentialUrl: 'credential_url', dateApplied: 'date_applied', opportunityId: 'opportunity_id', followUpDate: 'follow_up_date',
        interviewDate: 'interview_date', jobUrl: 'job_url', updatedAt: 'updated_at', actionUrl: 'action_url', isRead: 'is_read', createdAt: 'created_at',
      };
      return Object.fromEntries(Object.entries(row).map(([key, fieldValue]) => [fields[key] || key, fieldValue]));
    });
  }
  if (!value || typeof value !== 'object') return value;
  const row = value as Record<string, unknown>;
  if (collection === STORAGE_KEYS.CV) {
    return { id: row.id, title: row.title, template_id: row.templateId, content: row.content, is_default: row.isDefault, updated_at: row.updatedAt };
  }
  if (collection === STORAGE_KEYS.PORTFOLIO) {
    return { slug: row.slug, headline: row.headline, bio: row.bio, theme: row.theme, is_published: row.isPublished, social_links: row.socialLinks,
      featured_project_ids: row.featuredProjectIds, public_sections: row.publicSections };
  }
  if (collection === STORAGE_KEYS.PREFERENCES) {
    return { currency: row.currency, email_alerts: row.emailAlerts, interview_reminders: row.interviewReminders, weekly_digest: row.weeklyDigest,
      appearance: row.appearance, share_career_context: row.shareCareerContext };
  }
  if (collection === STORAGE_KEYS.INTERVIEW_SESSIONS) return toDatabaseRecords(collection, [value]);
  return value;
}

function clientKeys(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => typeof entry === 'string' ? [entry] :
    entry && typeof entry === 'object' && typeof (entry as { id?: unknown }).id === 'string' ? [(entry as { id: string }).id] : []);
}

function scheduleWorkspaceSave(userId: string, collection: string, before: unknown, after: unknown): void {
  if (!isSupabaseConfigured || hydratingWorkspace) return;
  const changeKey = `${userId}:${collection}`;
  const queued = pendingWorkspaceChanges.get(changeKey);
  pendingWorkspaceChanges.set(changeKey, { userId, collection, before: queued?.before ?? before, after });
  if (pendingWorkspaceTimer) clearTimeout(pendingWorkspaceTimer);
  pendingWorkspaceTimer = setTimeout(() => {
    pendingWorkspaceTimer = undefined;
    const changes = [...pendingWorkspaceChanges.values()];
    pendingWorkspaceChanges.clear();
    workspaceWriteChain = workspaceWriteChain.then(async () => {
      let normalizedFailure: unknown;
      for (const change of changes) {
        const beforeKeys = new Set(clientKeys(change.before));
        const afterKeys = new Set(clientKeys(change.after));
        const deleted = [...beforeKeys].filter((id) => !afterKeys.has(id));
        const { error: recordError } = await supabase.rpc('save_workspace_records', {
          p_collection: change.collection,
          p_records: toDatabaseRecords(change.collection, change.after),
          p_deleted_keys: deleted,
        });
        if (recordError) normalizedFailure = recordError;
      }
      const payload: Record<string, unknown> = {};
      for (const key of CLOUD_WORKSPACE_KEYS) {
        const raw = localStorage.getItem(storageKeyFor(key, userId));
        if (!raw) continue;
        try { payload[key] = JSON.parse(raw); } catch { /* Ignore corrupt browser cache entries. */ }
      }
      const { error } = await supabase.from('workspace_snapshots').upsert({ user_id: userId, payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      if (normalizedFailure) window.dispatchEvent(new CustomEvent('careerlaunch_persistence_error', { detail: normalizedFailure instanceof Error ? normalizedFailure.message : 'Structured workspace sync failed.' }));
      if (error) throw error;
    }).catch((error: unknown) => {
      window.dispatchEvent(new CustomEvent('careerlaunch_persistence_error', { detail: error instanceof Error ? error.message : 'Workspace synchronization failed.' }));
    });
  }, 250);
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
  const { data: normalizedData, error: normalizedError } = await supabase.rpc('load_workspace_records');
  if (normalizedError) window.dispatchEvent(new CustomEvent('careerlaunch_persistence_error', { detail: normalizedError.message }));
  hydratingWorkspace = true;
  try {
    const payload = data?.payload as Record<string, unknown> | undefined;
    const normalized = normalizedData && typeof normalizedData === 'object' ? normalizedData as Record<string, unknown> : {};
    const preferNormalized = normalized._normalized_ready === true;
    const restored: Record<string, unknown> = {};
    for (const key of CLOUD_WORKSPACE_KEYS) {
      const legacyValue = payload?.[key];
      const cachedRaw = localStorage.getItem(storageKeyFor(key, currentUserId));
      let cachedValue: unknown;
      if (cachedRaw) {
        try { cachedValue = JSON.parse(cachedRaw); } catch { /* Ignore corrupt browser cache. */ }
      }
      const normalizedValue = normalized[key];
      const normalizedObjectIsEmpty = normalizedValue && typeof normalizedValue === 'object' && !Array.isArray(normalizedValue) && Object.keys(normalizedValue).length === 0;
      const value = preferNormalized
        ? normalizedObjectIsEmpty ? legacyValue ?? cachedValue : normalizedValue
        : legacyValue ?? cachedValue ?? (normalizedObjectIsEmpty ? undefined : normalizedValue);
      if (value === undefined) continue;
      restored[key] = value;
      localStorage.setItem(storageKeyFor(key, currentUserId), JSON.stringify(value));
    }
    if (!normalizedError && !preferNormalized) {
      const { error: migrationError } = await supabase.rpc('backfill_workspace_snapshot', { p_payload: { ...payload, ...restored } });
      if (migrationError) window.dispatchEvent(new CustomEvent('careerlaunch_persistence_error', { detail: migrationError.message }));
    }
    const { error: snapshotError } = await supabase.from('workspace_snapshots').upsert({ user_id: currentUserId, payload: { ...payload, ...restored }, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (snapshotError) window.dispatchEvent(new CustomEvent('careerlaunch_persistence_error', { detail: snapshotError.message }));
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
        publicSections: { photo: false, headline: false, bio: false, projects: false, experience: false, education: false, skills: false, socialLinks: false, location: false, email: false },
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
    const storageKey = storageKeyFor(key);
    const oldValue = localStorage.getItem(storageKey);
    let before: unknown = [];
    if (oldValue) {
      try { before = JSON.parse(oldValue); } catch { before = []; }
    }
    localStorage.setItem(storageKey, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('careerlaunch_storage_change', { detail: { key } }));
    if (remoteUserId && CLOUD_WORKSPACE_KEYS.includes(key)) scheduleWorkspaceSave(remoteUserId, key, before, value);
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
    const opportunities = getItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, []);
    // Remove the old hard-coded preview listings from browsers that cached them.
    const current = opportunities.filter((opportunity) => !/^opp-[1-9]$/.test(opportunity.id));
    if (current.length !== opportunities.length) setItem(STORAGE_KEYS.OPPORTUNITIES, current);
    return current;
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

  // --- LEARNING PROGRESS ---
  getSavedResourceIds(): string[] {
    return getItem<string[]>(STORAGE_KEYS.SAVED_RESOURCES, []);
  },
  setSavedResourceIds(ids: string[]): void {
    setItem(STORAGE_KEYS.SAVED_RESOURCES, ids);
  },
  getCompletedResourceIds(): string[] {
    return getItem<string[]>(STORAGE_KEYS.COMPLETED_RESOURCES, []);
  },
  setCompletedResourceIds(ids: string[]): void {
    setItem(STORAGE_KEYS.COMPLETED_RESOURCES, ids);
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
    return [];
  },
  getTargetRole(): string {
    return getItem<string>(STORAGE_KEYS.TARGET_ROLE, '');
  },
  setTargetRole(role: string): void {
    setItem(STORAGE_KEYS.TARGET_ROLE, role);
  },
  getTargetRoleSkills(): string[] {
    return getItem<string[]>(STORAGE_KEYS.TARGET_ROLE_SKILLS, []);
  },
  setTargetRoleSkills(skills: string[]): void {
    setItem(STORAGE_KEYS.TARGET_ROLE_SKILLS, skills);
  },
  getInterviewSessions(): InterviewPracticeSession[] {
    return getItem<InterviewPracticeSession[]>(STORAGE_KEYS.INTERVIEW_SESSIONS, []);
  },
  saveInterviewSession(session: InterviewPracticeSession): void {
    setItem(STORAGE_KEYS.INTERVIEW_SESSIONS, [session, ...this.getInterviewSessions()].slice(0, 30));
  },
  getPreferences(): UserPreferences {
    return getItem<UserPreferences>(STORAGE_KEYS.PREFERENCES, {
      currency: 'KES', emailAlerts: true, interviewReminders: true, weeklyDigest: false,
      appearance: localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light',
      shareCareerContext: false,
    });
  },
  setPreferences(preferences: UserPreferences): void {
    setItem(STORAGE_KEYS.PREFERENCES, preferences);
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
  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'> & Partial<Pick<Notification, 'id' | 'createdAt' | 'isRead'>>): void {
    const list = this.getNotifications();
    list.unshift({
      ...notification,
      id: notification.id || `notice-${crypto.randomUUID()}`,
      isRead: notification.isRead ?? false,
      createdAt: notification.createdAt || new Date().toISOString(),
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 100));
  },
  markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map(n => (n.id === id ? { ...n, isRead: true } : n));
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, isRead: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // --- RESET ALL TO DEFAULT ---
  resetAll(): void {
    localStorage.clear();
    window.location.reload();
  }
};

