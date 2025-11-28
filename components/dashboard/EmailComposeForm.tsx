'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Calendar, Send, Clock, User, FileText } from 'lucide-react';
import { DEFAULT_EMAIL_TEMPLATES, EmailTemplate, replaceTemplateVariables } from '@/lib/email-templates';

interface EmailComposeFormProps {
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
}

export function EmailComposeForm({
  clientId,
  clientName,
  clientEmail,
  onClose,
  onSuccess,
}: EmailComposeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(clientId || '');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    scheduled_date: '',
    scheduled_time: '',
  });

  // Fetch clients if no clientId provided
  useEffect(() => {
    if (!clientId) {
      fetch('/api/clients?limit=100')
        .then((res) => res.json())
        .then((data) => {
          setClients(data.data || []);
        })
        .catch(console.error);
    }
  }, [clientId]);

  // Update selected client when clientId changes
  useEffect(() => {
    if (selectedClientId && clients.length > 0) {
      const client = clients.find((c) => c.id === selectedClientId);
      setSelectedClient(client || null);
    } else if (clientId && clientName && clientEmail) {
      setSelectedClient({
        id: clientId,
        name: clientName,
        email: clientEmail,
        phone: '',
      });
    }
  }, [selectedClientId, clients, clientId, clientName, clientEmail]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === '') {
      return;
    }

    const template = DEFAULT_EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const clientName = selectedClient?.name || clientName || '{{name}}';
    
    // Replace template variables
    const variables: Record<string, string> = {
      name: clientName,
    };

    const subject = replaceTemplateVariables(template.subject, variables);
    const body = replaceTemplateVariables(template.body, variables);

    setFormData({
      ...formData,
      subject,
      body,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalClientId = clientId || selectedClientId;
    
    if (!finalClientId) {
      alert('Please select a client');
      return;
    }

    if (!formData.subject.trim() || !formData.body.trim()) {
      alert('Subject and body are required');
      return;
    }

    setIsSubmitting(true);

    try {
      let scheduledAt: string | null = null;
      
      if (sendMode === 'schedule') {
        if (!formData.scheduled_date || !formData.scheduled_time) {
          alert('Please select both date and time for scheduled send');
          setIsSubmitting(false);
          return;
        }
        scheduledAt = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      }

      const response = await fetch('/api/notifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: finalClientId,
          subject: formData.subject,
          body: formData.body,
          scheduled_at: scheduledAt,
          type: 'general',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.details 
          ? `${result.error}: ${result.details}` 
          : result.error || 'Failed to send email';
        throw new Error(errorMsg);
      }

      alert(sendMode === 'now' ? 'Email sent successfully!' : 'Email scheduled successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error sending email:', error);
      alert(error.message || 'Failed to send email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compose Email</h2>
              {clientId ? (
                <>
                  {clientName && (
                    <p className="text-sm text-gray-400">To: {clientName}</p>
                  )}
                  {clientEmail && (
                    <p className="text-xs text-gray-500">{clientEmail}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Select a client to send email</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Selector (if no clientId provided) */}
          {!clientId && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Select Client *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a client...</option>
                {clients
                  .filter((c) => c.email) // Only show clients with email
                  .map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email} ({client.phone})
                    </option>
                  ))}
              </select>
              {selectedClient && (
                <p className="text-xs text-gray-400 mt-1">
                  Email will be sent to: {selectedClient.email}
                </p>
              )}
            </div>
          )}

          {/* Email Template Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Email Template (Optional)
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Start from scratch</option>
              {DEFAULT_EMAIL_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {selectedTemplateId && (
              <p className="text-xs text-gray-400 mt-1">
                Template loaded. You can edit the subject and message before sending.
              </p>
            )}
          </div>

          {/* Send Mode Toggle */}
          <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <button
              type="button"
              onClick={() => setSendMode('now')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sendMode === 'now'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Send className="w-4 h-4" />
              Send Now
            </button>
            <button
              type="button"
              onClick={() => setSendMode('schedule')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sendMode === 'schedule'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
          </div>

          {/* Scheduled Date/Time */}
          {sendMode === 'schedule' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required={sendMode === 'schedule'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  required={sendMode === 'schedule'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Email subject"
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Type your message here..."
              rows={10}
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {sendMode === 'now' ? 'Sending...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  {sendMode === 'now' ? (
                    <>
                      <Send className="w-4 h-4" />
                      Send Email
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule Email
                    </>
                  )}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

