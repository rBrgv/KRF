'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

const leadUpdateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type LeadUpdateData = z.infer<typeof leadUpdateSchema>;

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  status: string;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  referrer: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  converted_at: string | null;
  converted_to_client_id: string | null;
}

interface LeadDetailProps {
  lead: Lead;
}

export function LeadDetail({ lead }: LeadDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadUpdateData>({
    resolver: zodResolver(leadUpdateSchema),
    defaultValues: {
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone,
      status: lead.status as any,
      source: lead.source || '',
      notes: lead.notes || '',
    },
  });

  const onSubmit = async (data: LeadUpdateData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.refresh();
        setIsEditing(false);
      } else {
        alert('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/leads"
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Leads
        </Link>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              {...register('phone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              {...register('source')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">{lead.name}</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Phone:</span> {lead.phone}
                </p>
                {lead.email && (
                  <p>
                    <span className="font-semibold">Email:</span> {lead.email}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-sm ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </p>
                {lead.source && (
                  <p>
                    <span className="font-semibold">Source:</span> {lead.source}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">UTM Tracking</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {lead.utm_source && <p>Source: {lead.utm_source}</p>}
                {lead.utm_medium && <p>Medium: {lead.utm_medium}</p>}
                {lead.utm_campaign && <p>Campaign: {lead.utm_campaign}</p>}
                {lead.utm_content && <p>Content: {lead.utm_content}</p>}
                {lead.referrer && <p>Referrer: {lead.referrer}</p>}
              </div>
            </div>
          </div>
          {lead.notes && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
          <div className="text-sm text-gray-500">
            <p>Created: {formatDateTime(lead.created_at)}</p>
            <p>Updated: {formatDateTime(lead.updated_at)}</p>
            {lead.converted_at && (
              <p>Converted: {formatDateTime(lead.converted_at)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

