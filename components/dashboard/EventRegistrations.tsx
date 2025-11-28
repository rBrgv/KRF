'use client';

import { useState, useEffect } from 'react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Download } from 'lucide-react';

interface Registration {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  city: string | null;
  status: string;
  amount_in_inr: number;
  payment_mode: string | null;
  created_at: string;
}

interface EventRegistrationsProps {
  eventId: string;
}

export function EventRegistrations({ eventId }: EventRegistrationsProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/registrations`);
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'City', 'Status', 'Amount', 'Registered At'].join(','),
      ...registrations.map((reg) =>
        [
          `"${reg.name}"`,
          reg.email ? `"${reg.email}"` : '',
          `"${reg.phone}"`,
          reg.city ? `"${reg.city}"` : '',
          reg.status,
          reg.amount_in_inr,
          formatDateTime(reg.created_at),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleMarkPaidOffline = async (registrationId: string, amount: number) => {
    if (!confirm('Mark this registration as paid offline?')) return;

    setMarkingPaid(registrationId);
    try {
      const paymentMode = prompt('Payment mode (cash/gpay/other):', 'cash');
      if (!paymentMode || !['cash', 'gpay', 'other'].includes(paymentMode.toLowerCase())) {
        alert('Invalid payment mode');
        return;
      }

      const response = await fetch('/api/payments/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_registration_id: registrationId,
          payment_mode: paymentMode.toLowerCase(),
          amount_in_inr: amount,
        }),
      });

      if (response.ok) {
        fetchRegistrations();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to mark as paid');
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('An error occurred');
    } finally {
      setMarkingPaid(null);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading registrations...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Registrations</h2>
        {registrations.length > 0 && (
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <p className="text-gray-400">No registrations yet</p>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div key={reg.id} className="border-b border-gray-800 pb-3 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{reg.name}</p>
                  <p className="text-sm text-gray-400">
                    {reg.phone} {reg.email && `• ${reg.email}`}
                  </p>
                  {reg.city && <p className="text-sm text-gray-400">{reg.city}</p>}
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : reg.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : reg.status === 'payment_failed'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {reg.status}
                  </span>
                  {reg.amount_in_inr > 0 && (
                    <p className="text-sm font-semibold mt-1 text-white">₹{reg.amount_in_inr}</p>
                  )}
                  {reg.payment_mode && (
                    <p className="text-xs text-gray-400 mt-1">{reg.payment_mode}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {formatDate(reg.created_at)}
                </p>
                {reg.status === 'pending' && reg.amount_in_inr > 0 && (
                  <button
                    onClick={() => handleMarkPaidOffline(reg.id, reg.amount_in_inr)}
                    disabled={markingPaid === reg.id}
                    className="text-xs bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-colors"
                  >
                    {markingPaid === reg.id ? 'Processing...' : 'Mark Paid Offline'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

