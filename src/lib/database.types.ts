/**
 * Supabase Database Type Definitions
 * Auto-generated style types representing the PostgreSQL schema in supabase/schema.sql.
 * Used for type-safe database queries when Supabase is actively configured.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          location: string | null;
          role: 'student' | 'graduate' | 'job_seeker' | 'freelancer' | 'career_changer' | 'admin';
          phone: string | null;
          website_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          profile_strength: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          role?: 'student' | 'graduate' | 'job_seeker' | 'freelancer' | 'career_changer' | 'admin';
          phone?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          profile_strength?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          role?: 'student' | 'graduate' | 'job_seeker' | 'freelancer' | 'career_changer' | 'admin';
          phone?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          profile_strength?: number;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          degree: string;
          field_of_study: string;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          grade: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution: string;
          degree: string;
          field_of_study: string;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          grade?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          institution?: string;
          degree?: string;
          field_of_study?: string;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          grade?: string | null;
          description?: string | null;
        };
      };
      experience: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          position: string;
          employment_type: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          position: string;
          employment_type?: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          company?: string;
          position?: string;
          employment_type?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          category?: string;
        };
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          category: string;
          proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
          years_of_experience: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          category: string;
          proficiency_level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
          years_of_experience?: number;
          created_at?: string;
        };
        Update: {
          skill_name?: string;
          category?: string;
          proficiency_level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
          years_of_experience?: number;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          link: string | null;
          github_link: string | null;
          image_url: string | null;
          tags: string[];
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          link?: string | null;
          github_link?: string | null;
          image_url?: string | null;
          tags?: string[];
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          link?: string | null;
          github_link?: string | null;
          image_url?: string | null;
          tags?: string[];
          is_featured?: boolean;
        };
      };
      certifications: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          issuer: string;
          issue_date: string;
          expiry_date: string | null;
          credential_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          issuer: string;
          issue_date: string;
          expiry_date?: string | null;
          credential_url?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          issuer?: string;
          issue_date?: string;
          expiry_date?: string | null;
          credential_url?: string | null;
        };
      };
      opportunities: {
        Row: {
          id: string;
          title: string;
          company: string;
          company_logo: string | null;
          location: string;
          country: string;
          type: 'job' | 'internship' | 'attachment' | 'scholarship' | 'freelance' | 'graduate_program' | 'competition';
          workplace_type: 'on-site' | 'hybrid' | 'remote';
          experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'all';
          category: string;
          description: string;
          requirements: string[];
          responsibilities: string[];
          salary_range: string | null;
          deadline: string | null;
          is_featured: boolean;
          is_verified: boolean;
          application_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          company_logo?: string | null;
          location: string;
          country?: string;
          type: 'job' | 'internship' | 'attachment' | 'scholarship' | 'freelance' | 'graduate_program' | 'competition';
          workplace_type: 'on-site' | 'hybrid' | 'remote';
          experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'all';
          category: string;
          description: string;
          requirements?: string[];
          responsibilities?: string[];
          salary_range?: string | null;
          deadline?: string | null;
          is_featured?: boolean;
          is_verified?: boolean;
          application_url?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          company?: string;
          company_logo?: string | null;
          location?: string;
          country?: string;
          type?: 'job' | 'internship' | 'attachment' | 'scholarship' | 'freelance' | 'graduate_program' | 'competition';
          workplace_type?: 'on-site' | 'hybrid' | 'remote';
          experience_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'all';
          category?: string;
          description?: string;
          requirements?: string[];
          responsibilities?: string[];
          salary_range?: string | null;
          deadline?: string | null;
          is_featured?: boolean;
          is_verified?: boolean;
          application_url?: string | null;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          opportunity_id: string | null;
          company_name: string;
          job_title: string;
          location: string | null;
          stage: 'saved' | 'applied' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
          applied_date: string;
          deadline: string | null;
          notes: string | null;
          job_url: string | null;
          salary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          opportunity_id?: string | null;
          company_name: string;
          job_title: string;
          location?: string | null;
          stage?: 'saved' | 'applied' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
          applied_date?: string;
          deadline?: string | null;
          notes?: string | null;
          job_url?: string | null;
          salary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          job_title?: string;
          location?: string | null;
          stage?: 'saved' | 'applied' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
          applied_date?: string;
          deadline?: string | null;
          notes?: string | null;
          job_url?: string | null;
          salary?: string | null;
          updated_at?: string;
        };
      };
      saved_opportunities: {
        Row: {
          id: string;
          user_id: string;
          opportunity_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          opportunity_id: string;
          created_at?: string;
        };
        Update: {
          opportunity_id?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          headline: string | null;
          bio: string | null;
          theme: string;
          is_published: boolean;
          social_links: Json;
          featured_project_ids: string[];
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          headline?: string | null;
          bio?: string | null;
          theme?: string;
          is_published?: boolean;
          social_links?: Json;
          featured_project_ids?: string[];
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          headline?: string | null;
          bio?: string | null;
          theme?: string;
          is_published?: boolean;
          social_links?: Json;
          featured_project_ids?: string[];
          view_count?: number;
          updated_at?: string;
        };
      };
      cv_documents: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template_id: string;
          is_default: boolean;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          template_id?: string;
          is_default?: boolean;
          content: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          template_id?: string;
          is_default?: boolean;
          content?: Json;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          category: string;
          summary: string;
          content: string;
          author: string;
          read_time_minutes: number;
          tags: string[];
          is_featured: boolean;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          summary: string;
          content: string;
          author: string;
          read_time_minutes?: number;
          tags?: string[];
          is_featured?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          category?: string;
          summary?: string;
          content?: string;
          author?: string;
          read_time_minutes?: number;
          tags?: string[];
          is_featured?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'opportunity' | 'application';
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'opportunity' | 'application';
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
    };
  };
}
