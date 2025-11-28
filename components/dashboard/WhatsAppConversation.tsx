'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, ArrowDown } from 'lucide-react';
import { sendWhatsApp } from '@/lib/whatsapp';

interface WhatsAppMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  message_text: string;
  message_type: string;
  status: string;
  created_at: string;
  whatsapp_timestamp?: string;
}

interface WhatsAppConversationProps {
  clientId: string;
  clientPhone: string;
}

export function WhatsAppConversation({ clientId, clientPhone }: WhatsAppConversationProps) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [clientId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/whatsapp/messages?client_id=${clientId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const result = await sendWhatsApp({
        to: clientPhone,
        message: newMessage,
        template: useTemplate ? {
          name: 'hello_world',
          language: { code: 'en_US' }
        } : undefined,
      });

      if (result.success) {
        setNewMessage('');
        // Refresh messages to show the new one
        setTimeout(() => fetchMessages(), 1000);
      } else {
        alert(`Failed to send: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <div className="premium-card rounded-xl p-6 border border-gray-800/50">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">WhatsApp Conversation</h2>
        </div>
        <p className="text-gray-400">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="premium-card rounded-xl p-6 border border-gray-800/50">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">WhatsApp Conversation</h2>
        <button
          onClick={fetchMessages}
          className="ml-auto p-2 text-gray-400 hover:text-green-400 transition-colors"
          title="Refresh"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.direction === 'outbound'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                <p className={`text-xs mt-1 ${
                  message.direction === 'outbound' ? 'text-green-100' : 'text-gray-400'
                }`}>
                  {formatTime(message.whatsapp_timestamp || message.created_at)}
                  {message.direction === 'outbound' && (
                    <span className="ml-2">
                      {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Send Message Form */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="use-template"
            checked={useTemplate}
            onChange={(e) => setUseTemplate(e.target.checked)}
            className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="use-template" className="text-xs text-gray-400">
            Use template (required for business-initiated)
          </label>
        </div>
        
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400">
          💡 Free-form messages work within 24 hours of customer contact. Use templates for business-initiated messages.
        </p>
      </form>
    </div>
  );
}



