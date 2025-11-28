'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface LeadFormProps {
  source?: string;
  className?: string;
}

export function LeadForm({ source = 'website', className }: LeadFormProps) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    referrer: '',
  });

  useEffect(() => {
    // Read UTM parameters from URL
    const utmSource = searchParams.get('utm_source') || '';
    const utmMedium = searchParams.get('utm_medium') || '';
    const utmCampaign = searchParams.get('utm_campaign') || '';
    const utmContent = searchParams.get('utm_content') || '';
    
    // Read referrer
    const referrer = typeof window !== 'undefined' ? document.referrer : '';

    setFormData((prev) => ({
      ...prev,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      referrer: referrer,
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          goal: formData.goal || null,
          source: source,
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
          utm_content: formData.utm_content || null,
          referrer: formData.referrer || null,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          goal: '',
          utm_source: '',
          utm_medium: '',
          utm_campaign: '',
          utm_content: '',
          referrer: '',
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`premium-card border-green-500/30 bg-green-500/10 rounded-xl p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">✅</div>
        <p className="text-green-400 font-semibold text-lg">
          Thank you! We'll contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
          Phone *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-semibold text-gray-300 mb-2">
          Fitness Goal
        </label>
        <textarea
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none"
          placeholder="Tell us about your fitness goals..."
        />
      </div>

      {/* Hidden fields for UTM tracking */}
      <input type="hidden" name="utm_source" value={formData.utm_source} />
      <input type="hidden" name="utm_medium" value={formData.utm_medium} />
      <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
      <input type="hidden" name="utm_content" value={formData.utm_content} />
      <input type="hidden" name="referrer" value={formData.referrer} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]"
      >
        <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </form>
  );
}
