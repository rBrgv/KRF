'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Calendar, Send, Clock, User } from 'lucide-react';

interface WhatsAppComposeFormProps {
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Client {
  id: string;
  name: string;
  phone: string | null;
}

export function WhatsAppComposeForm({
  clientId,
  clientName,
  clientPhone,
  onClose,
  onSuccess,
}: WhatsAppComposeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(clientId || '');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [useTemplate, setUseTemplate] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    scheduled_date: '',
    scheduled_time: '',
  });

  // WhatsApp templates (you can expand this later)
  const whatsappTemplates = [
    {
      id: 'hello_world',
      name: 'Hello World (Test Template)',
      message: 'Hello! This is a test message from KR Fitness.',
    },
  ];

  // Fetch clients if no clientId provided
  useEffect(() => {
    if (!clientId) {
      setIsLoadingClients(true);
      fetch('/api/clients?limit=100')
        .then((res) => {
          console.log('API Response status:', res.status, res.statusText);
          if (!res.ok) {
            console.error('API returned error status:', res.status);
            return res.json().then((errorData) => {
              console.error('Error response data:', errorData);
              throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log('Raw API response:', data);
          
          // Handle API response structure: { success: true, data: [...] }
          let clientsList: Client[] = [];
          
          if (data && data.success && data.data && Array.isArray(data.data)) {
            clientsList = data.data;
            console.log('Found clients in data.data:', clientsList.length);
          } else if (data && data.data && Array.isArray(data.data)) {
            clientsList = data.data;
            console.log('Found clients in data.data (no success flag):', clientsList.length);
          } else if (Array.isArray(data)) {
            clientsList = data;
            console.log('Response is direct array:', clientsList.length);
          } else {
            console.error('Unexpected response structure:', data);
            console.error('Response keys:', Object.keys(data || {}));
          }
          
          // Ensure it's always an array
          if (!Array.isArray(clientsList)) {
            console.error('Clients data is not an array:', clientsList);
            console.error('Type:', typeof clientsList);
            clientsList = [];
          }
          
          console.log('Fetched clients:', clientsList.length, 'clients');
          console.log('Full clients data:', clientsList);
          
          // Debug: Log all clients and their phone numbers
          if (clientsList.length > 0) {
            clientsList.forEach((c: Client, idx: number) => {
              const phoneValue = c.phone;
              const phoneType = typeof phoneValue;
              const phoneTrimmed = phoneValue && typeof phoneValue === 'string' ? phoneValue.trim() : '';
              const hasPhone = phoneValue && typeof phoneValue === 'string' && phoneTrimmed.length > 0;
              
              console.log(`Client ${idx + 1}:`, {
                name: c.name,
                phone: phoneValue,
                phoneType: phoneType,
                phoneTrimmed: phoneTrimmed,
                phoneLength: phoneTrimmed.length,
                hasPhone: hasPhone
              });
            });
            
            const clientsWithPhone = clientsList.filter((c: Client) => {
              return c.phone && typeof c.phone === 'string' && c.phone.trim().length > 0;
            });
            console.log('Clients with phone:', clientsWithPhone.length, 'out of', clientsList.length);
            if (clientsWithPhone.length > 0) {
              console.log('Clients with phone details:', clientsWithPhone.map(c => `${c.name} (${c.phone})`));
            } else {
              console.warn('⚠️ No clients passed the phone filter!');
              console.log('Sample client phone values:', clientsList.slice(0, 3).map(c => ({
                name: c.name,
                phone: c.phone,
                phoneType: typeof c.phone
              })));
            }
          }
          
          setClients(clientsList);
        })
        .catch((error) => {
          console.error('Error fetching clients:', error);
          setClients([]); // Set empty array on error
          alert('Failed to load clients. Please check the console and server logs for details.');
        })
        .finally(() => {
          setIsLoadingClients(false);
        });
    }
  }, [clientId]);

  // Update selected client when clientId changes
  useEffect(() => {
    if (selectedClientId && clients.length > 0) {
      const client = clients.find((c) => c.id === selectedClientId);
      setSelectedClient(client || null);
    } else if (clientId && clientName && clientPhone) {
      setSelectedClient({
        id: clientId,
        name: clientName,
        phone: clientPhone,
      });
    }
  }, [selectedClientId, clients, clientId, clientName, clientPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalClientId = clientId || selectedClientId;
    
    if (!finalClientId) {
      alert('Please select a client');
      return;
    }

    if (!formData.message.trim()) {
      alert('Message is required');
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

      // Prepare request body
      const requestBody: any = {
        client_id: finalClientId,
        channel: 'whatsapp',
        whatsapp_text: formData.message,
        scheduled_at: scheduledAt,
        type: 'general',
      };

      // Add template if using template
      if (useTemplate && whatsappTemplates.length > 0) {
        requestBody.template = {
          name: whatsappTemplates[0].id,
          language: { code: 'en_US' },
        };
      }

      const response = await fetch('/api/notifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('WhatsApp API Error:', {
          status: response.status,
          statusText: response.statusText,
          result,
        });
        
        let errorMsg = result.error || 'Failed to send WhatsApp message';
        
        // Provide more helpful error messages
        if (result.error?.includes('credentials') || result.error?.includes('not configured')) {
          errorMsg = 'WhatsApp is not configured. Please check environment variables (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)';
        } else if (result.error?.includes('template') || result.error?.includes('131047')) {
          errorMsg = 'Template message required. Free-form messages only work within 24-hour customer service window. Please use a template.';
        } else if (result.error?.includes('expired') || result.error?.includes('invalid token')) {
          errorMsg = 'WhatsApp access token has expired. Please generate a new token from Meta for Developers.';
        } else if (result.details) {
          errorMsg = `${result.error}: ${result.details}`;
        }
        
        throw new Error(errorMsg);
      }

      alert(sendMode === 'now' ? 'WhatsApp message sent successfully!' : 'WhatsApp message scheduled successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error sending WhatsApp:', error);
      alert(error.message || 'Failed to send WhatsApp message. Check console for details.');
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send WhatsApp</h2>
              {clientId ? (
                <>
                  {clientName && (
                    <p className="text-sm text-gray-400">To: {clientName}</p>
                  )}
                  {clientPhone && (
                    <p className="text-xs text-gray-500">{clientPhone}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Select a client to send WhatsApp</p>
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
                disabled={isLoadingClients}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingClients ? 'Loading clients...' : 'Choose a client...'}
                </option>
                {!isLoadingClients && Array.isArray(clients) && clients.length === 0 && (
                  <option value="" disabled>No clients found</option>
                )}
                {!isLoadingClients && Array.isArray(clients) && clients.filter((c) => {
                  const hasPhone = c.phone && typeof c.phone === 'string' && c.phone.trim().length > 0;
                  if (!hasPhone && clients.length > 0) {
                    console.log('Client without phone:', c.name, 'Phone value:', c.phone, 'Type:', typeof c.phone);
                  }
                  return hasPhone;
                }).length === 0 && clients.length > 0 && (
                  <option value="" disabled>
                    No clients with phone numbers found ({clients.length} total clients)
                  </option>
                )}
                {!isLoadingClients && Array.isArray(clients) && (() => {
                  const clientsWithPhone = clients.filter((c) => {
                    // More robust phone number check - allow any non-empty phone value
                    if (!c.phone) return false;
                    if (typeof c.phone !== 'string') {
                      // Try to convert to string
                      const phoneStr = String(c.phone);
                      return phoneStr.trim().length > 0;
                    }
                    return c.phone.trim().length > 0;
                  });
                  
                  console.log('Rendering dropdown with', clientsWithPhone.length, 'clients');
                  
                  return clientsWithPhone.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </option>
                  ));
                })()}
              </select>
              {selectedClient && (
                <p className="text-xs text-gray-400 mt-1">
                  WhatsApp will be sent to: {selectedClient.phone}
                </p>
              )}
              {!isLoadingClients && Array.isArray(clients) && clients.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-400">
                    Total clients: {clients.length} | 
                    With phone: {clients.filter((c) => {
                      if (!c.phone) return false;
                      if (typeof c.phone !== 'string') return false;
                      return c.phone.trim().length > 0;
                    }).length}
                  </p>
                  {clients.filter((c) => {
                    if (!c.phone) return false;
                    if (typeof c.phone !== 'string') return false;
                    return c.phone.trim().length > 0;
                  }).length === 0 && (
                    <p className="text-xs text-yellow-400">
                      ⚠️ No clients have phone numbers. Please add phone numbers to clients first.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Template Option */}
          <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useTemplate}
                onChange={(e) => setUseTemplate(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-300">
                Use template message (required for business-initiated messages)
              </span>
            </label>
            {useTemplate && (
              <p className="text-xs text-gray-400 mt-2 ml-6">
                Using "hello_world" template. For production, create custom templates in WhatsApp Manager.
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
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your WhatsApp message here..."
              rows={8}
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.message.length} characters
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-gray-300">
              <strong>Note:</strong> Template messages are required for business-initiated conversations. 
              Free-form messages only work within 24 hours of customer contact.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 shadow-lg shadow-green-600/30"
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
                      Send WhatsApp
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule WhatsApp
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

