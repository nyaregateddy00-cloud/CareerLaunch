/**
 * CareerLaunch AI Service Layer
 * 
 * Provides an honest, modular interface for AI career assistance.
 * If a server-side VITE_AI_API_URL is not configured, it transparently returns
 * isConfigured: false so the UI presents an honest "Configuration Required"
 * or "Coming Soon" state rather than fake responses.
 */

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
  private geminiKey: string | undefined;

  constructor() {
    this.endpoint = import.meta.env.VITE_AI_API_URL;
    this.geminiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean((this.endpoint && this.endpoint.trim() !== '') || (this.geminiKey && this.geminiKey.trim() !== ''));
  }

  public async sendMessage(
    prompt: string,
    history: AIChatMessage[] = [],
    task?: AIAssistantTask,
    userContext?: { fullName?: string; headline?: string; skills?: string[] }
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        isConfigured: false,
        content: '',
        error: 'AI service is not configured. Add VITE_GEMINI_API_KEY or VITE_AI_API_URL to your environment variables.',
      };
    }

    const systemInstruction = `You are CareerLaunch AI, an expert career advisor specializing in university students, graduates, and professionals across Kenya and Africa. 
User Context: ${userContext?.fullName ? `User: ${userContext.fullName}` : ''} ${userContext?.headline ? `Role/Headline: ${userContext.headline}` : ''} ${userContext?.skills?.length ? `Skills: ${userContext.skills.join(', ')}` : ''}.
Task Focus: ${task || 'General career mentorship'}.
Tone: Professional, encouraging, highly actionable, concise. Focus on practical African & global career opportunities (e.g. tech hubs in Nairobi, Kigali, Lagos, Cape Town, remote work, attachments).`;

    // 1. Direct Google Gemini Integration if key is available
    if (this.geminiKey) {
      try {
        const modelName = 'gemini-3.8-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.geminiKey}`;

        const contents = [
          ...history.slice(-8).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }],
          },
        ];

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Gemini API error (${response.status})`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

        return {
          success: true,
          isConfigured: true,
          content: generatedText,
        };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Gemini connection failed';
        return {
          success: false,
          isConfigured: true,
          content: '',
          error: errorMessage,
        };
      }
    }

    // 2. Server-side proxy endpoint fallback
    try {
      const contents = [
        ...history.slice(-6).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }],
        },
      ];

      const response = await fetch(this.endpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, prompt, history, task, userContext }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
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
