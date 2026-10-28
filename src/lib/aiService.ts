import { isSupabaseConfigured, supabase } from './supabase';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIResponse {
  success: boolean;
  content: string;
  isConfigured: boolean;
  error?: string;
}

export type AIAssistantTask =
  | 'improve_cv'
  | 'cover_letter'
  | 'interview_prep'
  | 'career_path'
  | 'skill_gap'
  | 'general_advice';

export interface AIUserContext {
  fullName?: string;
  headline?: string;
  skills?: string[];
}

class AIService {
  /** This flag is enabled only after the Supabase Edge Function and provider secret are configured. */
  public isConfigured(): boolean {
    return isSupabaseConfigured && import.meta.env.VITE_AI_ENABLED === 'true';
  }

  public async sendMessage(
    prompt: string,
    history: AIChatMessage[] = [],
    task: AIAssistantTask = 'general_advice',
    userContext?: AIUserContext
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        isConfigured: false,
        content: '',
        error: 'AI is not enabled yet. Deploy the CareerLaunch Supabase AI function, add its server-side provider key, and set VITE_AI_ENABLED=true.',
      };
    }

    const { data, error } = await supabase.functions.invoke('career-ai', {
      body: {
        prompt: prompt.trim(),
        history: history.filter((message) => message.role !== 'system').slice(-8),
        task,
        userContext,
      },
    });

    if (error) {
      const message = error.message || 'The CareerLaunch AI service could not be reached.';
      return { success: false, isConfigured: true, content: '', error: message };
    }

    const content = typeof data?.content === 'string' ? data.content.trim() : '';
    if (!content) {
      return { success: false, isConfigured: true, content: '', error: 'The AI service returned an empty response. Please try again.' };
    }
    return { success: true, isConfigured: true, content };
  }
}

export const aiService = new AIService();
