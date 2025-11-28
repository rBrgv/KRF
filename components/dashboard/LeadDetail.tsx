'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { X, Mail } from 'lucide-react';
import { LeadEmailForm } from './LeadEmailForm';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  goal: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  referrer: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadDetailProps {
  lead: Lead;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  converted: 'bg-green-500/20 text-green-400 border border-green-500/30',
  not_interested: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

export function LeadDetail({ lead }: LeadDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [replyTemplates, setReplyTemplates] = useState<any>(null);
  const [rawNotes, setRawNotes] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    status: lead.status,
    notes: lead.notes || '',
  });
  const [convertFormData, setConvertFormData] = useState({
    subscription_type: '',
    program_type: '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh();
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAISummarize = async () => {
    if (!rawNotes.trim()) {
      alert('Please enter notes to summarize');
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch('/api/ai/summarize-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes }),
      });

      if (response.ok) {
        const summary = await response.json();
        setAiSummary(summary);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error summarizing:', error);
      alert('An error occurred');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateReplies = async () => {
    setIsGeneratingReplies(true);
    try {
      const leadContext = `Lead: ${lead.name}, Phone: ${lead.phone}, Status: ${lead.status}, Goal: ${lead.goal || 'Not specified'}, Notes: ${lead.notes || 'No notes'}`;

      const response = await fetch('/api/ai/reply-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadContext,
          tone: 'friendly',
        }),
      });

      if (response.ok) {
        const templates = await response.json();
        setReplyTemplates(templates);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate replies');
      }
    } catch (error) {
      console.error('Error generating replies:', error);
      alert('An error occurred');
    } finally {
      setIsGeneratingReplies(false);
    }
  };

  const handleConvertToClient = async () => {
    setIsConverting(true);
    try {
      // Create client
      const clientResponse = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          goal: lead.goal,
          subscription_type: convertFormData.subscription_type || null,
          program_type: convertFormData.program_type || null,
        }),
      });

      if (clientResponse.ok) {
        const { data: client } = await clientResponse.json();
        router.push(`/dashboard/clients/${client.id}`);
      } else {
        const error = await clientResponse.json();
        alert(error.error || 'Failed to convert lead');
        setIsConverting(false);
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('An error occurred');
      setIsConverting(false);
    }
  };

  return (
    <div className="p-8">
      <Link
        href="/dashboard/leads"
        className="text-gray-400 hover:text-red-400 mb-6 inline-block transition-colors"
      >
        ← Back to Leads
      </Link>

      <div className="premium-card rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">{lead.name}</h1>
          <div className="flex gap-3">
            {lead.email && (
              <button
                onClick={() => setShowEmailForm(true)}
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            )}
            {lead.status !== 'converted' && (
              <button
                onClick={() => setShowConvertModal(true)}
                disabled={isConverting}
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">
                  Convert to Client
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            )}
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isSaving}
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {isEditing ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="premium-card rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="font-semibold text-white">Phone:</span> <span className="text-gray-300">{lead.phone}</span>
              </p>
              {lead.email && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Email:</span> <span className="text-gray-300">{lead.email}</span>
                </p>
              )}
              <p className="text-gray-300">
                <span className="font-semibold text-white">Status:</span>{' '}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}
                >
                  {lead.status}
                </span>
              </p>
              {lead.source && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Source:</span> <span className="text-gray-300">{lead.source}</span>
                </p>
              )}
              {lead.goal && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Goal:</span> <span className="text-gray-300">{lead.goal}</span>
                </p>
              )}
            </div>
          </div>

          <div className="premium-card rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-semibold mb-4 text-white">UTM Tracking</h2>
            <div className="space-y-2 text-sm text-gray-400">
              {lead.utm_source && <p><span className="text-white font-semibold">Source:</span> {lead.utm_source}</p>}
              {lead.utm_medium && <p><span className="text-white font-semibold">Medium:</span> {lead.utm_medium}</p>}
              {lead.utm_campaign && <p><span className="text-white font-semibold">Campaign:</span> {lead.utm_campaign}</p>}
              {lead.utm_content && <p><span className="text-white font-semibold">Content:</span> {lead.utm_content}</p>}
              {lead.referrer && <p><span className="text-white font-semibold">Referrer:</span> {lead.referrer}</p>}
              {!lead.utm_source && !lead.utm_medium && !lead.referrer && (
                <p className="text-gray-500">No UTM data</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 premium-card rounded-xl p-6 border border-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-white">Status</h2>
          {isEditing ? (
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="not_interested">Not Interested</option>
            </select>
          ) : (
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}
            >
              {lead.status}
            </span>
          )}
        </div>

        <div className="mb-8 premium-card rounded-xl p-6 border border-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-white">Notes</h2>
          {isEditing ? (
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
            />
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">
              {lead.notes || <span className="text-gray-500">No notes</span>}
            </p>
          )}
        </div>

        {/* AI Summarizer */}
        <div className="mb-8 premium-card rounded-xl p-6 border border-blue-500/30">
          <h2 className="text-xl font-semibold mb-4 text-white">AI Lead Notes Summarizer</h2>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            rows={4}
            placeholder="Enter raw notes about this lead..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-4 resize-none"
          />
          <button
            onClick={handleAISummarize}
            disabled={isSummarizing || !rawNotes.trim()}
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10">
              {isSummarizing ? 'Summarizing...' : 'AI Summarize'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          {aiSummary && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-white">Summary</h3>
                <p className="text-sm text-gray-300">{aiSummary.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Challenges</h3>
                <p className="text-sm text-gray-300">{aiSummary.challenges}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Motivation</h3>
                <p className="text-sm text-gray-300">{aiSummary.motivation}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">
                  Likelihood Score: <span className="text-blue-400">{aiSummary.likelihoodScore}/10</span>
                </h3>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Suggested Next Steps</h3>
                <p className="text-sm text-gray-300">{aiSummary.suggestedNextSteps}</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Reply Helper */}
        <div className="mb-8 premium-card rounded-xl p-6 border border-green-500/30">
          <h2 className="text-xl font-semibold mb-4 text-white">AI Reply Helper</h2>
          <button
            onClick={handleGenerateReplies}
            disabled={isGeneratingReplies}
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-6"
          >
            <span className="relative z-10">
              {isGeneratingReplies ? 'Generating...' : 'Generate Replies'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          {replyTemplates && (
            <div className="space-y-6">
              {replyTemplates.whatsappTemplates && (
                <div>
                  <h3 className="font-semibold mb-3 text-white">WhatsApp Templates</h3>
                  <div className="space-y-3">
                    {replyTemplates.whatsappTemplates.map((template: string, idx: number) => (
                      <div key={idx} className="premium-card rounded-xl p-4 border border-gray-800/50">
                        <p className="text-sm whitespace-pre-wrap text-gray-300 mb-3">{template}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(template)}
                          className="text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {replyTemplates.emailTemplates && (
                <div>
                  <h3 className="font-semibold mb-3 text-white">Email Templates</h3>
                  <div className="space-y-3">
                    {replyTemplates.emailTemplates.map((template: string, idx: number) => (
                      <div key={idx} className="premium-card rounded-xl p-4 border border-gray-800/50">
                        <p className="text-sm whitespace-pre-wrap text-gray-300 mb-3">{template}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(template)}
                          className="text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 border-t border-gray-800 pt-6">
          <p>Created: {formatDateTime(lead.created_at)}</p>
          <p>Updated: {formatDateTime(lead.updated_at)}</p>
        </div>
      </div>

      {/* Convert to Client Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="premium-card rounded-2xl p-8 max-w-md w-full border border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Convert to Client</h2>
              <button
                onClick={() => setShowConvertModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-400 mb-6">
              Set the program and subscription for this client (optional):
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Program Type
                </label>
                <select
                  value={convertFormData.program_type}
                  onChange={(e) => setConvertFormData({ ...convertFormData, program_type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Program (Optional)</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="weight_gain">Weight Gain</option>
                  <option value="strength_conditioning">Strength & Conditioning</option>
                  <option value="medical_condition">Medical Condition</option>
                  <option value="rehab">Rehabilitation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subscription Type
                </label>
                <select
                  value={convertFormData.subscription_type}
                  onChange={(e) => setConvertFormData({ ...convertFormData, subscription_type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Subscription (Optional)</option>
                  <option value="3_month">3 Month</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConvertToClient}
                disabled={isConverting}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
              >
                {isConverting ? 'Converting...' : 'Convert'}
              </button>
              <button
                onClick={() => {
                  setShowConvertModal(false);
                  setConvertFormData({ subscription_type: '', program_type: '' });
                }}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Form Modal */}
      {showEmailForm && lead.email && (
        <LeadEmailForm
          leadId={lead.id}
          leadName={lead.name}
          leadEmail={lead.email}
          onClose={() => setShowEmailForm(false)}
          onSuccess={() => {
            setShowEmailForm(false);
          }}
        />
      )}
    </div>
  );
}

