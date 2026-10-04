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
        const endpointPath = (() => {
          try { return new URL(this.endpoint!, window.location.origin).pathname; }
          catch { return 'configured endpoint'; }
        })();
        const responseType = response.headers.get('content-type') || 'unknown response type';
        const detail = responseText.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 240);
        throw new Error(
          message ||
          `API error ${response.status} at ${endpointPath} (${responseType})${detail ? `: ${detail}` : ''}`
        );
      }

      const data = await response.json();
      const generatedText = data.content || data.text || 'No response generated.';

      return {
        success: true,
        isConfigured: true,
        content: generatedText,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown AI service error';
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
