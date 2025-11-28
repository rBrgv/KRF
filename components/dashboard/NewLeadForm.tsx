'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NewLeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    source: 'manual',
    status: 'new',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/leads');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="premium-card rounded-2xl p-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Goal</label>
          <textarea
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          >
            <option value="manual">Manual</option>
            <option value="website">Website</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="not_interested">Not Interested</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10">
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-full border-2 border-gray-700 text-gray-300 font-semibold hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

