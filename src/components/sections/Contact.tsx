'use client';

import { useState } from 'react';
import { ContactFormData } from '@/types';
import { saveContact } from '@/lib/firebase';
import { sendEmail } from '@/lib/emailjs';
import { personalInfo } from '@/config/site';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Sending...');

    try {
      await saveContact(formData);
      await sendEmail({
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: personalInfo.email,
      });

      setStatus('success');
      setMessage('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setMessage('Failed to send message. Please try again.');
    }

    setTimeout(() => {
      setMessage('');
      setStatus('idle');
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full name', label: '01 — Name' },
    { name: 'email', type: 'email', placeholder: 'you@example.com', label: '02 — Email' },
  ] as const;

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden bg-[#0e0e0e]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Background ruled lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(255,255,255,0.5) 39px,
            rgba(255,255,255,0.5) 40px
          )`,
        }}
      />

      {/* Ambient glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20 flex items-end gap-6">
          <div>
            <p
              className="text-amber-500 text-xs uppercase mb-3"
              style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.35em' }}
            >
              Get in touch
            </p>
            <h2
              className="text-white leading-none"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              Contact Me
            </h2>
          </div>
          <div className="mb-4 hidden md:block flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
          {/* Left: side note */}
          <aside className="md:col-span-2 flex flex-col justify-between">
            <div>
              <p
                className="text-white/40 text-sm leading-relaxed mb-8"
                style={{ fontStyle: 'italic' }}
              >
                Have a project in mind, a question, or just want to say hello? Fill out the form and I&apos;ll get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                <div>
                  <p
                    className="text-amber-500/60 text-[10px] uppercase tracking-[0.25em] mb-1"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    Email
                  </p>
                  <p className="text-white/70 text-sm" style={{ fontStyle: 'italic' }}>
                    {personalInfo.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative editorial mark */}
            <p
              className="hidden md:block text-white/[0.04] select-none leading-none mt-12"
              aria-hidden="true"
              style={{ fontSize: '10rem', fontStyle: 'italic' }}
            >
              ✉
            </p>
          </aside>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-10">
            {fields.map(({ name, type, placeholder, label }) => (
              <div key={name} className="group relative">
                <label
                  htmlFor={name}
                  className="block text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3 group-focus-within:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {label}
                </label>
                <input
                  id={name}
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-transparent border-0 border-b border-white/10 pb-3 text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-500 transition-colors duration-300 disabled:opacity-40"
                  style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '1rem' }}
                />
              </div>
            ))}

            {/* Message */}
            <div className="group relative">
              <label
                htmlFor="message"
                className="block text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3 group-focus-within:text-amber-500 transition-colors duration-300"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                03 — Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me what's on your mind..."
                rows={5}
                required
                disabled={status === 'loading'}
                className="w-full bg-transparent border-0 border-b border-white/10 pb-3 text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-500 transition-colors duration-300 resize-none disabled:opacity-40"
                style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '1rem' }}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-6 pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group/btn relative inline-flex items-center gap-3 border border-amber-500/40 text-amber-500 px-8 py-3 text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:border-amber-500 hover:text-[#0e0e0e] disabled:opacity-40"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {/* Fill on hover */}
                <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative">
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </span>
                <span className="relative text-lg leading-none">→</span>
              </button>

              {/* Status feedback */}
              {message && (
                <p
                  className={`text-sm transition-opacity duration-300 ${
                    status === 'success'
                      ? 'text-amber-400'
                      : status === 'error'
                      ? 'text-red-400'
                      : 'text-white/40'
                  }`}
                  style={{ fontStyle: 'italic' }}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}