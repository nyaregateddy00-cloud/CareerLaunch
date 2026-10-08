import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole } from '../types';
import { mockStorage, restoreRemoteWorkspace, setRemoteWorkspaceUser } from '../lib/mockStorage';
import { INITIAL_USER_TEDDY, INITIAL_USER_AMINA, INITIAL_USER_ADMIN } from '../lib/mockData';
import { calculateProfileStrength } from '../lib/utils';
import { isDevelopmentDemoMode, isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  authNotice: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, role: UserRole, headline?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  completePasswordReset: (password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  refreshProfile: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => isDevelopmentDemoMode ? mockStorage.getCurrentUser() : null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const profileLoadRequests = useRef(new Map<string, Promise<void>>());
  const activeRemoteUserId = useRef<string | null>(null);

  const loadSupabaseProfile = async (session: Session | null) => {
    if (!session?.user) {
      activeRemoteUserId.current = null;
      setRemoteWorkspaceUser(null);
      setUser(null);
      return;
    }

    const userId = session.user.id;
    activeRemoteUserId.current = userId;
    const pendingLoad = profileLoadRequests.current.get(userId);
    if (pendingLoad) return pendingLoad;

    const load = (async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (activeRemoteUserId.current !== userId) return;
    const row = data as Record<string, unknown> | null;
    const metadata = session.user.user_metadata || {};
    const allowedRoles: UserRole[] = ['student', 'graduate', 'job_seeker', 'freelancer', 'career_changer', 'employer'];
    const requestedRole = metadata.role as UserRole;
    const profile: UserProfile = {
      id: session.user.id,
      email: session.user.email || '',
      fullName: String(row?.full_name || metadata.full_name || metadata.name || session.user.email?.split('@')[0] || 'CareerLaunch user'),
      headline: String(row?.headline || metadata.headline || ''),
      bio: String(row?.bio || ''),
      location: String(row?.location || ''),
      phone: row?.phone ? String(row.phone) : undefined,
      avatarUrl: row?.avatar_url ? String(row.avatar_url) : metadata.avatar_url || metadata.picture || undefined,
      githubUrl: row?.github_url ? String(row.github_url) : undefined,
      linkedinUrl: row?.linkedin_url ? String(row.linkedin_url) : undefined,
      portfolioUrl: row?.portfolio_url ? String(row.portfolio_url) : undefined,
      twitterUrl: row?.twitter_url ? String(row.twitter_url) : undefined,
      websiteUrl: row?.website_url ? String(row.website_url) : undefined,
      role: (row?.role === 'admin' || allowedRoles.includes(row?.role as UserRole) ? row?.role : allowedRoles.includes(requestedRole) ? requestedRole : 'job_seeker') as UserRole,
      profileStrength: Number(row?.profile_strength || 0),
      createdAt: String(row?.created_at || session.user.created_at),
      updatedAt: String(row?.updated_at || new Date().toISOString()),
    };
    setUser(profile);
    mockStorage.setCurrentUser(profile);
    setRemoteWorkspaceUser(profile.id);
    try {
      await restoreRemoteWorkspace();
    } catch (error) {
      if (activeRemoteUserId.current !== userId) return;
      setAuthNotice(error instanceof Error
        ? `Your account is signed in, but workspace sync is unavailable. Apply the updated Supabase schema to enable it. (${error.message})`
        : 'Your account is signed in, but workspace sync is unavailable. Apply the updated Supabase schema to enable it.');
    }
    })();

    profileLoadRequests.current.set(userId, load);
    try {
      await load;
    } finally {
      if (profileLoadRequests.current.get(userId) === load) profileLoadRequests.current.delete(userId);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      return loadSupabaseProfile(data.session).finally(() => setIsLoading(false));
    }).catch((error: unknown) => {
      if (!active) return;
      setAuthError(error instanceof Error ? error.message : 'Could not restore your sign-in session.');
      setIsLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') return;
      if (active) void loadSupabaseProfile(session);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!isDevelopmentDemoMode) return;
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>;
      if (!customEvent.detail || customEvent.detail.key === 'careerlaunch_current_user') {
        setUser(mockStorage.getCurrentUser());
      }
    };
    window.addEventListener('careerlaunch_storage_change', handleStorageChange);
    return () => window.removeEventListener('careerlaunch_storage_change', handleStorageChange);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null); setAuthNotice(null);
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
      if (error) { setAuthError(error.message); setIsLoading(false); return false; }
      await loadSupabaseProfile(data.session);
      setIsLoading(false);
      return Boolean(data.session);
    }
    if (!isDevelopmentDemoMode) {
      setAuthError('Secure sign-in is unavailable because this site is not connected to its authentication service. Please try again later.');
      setIsLoading(false);
      return false;
    }
    await new Promise(res => setTimeout(res, 400)); // simulate brief network latency
    const allUsers = mockStorage.getAllUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      mockStorage.setCurrentUser(matched);
      setUser(matched);
      setIsLoading(false);
      return true;
    }

    setAuthError('No account was found for those details. Create an account first, or check your email and password.');
    setIsLoading(false);
    return false;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true); setAuthError(null); setAuthNotice(null);
    if (!isSupabaseConfigured) {
      setAuthError('Google sign-in requires Supabase authentication to be configured.');
      setIsLoading(false);
      return false;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      setAuthError(error.message);
      setIsLoading(false);
      return false;
    }
    return true;
  };

  const signup = async (fullName: string, email: string, password: string, role: UserRole, headline?: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null); setAuthNotice(null);
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, role, headline }, emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) { setAuthError(error.message); setIsLoading(false); return false; }
      if (!data.session) {
        setAuthNotice('Check your email to confirm your account, then sign in.');
        setIsLoading(false);
        return false;
      }
      await loadSupabaseProfile(data.session);
      setIsLoading(false);
      return true;
    }
    if (!isDevelopmentDemoMode) {
      setAuthError('Secure account creation is unavailable because this site is not connected to its authentication service. Please try again later.');
      setIsLoading(false);
      return false;
    }
    await new Promise(res => setTimeout(res, 400));
    const normalizedEmail = email.trim().toLowerCase();
    if (mockStorage.getAllUsers().some(existing => existing.email.trim().toLowerCase() === normalizedEmail)) {
      setAuthError('An account already exists for that email. Sign in instead.');
      setIsLoading(false);
      return false;
    }
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      fullName,
      headline: headline || `${role === 'student' ? 'University Student' : 'Professional'} | CareerLaunch`,
      bio: `Hello! I am ${fullName}, ready to connect with companies, grow my skills, and build my career.`,
      location: 'Nairobi, Kenya',
      role,
      profileStrength: 40,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStorage.setCurrentUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true); setAuthError(null); setAuthNotice(null);
    if (!isSupabaseConfigured) {
      setAuthError('Password recovery needs Supabase authentication to be configured.');
      setIsLoading(false); return false;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) setAuthError(error.message);
    else setAuthNotice('If an account exists for that address, a password reset link is on its way.');
    setIsLoading(false);
    return !error;
  };

  const completePasswordReset = async (password: string): Promise<boolean> => {
    setIsLoading(true); setAuthError(null); setAuthNotice(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setAuthError(error.message);
    else setAuthNotice('Your password has been updated. You can sign in with it now.');
    setIsLoading(false);
    return !error;
  };

  const logout = () => {
    if (isSupabaseConfigured) void supabase.auth.signOut();
    mockStorage.setCurrentUser(null as unknown as UserProfile);
    setUser(null);
  };

  const switchUser = (userId: string) => {
    if (!isDevelopmentDemoMode) return;
    if (userId === INITIAL_USER_TEDDY.id) {
      mockStorage.setCurrentUser(INITIAL_USER_TEDDY);
      setUser(INITIAL_USER_TEDDY);
    } else if (userId === INITIAL_USER_AMINA.id) {
      mockStorage.setCurrentUser(INITIAL_USER_AMINA);
      setUser(INITIAL_USER_AMINA);
    } else if (userId === INITIAL_USER_ADMIN.id) {
      mockStorage.setCurrentUser(INITIAL_USER_ADMIN);
      setUser(INITIAL_USER_ADMIN);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const skills = mockStorage.getUserSkills();
    const exp = mockStorage.getExperience();
    const edu = mockStorage.getEducation();
    const proj = mockStorage.getProjects();
    const { score } = calculateProfileStrength({ ...user, ...updates }, skills, exp, edu, proj);

    const updatedUser: UserProfile = {
      ...user,
      ...updates,
      profileStrength: score,
      updatedAt: new Date().toISOString(),
    };

    mockStorage.updateUser(updatedUser);
    setUser(updatedUser);
    if (isSupabaseConfigured) {
      void supabase.from('profiles').update({
        full_name: updatedUser.fullName,
        headline: updatedUser.headline,
        bio: updatedUser.bio,
        location: updatedUser.location,
        phone: updatedUser.phone,
        avatar_url: updatedUser.avatarUrl,
        github_url: updatedUser.githubUrl,
        linkedin_url: updatedUser.linkedinUrl,
        portfolio_url: updatedUser.portfolioUrl,
        website_url: updatedUser.websiteUrl,
        twitter_url: updatedUser.twitterUrl,
        profile_strength: updatedUser.profileStrength,
        updated_at: updatedUser.updatedAt,
      }).eq('id', updatedUser.id).then(({ error }) => {
        if (error) console.error('Could not save profile to Supabase:', error.message);
      });
    }
  };

  const refreshProfile = () => {
    setUser(mockStorage.getCurrentUser());
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user && user.id);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authError,
        authNotice,
        login,
        signInWithGoogle,
        signup,
        resetPassword,
        completePasswordReset,
        logout,
        switchUser,
        updateProfile,
        refreshProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

