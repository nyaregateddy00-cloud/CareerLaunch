import React, { useEffect, useState } from 'react';
import { Brain, CheckCircle2, Clock3, MessageSquareText, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Textarea } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../lib/aiService';
import { mockStorage } from '../../lib/mockStorage';
import { InterviewPracticeSession } from '../../types';

const QUESTIONS = [
  { group: 'Behavioral', prompt: 'Tell me about a project or responsibility you are proud of. What was your contribution, and what did you learn?' },
  { group: 'Problem solving', prompt: 'Describe a difficult problem you faced while learning or working. How did you investigate and address it?' },
  { group: 'Teamwork', prompt: 'Tell me about a time you worked with someone who had a different approach from yours. How did you work together?' },
  { group: 'Role readiness', prompt: 'What skills or experience would you bring to the role you are pursuing, and where are you still learning?' },
];

export const InterviewArenaPage: React.FC = () => {
  const { user } = useAuth();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessions, setSessions] = useState(() => mockStorage.getInterviewSessions());
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const question = QUESTIONS[questionIndex];

  useEffect(() => {
    let active = true;
    aiService.checkAvailability().then((available) => { if (active) setAiAvailable(available); });
    return () => { active = false; };
  }, []);

  const getFeedback = async () => {
    if (!answer.trim() || busy) return;
    setBusy(true);
    setFeedback('');
    setError('');
    const skills = mockStorage.getUserSkills().filter((item) => item.userId === user?.id).map((item) => item.skillName);
    const result = await aiService.sendMessage(
      `Give specific, supportive interview practice feedback for this question and answer. Identify what was clear, what evidence or detail is missing, and one concrete way to improve. Do not invent achievements or rewrite facts.\n\nQuestion: ${question.prompt}\n\nMy answer:\n${answer.trim()}`,
      [], 'interview_prep', mockStorage.getPreferences().shareCareerContext ? { fullName: user?.fullName, headline: user?.headline, skills } : undefined,
    );
    setBusy(false);
    if (!result.success) { setError(result.error || 'AI feedback is unavailable. Your answer is still here; try again later.'); return; }

    const session: InterviewPracticeSession = {
      id: crypto.randomUUID(), question: question.prompt, answer: answer.trim(), feedback: result.content,
      createdAt: new Date().toISOString(),
    };
    mockStorage.saveInterviewSession(session);
    setSessions(mockStorage.getInterviewSessions());
    setFeedback(result.content);
  };

  const nextQuestion = () => {
    setQuestionIndex((index) => (index + 1) % QUESTIONS.length);
    setAnswer(''); setFeedback(''); setError('');
  };

  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader title="Interview Arena" subtitle="Practice with role-neutral questions, then get feedback from CareerLaunch Coach when AI is configured." breadcrumbs={[{ label: 'Interview Arena' }]} badge={<Badge variant="blue" size="sm">Practice</Badge>} />
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
      <Card className="space-y-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><Badge variant="green">{question.group}</Badge><span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />Take your time; this practice is not timed</span></div>
        <h2 className="text-lg font-extrabold leading-7 text-slate-900 dark:text-white">{question.prompt}</h2>
        <Textarea label="Your answer" rows={8} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Use specific examples. You can edit your answer before requesting feedback." />
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={getFeedback} disabled={busy || !answer.trim()} leftIcon={<Brain className="h-4 w-4" />}>{busy ? 'Reviewing your answer…' : 'Get AI feedback'}</Button><Button variant="secondary" onClick={nextQuestion} leftIcon={<RotateCcw className="h-4 w-4" />}>Try another question</Button></div>
        {feedback && <div className="rounded-xl border border-brand-green-200 bg-brand-green-50 p-4 text-sm leading-6 text-slate-800 dark:border-brand-green-900 dark:bg-brand-green-950/40 dark:text-slate-100"><div className="mb-2 flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-brand-green-600" />Coach feedback</div><p className="whitespace-pre-line">{feedback}</p></div>}
        {aiAvailable === false && <p className="text-xs text-slate-500">AI feedback is unavailable until server-side provider settings are configured. You can still practice with these prompts.</p>}
      </Card>
      <Card className="p-5 sm:p-6"><div className="flex items-center gap-2"><MessageSquareText className="h-5 w-5 text-brand-blue-700 dark:text-brand-green-400" /><h2 className="font-bold text-slate-900 dark:text-white">Practice history</h2></div><p className="mt-1 text-xs text-slate-500">Saved to your private CareerLaunch workspace.</p>
        {sessions.length ? <ul className="mt-4 space-y-3">{sessions.map((session) => <li key={session.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><p className="line-clamp-3 text-xs font-semibold text-slate-800 dark:text-slate-100">{session.question}</p><p className="mt-1 text-[11px] text-slate-500">{new Date(session.createdAt).toLocaleDateString()}</p></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Your completed practice sessions will appear here.</p>}
      </Card>
    </div>
  </div>;
};
