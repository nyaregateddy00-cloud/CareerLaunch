import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
  FileText,
  Briefcase,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { aiService, AIChatMessage } from '../../lib/aiService';
import { mockStorage } from '../../lib/mockStorage';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

function renderMessageText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part.replace(/\*\*/g, '')}</React.Fragment>;
  });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: `Hello! I'm **CareerLaunch AI**, your dedicated career advisor focused on African tech ecosystems and global remote opportunities.

I can help you with:
• **CV & Resume Reviews**: Tailor your CV specifically for roles at Safaricom, Equity Group, Microsoft ADC, or Andela.
• **Custom Cover Letters**: Generate high-converting cover letters highlighting your local projects (e.g. M-Pesa integrations, agricultural tech).
• **Interview Simulation**: Practice technical & STAR behavioral questions with tailored feedback.
• **Skill Gap Advice**: Find out exactly which technologies to master next for high-paying opportunities.

What would you like to work on today?`,
    timestamp: 'Just now',
  },
];

const PROMPT_SUGGESTIONS = [
  {
    title: 'Review CV for Safaricom',
    prompt: 'Review my CV summary and experience to apply for the Graduate Software Engineer role at Safaricom PLC.',
  },
  {
    title: 'Cover Letter for Andela',
    prompt: 'Draft a compelling cover letter for the Junior Frontend Engineer role at Andela, highlighting my React and TypeScript projects.',
  },
  {
    title: 'Simulate Tech Interview',
    prompt: 'Simulate a 3-question technical interview for an entry-level software developer in Nairobi.',
  },
  {
    title: 'Nairobi Market Skills 2026',
    prompt: 'What are the top 5 high-demand engineering skills in East Africa right now, and how should I learn them?',
  },
];

export const AIChatWindow: React.FC = () => {
  const { user } = useAuth();
  const isAIConfigured = aiService.isConfigured();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || isTyping) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    if (!isAIConfigured) {
      // Honest unconfigured state
      setTimeout(() => {
        const noticeMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'system',
          text: 'AI integration is not connected yet. Configure VITE_AI_API_URL with a secured server-side endpoint to enable career coaching. Provider API keys must stay on the server and must not be placed in browser-exposed VITE_ variables.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, noticeMessage]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const skills = mockStorage.getUserSkills().map((s) => s.skillName);
      const history: AIChatMessage[] = messages
        .filter((m) => m.sender !== 'system')
        .map((m) => ({
          id: m.id,
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
          timestamp: m.timestamp,
        }));

      const res = await aiService.sendMessage(prompt, history, undefined, {
        fullName: user?.fullName,
        headline: user?.headline,
        skills,
      });

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.content || (res.error ? `Error: ${res.error}` : 'No response generated.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown AI communication error';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'system',
          text: `⚠️ Error communicating with AI service: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden flex flex-col h-[calc(100vh-9rem)] max-h-[820px]">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-green-500/10 dark:bg-brand-green-500/20 border border-brand-green-500/30 flex items-center justify-center text-brand-green-600 dark:text-brand-green-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                CareerLaunch AI
              </h3>
              {isAIConfigured ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-green-700 dark:text-brand-green-300 bg-brand-green-50 dark:bg-brand-green-950 px-2 py-0.5 rounded-full border border-brand-green-200 dark:border-brand-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green-500 animate-pulse"></span>
                  Active (Gemini)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Awaiting secure AI endpoint
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              African Career Intelligence • Powered by Regional Talent Insights
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Honest Status Banner when API Key is not set */}
      {!isAIConfigured && (
        <div className="px-6 py-3 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Preview Mode:</strong> Configure a server-side AI endpoint to enable live responses.
            </span>
          </div>
        </div>
      )}

      {/* Suggestion Chips */}
      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Quick Prompts:
        </span>
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.prompt)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-green-500 hover:text-brand-green-600 dark:hover:text-brand-green-400 transition-colors whitespace-nowrap flex-shrink-0"
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 max-w-2xl mx-auto shadow-sm"
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium text-right">
                  {msg.timestamp}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              {msg.sender === 'user' ? (
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                  }
                  alt="User"
                  className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-brand-green-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`relative max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-blue-900 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.text.replace(/\*\*/g, ''), msg.id)}
                    className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-brand-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                <div className="whitespace-pre-wrap space-y-2 pr-6">{renderMessageText(msg.text)}</div>

                <div
                  className={`mt-2 text-[10px] font-medium ${
                    msg.sender === 'user' ? 'text-brand-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-green-500 flex items-center justify-center text-white flex-shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse"></span>
              <span>CareerLaunch AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. 'How do I explain my industrial attachment in an interview?')..."
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green-500 transition-all"
          />
          <Button
            type="submit"
            variant="accent"
            size="md"
            disabled={!inputText.trim() || isTyping}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
