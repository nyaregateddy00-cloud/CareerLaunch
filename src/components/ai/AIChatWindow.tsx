import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
  HelpCircle,
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

function renderInlineText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index} className="font-semibold text-inherit">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part.replace(/\*\*/g, '')}</React.Fragment>;
  });
}

function renderMessageText(text: string): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let listKind: 'ordered' | 'unordered' | null = null;
  let listItems: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    const value = paragraph.join(' ').trim();
    if (value) {
      blocks.push(<p key={key++} className="m-0 leading-6">{renderInlineText(value)}</p>);
    }
    paragraph = [];
  };

  const flushList = () => {
    if (!listKind || listItems.length === 0) return;
    const ListTag = listKind === 'ordered' ? 'ol' : 'ul';
    const marker = listKind === 'ordered' ? 'list-decimal' : 'list-disc';
    blocks.push(
      <ListTag key={key++} className={marker + ' list-outside space-y-1 pl-5'}>
        {listItems.map((item, index) => (
          <li key={index} className="pl-1 leading-6">{renderInlineText(item)}</li>
        ))}
      </ListTag>,
    );
    listKind = null;
    listItems = [];
  };

  for (const rawLine of text.replace(/\r/g, '').split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={key++} className="m-0 pt-1 text-sm font-bold text-slate-900 dark:text-white">
          {renderInlineText(heading[2])}
        </h4>,
      );
      continue;
    }

    const unordered = line.match(/^(?:[-*•])\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextKind = ordered ? 'ordered' : 'unordered';
      if (listKind && listKind !== nextKind) flushList();
      listKind = nextKind;
      listItems.push((ordered || unordered)![1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
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
          text: 'CareerLaunch AI is temporarily unavailable. Please try again shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, noticeMessage]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const skillRecords = mockStorage.getUserSkills();
      const skills = skillRecords.map((skill) => skill.skillName);
      const experienceRecords = mockStorage.getExperience();
      const educationRecords = mockStorage.getEducation();
      const projectRecords = mockStorage.getProjects();
      const certificationRecords = mockStorage.getCertifications();
      const languageRecords = mockStorage.getLanguages();
      const applicationRecords = mockStorage.getApplications();
      const savedOpportunityIds = new Set(mockStorage.getSavedOpportunityIds());
      const allOpportunities = mockStorage.getOpportunities();
      const cv = mockStorage.getCV();
      const portfolio = mockStorage.getPortfolio();
      const availableOpportunities = allOpportunities
        .filter((opportunity) => opportunity.status === 'published')
        .slice(0, 20)
        .map(({ title, company, location, type, workMode, experienceLevel, deadline, salaryRange, description, requirements, tags }) => ({
          title: title.slice(0, 160), company: company.slice(0, 160), location: location.slice(0, 160),
          type, workMode, experienceLevel, deadline, salaryRange: salaryRange?.slice(0, 120),
          summary: description.slice(0, 400),
          requirements: requirements.slice(0, 5).map((item) => item.slice(0, 120)),
          tags: tags.slice(0, 8),
        }));
      const savedOpportunities = allOpportunities
        .filter((opportunity) => savedOpportunityIds.has(opportunity.id))
        .slice(0, 10)
        .map(({ title, company, location, type, deadline }) => ({
          title: title.slice(0, 160), company: company.slice(0, 160), location: location.slice(0, 160), type, deadline,
        }));

      // Share relevant career details for this chat, but omit profile contact
      // details, application notes, and account/authentication data.
      const careerContext = JSON.stringify({
        profile: {
          role: user?.role,
          headline: user?.headline?.slice(0, 300),
          bio: user?.bio?.slice(0, 800),
          location: user?.location?.slice(0, 160),
        },
        cv: { title: cv.title.slice(0, 160), summary: cv.content.summary.slice(0, 2000) },
        skills: skillRecords.slice(0, 30).map(({ skillName, category, proficiencyLevel, yearsOfExperience }) => ({
          name: skillName.slice(0, 100), category, proficiency: proficiencyLevel, years: yearsOfExperience,
        })),
        experience: experienceRecords.slice(0, 8).map(({ company, position, employmentType, location, startDate, endDate, isCurrent, description }) => ({
          company: company.slice(0, 160), position: position.slice(0, 160), type: employmentType,
          location: location.slice(0, 160), startDate, endDate, isCurrent, description: description.slice(0, 700),
        })),
        education: educationRecords.slice(0, 8).map(({ institution, degree, fieldOfStudy, startDate, endDate, isCurrent, grade, description }) => ({
          institution: institution.slice(0, 180), degree: degree.slice(0, 140), field: fieldOfStudy.slice(0, 140),
          startDate, endDate, isCurrent, grade: grade?.slice(0, 80), description: description?.slice(0, 500),
        })),
        projects: projectRecords.slice(0, 10).map(({ title, description, tags, isFeatured }) => ({
          title: title.slice(0, 160), description: description.slice(0, 700), tags: tags.slice(0, 10), isFeatured,
        })),
        certifications: certificationRecords.slice(0, 12).map(({ name, issuer, issueDate, expiryDate }) => ({
          name: name.slice(0, 160), issuer: issuer.slice(0, 160), issueDate, expiryDate,
        })),
        languages: languageRecords.slice(0, 12).map(({ name, proficiency }) => ({ name: name.slice(0, 80), proficiency })),
        applications: applicationRecords.slice(0, 12).map(({ company, position, stage, dateApplied, deadline, interviewDate, followUpDate }) => ({
          company: company.slice(0, 160), position: position.slice(0, 160), stage, dateApplied, deadline, interviewDate, followUpDate,
        })),
        portfolio: {
          headline: portfolio.headline.slice(0, 300),
          bio: portfolio.bio.slice(0, 800),
          published: portfolio.isPublished,
        },
        savedOpportunities,
        availableOpportunities,
      });
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
        careerContext,
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
    <div className="flex h-[calc(100dvh-13rem)] min-h-[420px] max-h-[820px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark sm:rounded-3xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80 sm:px-6 sm:py-4">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 text-brand-green-600 dark:bg-brand-green-500/20 dark:text-brand-green-400 sm:h-10 sm:w-10 sm:rounded-2xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
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
          className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Honest Status Banner when API Key is not set */}
      {!isAIConfigured && (
        <div className="px-6 py-3 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Preview Mode:</strong> Configure a server-side AI endpoint to enable live responses.
            </span>
          </div>
        </div>
      )}

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-white px-4 py-2.5 dark:border-slate-800/80 dark:bg-slate-900 sm:px-6 sm:py-3 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Quick Prompts:
        </span>
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.prompt)}
            className="shrink-0 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-green-500 hover:bg-brand-green-50 hover:text-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-green-300"
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/40 px-3 py-4 dark:bg-slate-950/20 sm:space-y-6 sm:p-6 lg:p-8">
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
              className={`mx-auto flex w-full max-w-4xl items-start gap-2.5 sm:gap-3.5 ${
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
                  className="h-8 w-8 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-slate-700 sm:h-9 sm:w-9"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green-500 text-white shadow-sm sm:h-9 sm:w-9">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`relative min-w-0 max-w-[calc(100%-2.75rem)] rounded-2xl p-3.5 text-[13px] leading-6 shadow-sm sm:max-w-[min(82%,42rem)] sm:p-5 sm:text-sm ${
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

                <div className="space-y-3 pr-6">{renderMessageText(msg.text)}</div>

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
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse"></span>
              <span>CareerLaunch AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI data use disclosure */}
      <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
        <details className="group">
          <summary className="cursor-pointer list-none text-[11px] font-medium text-slate-600 outline-none transition-colors hover:text-brand-blue-700 focus-visible:ring-2 focus-visible:ring-brand-green-500 dark:text-slate-300 dark:hover:text-brand-green-300">
            <HelpCircle className="mr-1 inline h-3 w-3" aria-hidden="true" />
            Your message and relevant career records are sent to Google Gemini
            <span className="ml-1 text-brand-blue-700 underline dark:text-brand-green-300">Details</span>
          </summary>
          <p className="mt-2 max-w-4xl text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Replies can use your saved profile, CV summary, skills, experience, education, projects, applications, and saved opportunities. Saved email/phone fields and application notes are not added automatically, but free-text records you wrote may contain personal details.
          </p>
        </details>
      </div>

      {/* Input Form Bar */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. 'How do I explain my industrial attachment in an interview?')..."
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:px-4"
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
