'use client';

import { useState } from 'react';
import { ContactFormData } from '@/src/types';
import { saveContact } from '@/src/lib/firebase';
import { sendEmail } from '@/src/lib/emailjs';
import { personalInfo } from '@/src/config/site';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Sending...');

    try {
      // Save to Firebase
      await saveContact(formData);
      
      // Send email
      await sendEmail({
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: personalInfo.email
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="section-padding bg-card">
      <div className="container-custom max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-12 text-center relative inline-block">
          Contact Me
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2" />
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 rounded-lg shadow-lg">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-3 border-b-2 border-border bg-transparent focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-3 border-b-2 border-border bg-transparent focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
            />
          </div>
          
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-3 border-b-2 border-border bg-transparent focus:border-primary focus:outline-none transition-colors resize-vertical disabled:opacity-50"
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          
          {message && (
            <div className={`p-4 rounded-lg text-center ${
              status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}