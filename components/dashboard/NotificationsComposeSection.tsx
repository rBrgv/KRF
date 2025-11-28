'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Plus } from 'lucide-react';
import { EmailComposeForm } from './EmailComposeForm';
import { WhatsAppComposeForm } from './WhatsAppComposeForm';

export function NotificationsComposeSection() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Email Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Send Email</h2>
                <p className="text-sm text-gray-400">Compose and send emails</p>
              </div>
            </div>
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 text-sm"
            >
              <Plus className="w-4 h-4" />
              Compose
            </button>
          </div>
        </div>

        {/* WhatsApp Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Send WhatsApp</h2>
                <p className="text-sm text-gray-400">Send WhatsApp messages</p>
              </div>
            </div>
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/30 text-sm"
            >
              <Plus className="w-4 h-4" />
              Compose
            </button>
          </div>
        </div>
      </div>

      {/* Email Compose Form Modal */}
      {showEmailForm && (
        <EmailComposeForm
          onClose={() => setShowEmailForm(false)}
          onSuccess={() => {
            setShowEmailForm(false);
            // Refresh the page to show new notification
            window.location.reload();
          }}
        />
      )}

      {/* WhatsApp Compose Form Modal */}
      {showWhatsAppForm && (
        <WhatsAppComposeForm
          onClose={() => setShowWhatsAppForm(false)}
          onSuccess={() => {
            setShowWhatsAppForm(false);
            // Refresh the page to show new notification
            window.location.reload();
          }}
        />
      )}
    </>
  );
}




