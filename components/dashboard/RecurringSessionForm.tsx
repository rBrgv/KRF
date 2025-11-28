'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, X } from 'lucide-react';

interface RecurringSession {
  id?: string;
  client_id: string;
  days_of_week: number[];
  start_time: string;
  duration_minutes: number;
  title: string | null;
  notes: string | null;
  is_active: boolean;
}

interface RecurringSessionFormProps {
  clientId: string;
  session?: RecurringSession;
  onClose: () => void;
}

const DAYS = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

export function RecurringSessionForm({ clientId, session, onClose }: RecurringSessionFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    days_of_week: session?.days_of_week || [],
    start_time: session?.start_time || '09:00',
    duration_minutes: session?.duration_minutes || 60,
    title: session?.title || '',
    notes: session?.notes || '',
    is_active: session?.is_active ?? true,
  });

  const toggleDay = (day: number) => {
    setFormData({
      ...formData,
      days_of_week: formData.days_of_week.includes(day)
        ? formData.days_of_week.filter(d => d !== day)
        : [...formData.days_of_week, day].sort(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.days_of_week.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }

    setIsSaving(true);
    try {
      const url = session?.id 
        ? `/api/recurring-sessions/${session.id}`
        : '/api/recurring-sessions';
      
      const method = session?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          days_of_week: formData.days_of_week,
          start_time: formData.start_time,
          duration_minutes: formData.duration_minutes,
          title: formData.title || null,
          notes: formData.notes || null,
          is_active: formData.is_active,
        }),
      });

      if (response.ok) {
        router.refresh();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save recurring session');
      }
    } catch (error) {
      console.error('Error saving recurring session:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateEndTime = () => {
    const [hours, minutes] = formData.start_time.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + formData.duration_minutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="premium-card rounded-2xl p-8 max-w-2xl w-full border border-gray-800/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {session?.id ? 'Edit Recurring Session' : 'Add Recurring Session'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Days of Week *
            </label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.days_of_week.includes(day.value)
                      ? 'bg-red-600 text-white border-2 border-red-500'
                      : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            {formData.days_of_week.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Selected: {formData.days_of_week.map(d => DAYS[d].label).join(', ')}
              </p>
            )}
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Start Time *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="15"
                max="480"
                step="15"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {formData.start_time && (
                <p className="text-xs text-gray-400 mt-1">
                  Ends at: {calculateEndTime()}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Personal Training Session"
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this session..."
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-900/50 border-gray-700 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">
              Active (sessions will be generated for this schedule)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || formData.days_of_week.length === 0}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : session?.id ? 'Update' : 'Create Session'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




