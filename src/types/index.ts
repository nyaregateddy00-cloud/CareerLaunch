export type UserRole = 
  | 'student' 
  | 'graduate' 
  | 'job_seeker' 
  | 'freelancer' 
  | 'career_changer' 
  | 'employer' 
  | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  profileStrength: number; // 0 - 100
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: string;
  userId: string;
  company: string;
  position: string;
  employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Attachment' | 'Contract' | 'Freelance';
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export type SkillCategory = 
  | 'Technical' 
  | 'Soft Skills' 
  | 'Tools & Frameworks' 
  | 'Design' 
  | 'Data & AI' 
  | 'Business & Marketing';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  category: SkillCategory;
  proficiencyLevel: SkillProficiency;
  yearsOfExperience: number;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  link?: string;
  githubLink?: string;
  imageUrl?: string;
  tags: string[];
  isFeatured: boolean;
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Language {
  id: string;
  userId?: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export type CVTemplateId = 'modern-navy' | 'executive-classic' | 'clean-minimalist';

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    headline: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: UserSkill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export interface CVDocument {
  id: string;
  userId: string;
  title: string;
  templateId: CVTemplateId;
  content: CVData;
  isDefault: boolean;
  updatedAt: string;
}

export type PortfolioTheme = 'modern-navy' | 'emerald-minimal' | 'dark-tech' | 'creative-clean';

export interface PortfolioConfig {
  id: string;
  userId: string;
  slug: string; // e.g. teddymwangi
  headline: string;
  bio: string;
  theme: PortfolioTheme;
  isPublished: boolean;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
  featuredProjectIds: string[];
  viewCount: number;
  updatedAt: string;
}

export type OpportunityType = 
  | 'Job' 
  | 'Internship' 
  | 'Attachment' 
  | 'Scholarship' 
  | 'Freelance' 
  | 'Graduate Program' 
  | 'Remote' 
  | 'Competition';

export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export type ExperienceLevel = 'Student/Intern' | 'Entry Level' | 'Mid Level' | 'Senior Level' | 'All Levels';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  country: string;
  type: OpportunityType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  salaryRange?: string;
  currency: 'KES' | 'USD' | 'EUR' | 'GBP';
  deadline?: string;
  description: string;
  requirements: string[];
  tags: string[];
  applicationUrl?: string;
  contactEmail?: string;
  source: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
  createdAt: string;
}

export type ApplicationStage = 
  | 'Saved' 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Assessment'
  | 'Interview' 
  | 'Offer' 
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  userId: string;
  opportunityId?: string;
  company: string;
  position: string;
  stage: ApplicationStage;
  dateApplied: string;
  deadline?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  interviewDate?: string;
  followUpDate?: string;
  updatedAt: string;
}

export type ResourceCategory = 
  | 'Career Guide' 
  | 'CV & Portfolio' 
  | 'Interview Prep' 
  | 'Industrial Attachment' 
  | 'Freelancing' 
  | 'Scholarships';

export interface CareerResource {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  summary: string;
  content: string;
  readTime: string;
  author: string;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string;
  readTimeMinutes?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'opportunity' | 'application';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface RoleSkillGap {
  targetRole: string;
  companyTarget?: string;
  matchScore: number; // e.g. 70%
  matchedSkills: string[];
  missingSkills: {
    name: string;
    importance: 'High' | 'Medium' | 'Nice to have';
    recommendedResource: string;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  activeOpportunities: number;
  applicationsTracked: number;
  totalPortfolios: number;
  activeSubscriptions: number;
  weeklyGrowthRate: number;
  categoryDistribution: { category: string; count: number }[];
  regionalDistribution: { region: string; count: number }[];
}

