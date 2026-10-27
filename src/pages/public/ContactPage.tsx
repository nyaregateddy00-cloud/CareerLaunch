import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Have questions about student accounts, university partnerships, or employer listings? Reach out to our team in Nairobi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Westlands, Nairobi, Kenya</p>
                  <p className="text-xs text-slate-500">The Mirage Towers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">support@careerlaunch.co.ke</p>
                  <p className="text-xs text-slate-500">partnerships@careerlaunch.co.ke</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Office Hours</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">+254 700 123 456</p>
                  <p className="text-xs text-slate-500">Mon - Fri: 8:00 AM - 5:00 PM EAT</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-brand-blue-900 text-white space-y-2 dark:bg-[#0c1a30] dark:border-white/10">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-green-400" />
                Partner With Us
              </h4>
              <p className="text-xs text-brand-blue-100 dark:text-slate-300 leading-relaxed">
                Connect directly with qualified university attachments and verified graduate candidates for your engineering and technical teams.
              </p>
            </Card>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <Card className="p-7 sm:p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-green-100 dark:bg-brand-green-950/60 text-brand-green-700 dark:text-brand-green-400 flex items-center justify-center mx-auto font-bold text-lg">✓</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Prepared</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Your email client should open with your message addressed to our support desk.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Send Us an Inquiry</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Your Full Name" required placeholder="e.g. Teddy Mwangi" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="Email Address" type="email" required placeholder="e.g. teddy@uonbi.ac.ke" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <Input label="Subject" required placeholder="e.g. University Attachment / Employer Listing Inquiry" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  <Textarea label="Your Message" required rows={5} placeholder="Tell us how we can assist you..." value={message} onChange={(e) => setMessage(e.target.value)} />
                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />}>Send Message</Button>
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
