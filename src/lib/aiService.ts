/**
 * CareerLaunch AI Service Layer
 * 
 * Provides an honest, modular interface for AI career assistance.
 * If VITE_GEMINI_API_KEY is not configured, it transparently returns
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
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim() !== '' && !this.apiKey.includes('placeholder'));
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
        error: 'AI service is not configured. Please provide a VITE_GEMINI_API_KEY in your environment configuration.',
      };
    }

    try {
      const systemInstruction = `You are CareerLaunch AI, an expert career advisor specializing in university students, graduates, and professionals in Kenya and Africa. 
User Context: ${userContext?.fullName ? `User: ${userContext.fullName}` : ''} ${userContext?.headline ? `Role/Headline: ${userContext.headline}` : ''} ${userContext?.skills?.length ? `Skills: ${userContext.skills.join(', ')}` : ''}.
Task Focus: ${task || 'General career mentorship'}.
Tone: Professional, encouraging, actionable, modern, concise. Focus on practical African & international career opportunities.`;

      // Call Gemini REST API directly using fetch
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

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

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

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
