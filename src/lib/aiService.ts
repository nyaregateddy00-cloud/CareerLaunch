/**
 * Authenticated client for CareerLaunch's same-origin, server-side AI endpoint.
 * User career data is sent only with a chat message and is filtered server-side.
 */

import { supabase } from './supabase';

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

class AIService {
  private endpoint: string | undefined;

  constructor() {
    // Keep the browser pointed at our same-origin Vercel function. The
    // provider key and all provider requests remain server-side.
    this.endpoint = '/api/career-ai';
  }

  public isConfigured(): boolean {
    return Boolean(this.endpoint && this.endpoint.trim() !== '');
  }

  public async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(this.endpoint!, { method: 'GET', headers: { Accept: 'application/json' } });
      if (!response.ok) return false;
      const status = await response.json();
      return status.configured === true;
    } catch {
      return false;
    }
  }

  public async sendMessage(
    prompt: string,
    history: AIChatMessage[] = [],
    task?: AIAssistantTask,
    userContext?: { fullName?: string; headline?: string; skills?: string[]; careerContext?: string }
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        isConfigured: false,
        content: '',
        error: 'The CareerLaunch AI endpoint is unavailable. Please try again later.',
      };
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) throw new Error('Sign in to use CareerLaunch AI.');

      const response = await fetch(this.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt, history, task, userContext }),
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => '');
        let message = '';
        try {
          const errorData = JSON.parse(responseText);
          message = errorData.error?.message || '';
        } catch {
          // Vercel may return a plain text or HTML routing error.
        }
        throw new Error(message || (response.status === 401
          ? 'Your session has expired. Sign in again to use CareerLaunch Coach.'
          : response.status === 503
            ? 'CareerLaunch Coach needs server-side AI configuration. Ask your administrator to configure the provider in Vercel.'
            : 'CareerLaunch Coach is temporarily unavailable. Please try again later.'));
      }

      const data = await response.json();
      const generatedText = data.content || data.text || 'No response generated.';

      return {
        success: true,
        isConfigured: true,
        content: generatedText,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof SyntaxError
        ? 'CareerLaunch Coach is not configured for this deployment.'
        : err instanceof Error && /sign in|expired/i.test(err.message)
          ? err.message
          : 'CareerLaunch Coach is temporarily unavailable. Please try again later.';
      return {
        success: false,
        isConfigured: true,
        content: '',
        error: errorMessage,
      };
    }
  }
}

export const aiService = new AIService();
