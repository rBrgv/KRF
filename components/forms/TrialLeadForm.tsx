'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, CheckCircle, ArrowRight } from 'lucide-react';

interface TrialLeadFormProps {
  onSuccess: (leadId: string) => void;
  className?: string;
}

export function TrialLeadForm({ onSuccess, className }: TrialLeadFormProps) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          goal: formData.goal.trim() || null,
          source: '11-day-trial',
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
          utm_content: formData.utm_content || null,
          referrer: formData.referrer || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit. Please try again.');
      }

      const data = await response.json();
      onSuccess(data.data.id);
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`premium-card rounded-2xl p-8 md:p-12 max-w-2xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
          <Download className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Get Your Free Guide
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          Fill in your details below to instantly access your <span className="text-red-400 font-semibold">11-Day Mindset + Fitness Trial Guide</span>. 
          Start your transformation journey today!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.phone ? 'border-red-500' : 'border-gray-700'
            } bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none`}
            placeholder="+91 XXXXX XXXXX"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-semibold text-gray-300 mb-2">
            What's Your Main Goal?
          </label>
          <textarea
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none"
            placeholder="e.g., Lose weight, build muscle, improve energy, get started with fitness..."
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
          className="group relative w-full rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 text-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Get My Free Guide
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting, you agree to receive communication from KR Fitness. 
          We respect your privacy and will never spam you.
        </p>
      </form>
    </div>
  );
}

