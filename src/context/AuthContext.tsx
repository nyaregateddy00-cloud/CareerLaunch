import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { mockStorage } from '../lib/mockStorage';
import { INITIAL_USER_TEDDY, INITIAL_USER_AMINA, INITIAL_USER_ADMIN } from '../lib/mockData';
import { calculateProfileStrength } from '../lib/utils';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, role: UserRole, headline?: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  refreshProfile: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return mockStorage.getCurrentUser();
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>;
      if (!customEvent.detail || customEvent.detail.key === 'careerlaunch_current_user') {
        setUser(mockStorage.getCurrentUser());
      }
    };
    window.addEventListener('careerlaunch_storage_change', handleStorageChange);
    return () => window.removeEventListener('careerlaunch_storage_change', handleStorageChange);
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400)); // simulate brief network latency
    const allUsers = mockStorage.getAllUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      mockStorage.setCurrentUser(matched);
      setUser(matched);
      setIsLoading(false);
      return true;
    }

    // If new email entered during login demo, create a profile for them
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      headline: 'Aspiring Professional | CareerLaunch',
      bio: 'Eager to build technical skills, explore opportunities, and launch my career.',
      location: 'Nairobi, Kenya',
      role: 'job_seeker',
      profileStrength: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStorage.setCurrentUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (fullName: string, email: string, role: UserRole, headline?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400));
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
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

  const logout = () => {
    mockStorage.setCurrentUser(null as unknown as UserProfile);
    setUser(null);
  };

  const switchUser = (userId: string) => {
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
        login,
        signup,
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

