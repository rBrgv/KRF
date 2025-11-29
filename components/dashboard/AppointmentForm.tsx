'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTimeSlotsForDate, calculateEndTime, isValidTimeSlot, formatTimeForDisplay } from '@/lib/booking-slots';

interface AppointmentFormProps {
  appointment?: any;
  clientId?: string;
}

export function AppointmentForm({ appointment, clientId: initialClientId }: AppointmentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('client_id');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    client_id: appointment?.client_id || initialClientId || clientIdParam || '',
    title: appointment?.title || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    start_time: appointment?.start_time || '',
    end_time: appointment?.end_time || '',
    type: appointment?.type || 'studio',
    notes: appointment?.notes || '',
  });

  useEffect(() => {
    // Fetch clients for dropdown
    fetch('/api/clients?limit=100')
      .then((res) => res.json())
      .then((data) => setClients(data.data || []))
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = appointment
        ? `/api/appointments/${appointment.id}`
        : '/api/appointments';
      const method = appointment ? 'PATCH' : 'POST';

      const payload = {
        ...formData,
        client_id: formData.client_id || null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/dashboard/appointments');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save appointment');
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
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
            Client (Optional)
          </label>
          <select
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          >
            <option value="">No client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.phone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            placeholder="e.g., Studio session, Consultation"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="studio">Studio</option>
              <option value="online">Online</option>
              <option value="consultation">Consultation</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Time * (20 min slots only)
            </label>
            <select
              name="start_time"
              value={formData.start_time}
              onChange={(e) => {
                const newStartTime = e.target.value;
                setFormData({
                  ...formData,
                  start_time: newStartTime,
                  end_time: newStartTime ? calculateEndTime(newStartTime) : '',
                });
              }}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="">Select time slot</option>
              {formData.date && getTimeSlotsForDate(formData.date).map((time) => (
                <option key={time} value={time}>
                  {formatTimeForDisplay(time)}
                </option>
              ))}
            </select>
            {formData.date && formData.start_time && !isValidTimeSlot(formData.date, formData.start_time) && (
              <p className="mt-1 text-sm text-red-400">Please select a valid time slot for this day</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Time (auto-calculated)
            </label>
            <input
              type="text"
              value={formData.end_time || (formData.start_time ? calculateEndTime(formData.start_time) : '')}
              readOnly
              className="w-full px-4 py-3 bg-gray-900/30 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10">
              {isSubmitting ? 'Saving...' : appointment ? 'Update' : 'Create'} Appointment
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

