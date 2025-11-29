'use client';

import { CheckCircle, MessageCircle, X } from 'lucide-react';

interface BookingSuccessModalProps {
  whatsappUrl: string;
  onClose: () => void;
}

export function BookingSuccessModal({ whatsappUrl, onClose }: BookingSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full premium-card border border-green-500/30">
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-6">
            Your appointment has been saved. Click below to send a confirmation message on WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            Send WhatsApp Message
          </a>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

