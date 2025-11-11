'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={status === 'loading'} className="w-full">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>

      {/* Status Messages */}
      {status === 'success' && (
        <p className="text-green-500 text-sm">Message sent successfully! I&apos;ll get back to you soon.</p>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Failed to send message. Please try again or email me directly.
        </p>
      )}
    </form>
  );
}
