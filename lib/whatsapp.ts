// ============================================================================
// WHATSAPP SERVICE WRAPPER
// ============================================================================
// Wrapper around WhatsApp Business API for sending messages

interface SendWhatsAppOptions {
  to: string; // Phone number in E.164 format (e.g., "919632484104")
  message: string; // Text message content
  template?: {
    name: string;
    language: { code: string };
    components?: any[];
  };
}

interface WhatsAppProvider {
  sendMessage(options: SendWhatsAppOptions): Promise<{ success: boolean; error?: string; messageId?: string }>;
}

class WhatsAppBusinessProvider implements WhatsAppProvider {
  private accessToken: string;
  private phoneNumberId: string;
  private apiVersion: string = 'v21.0';
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    if (!this.accessToken) {
      console.warn('[WhatsApp] WHATSAPP_ACCESS_TOKEN not set. WhatsApp sending will fail.');
    }

    if (!this.phoneNumberId) {
      console.warn('[WhatsApp] WHATSAPP_PHONE_NUMBER_ID not set. WhatsApp sending will fail.');
    }
  }

  /**
   * Format phone number to E.164 format (without +)
   * Input: "+91 96324 84104" or "919632484104" or "9632484104" or "+1 555 179 0690"
   * Output: "919632484104" or "15551790690" (no +, no spaces)
   */
  private formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle US test numbers (Meta test numbers start with 1)
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      // US number with country code: "15551790690"
      return cleaned;
    }
    
    // Handle US test numbers without country code (10 digits starting with 555)
    if (cleaned.length === 10 && cleaned.startsWith('555')) {
      // Add US country code
      return `1${cleaned}`;
    }
    
    // If starts with country code 91 (India) and has 12+ digits, use as is
    if (cleaned.startsWith('91') && cleaned.length >= 12) {
      return cleaned;
    }
    
    // If starts with 0 followed by 10 digits (Indian format: 09632484104)
    // Remove the leading 0 and add country code 91
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `91${cleaned.substring(1)}`;
    }
    
    // If 10 digits, assume India and add country code
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }
    
    // If 11 digits starting with 0, remove 0 and add 91
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `91${cleaned.substring(1)}`;
    }
    
    // Return as is if already formatted (should have country code)
    return cleaned;
  }

  async sendMessage(options: SendWhatsAppOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
    if (!this.accessToken || !this.phoneNumberId) {
      return {
        success: false,
        error: 'WhatsApp credentials not configured. Please set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID',
      };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(options.to);

      // If template is provided, use template message
      if (options.template) {
        const payload = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: options.template,
        };

        console.log('[WhatsApp] Sending template message:', {
          to: formattedPhone,
          template: options.template.name,
        });

        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('[WhatsApp] API error:', {
            status: response.status,
            statusText: response.statusText,
            data,
          });
          return {
            success: false,
            error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const messageId = data.messages?.[0]?.id;
        
        console.log('[WhatsApp] Template message sent successfully:', {
          messageId,
          to: formattedPhone,
          template: options.template.name,
        });

        // Store outbound message in database via API route (async, don't wait)
        fetch('/api/whatsapp/store-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: formattedPhone,
            messageId,
            messageText: options.message || `Template: ${options.template.name}`,
            messageType: 'template',
            template: options.template,
          }),
        }).catch(err => {
          console.error('[WhatsApp] Error storing outbound message:', err);
        });

        return {
          success: true,
          messageId,
        };
      } else {
        // Send free-form text message (only works if recipient has messaged you first, or within 24-hour window)
        const payload = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: options.message,
          },
        };

        console.log('[WhatsApp] Sending text message:', {
          to: formattedPhone,
          messageLength: options.message.length,
        });

        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          // Check if error is due to needing a template
          if (data.error?.code === 131047 || data.error?.message?.includes('template')) {
            console.warn('[WhatsApp] Free-form message not allowed. Use template messages for business-initiated conversations.');
            return {
              success: false,
              error: 'Template message required. Free-form messages only work within 24-hour customer service window.',
            };
          }

          console.error('[WhatsApp] API error:', {
            status: response.status,
            statusText: response.statusText,
            data,
          });
          return {
            success: false,
            error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const messageId = data.messages?.[0]?.id;
        
        console.log('[WhatsApp] Text message sent successfully:', {
          messageId,
          to: formattedPhone,
        });

        // Store outbound message in database via API route (async, don't wait)
        fetch('/api/whatsapp/store-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: formattedPhone,
            messageId,
            messageText: options.message,
            messageType: 'text',
          }),
        }).catch(err => {
          console.error('[WhatsApp] Error storing outbound message:', err);
        });

        return {
          success: true,
          messageId,
        };
      }
    } catch (error: any) {
      console.error('[WhatsApp] Error sending message:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}

// Export singleton instance
const whatsappProvider: WhatsAppProvider = new WhatsAppBusinessProvider();

export async function sendWhatsApp(options: SendWhatsAppOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
  return whatsappProvider.sendMessage(options);
}

// For testing or future provider swapping
export function setWhatsAppProvider(provider: WhatsAppProvider) {
  // This would be used if we need to swap providers dynamically
  // For now, we use the singleton pattern
}

// Database storage moved to API route to avoid server/client boundary issues

