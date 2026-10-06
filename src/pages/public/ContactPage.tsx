import React, { useState } from 'react';
import { Mail, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/Input';
import { Footer } from '../../components/layout/Footer';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:support@careerlaunch.co.ke?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            We’d Love to Hear From You
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Have a question about CareerLaunch, its career tools, or an opportunity listing? Send a note to the team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Inquiries</h4>
                  <a className="text-sm font-semibold text-slate-900 hover:underline dark:text-white" href="mailto:support@careerlaunch.co.ke">support@careerlaunch.co.ke</a>
                  <p className="text-xs text-slate-500">partnerships@careerlaunch.co.ke</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-brand-blue-900 text-white space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-green-400" />
                Looking for Talent?
              </h4>
              <p className="text-xs text-brand-blue-200 leading-relaxed">
                Employer matching and candidate-directory tools are not available in this release. Contact us to discuss future integrations.
              </p>
            </Card>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-green-100 text-brand-green-600 flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your email draft is ready</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Your email app should open with this message addressed to support. The team won’t receive it until you send it there.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Send Us a Message
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Full Name"
                      required
                      placeholder="e.g. Teddy Mwangi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="e.g. teddy@uonbi.ac.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Subject"
                    required
                    placeholder="e.g. University Attachment Inquiry / Employer Partnership"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />

                  <Textarea
                    label="Your Message"
                    required
                    rows={5}
                    placeholder="Tell us about your needs, institution, or project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />}>
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

