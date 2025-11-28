// ============================================================================
// EMAIL SERVICE WRAPPER
// ============================================================================
// Wrapper around Resend (or other email providers) for easy swapping

interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
  html?: string; // Optional HTML version (if not provided, will be generated from body + signature)
}

// Email signature configuration
const EMAIL_SIGNATURE = {
  trainerName: 'Coach Keerthi Raj',
  gymName: 'KR Fitness Studio',
  // Use encodeURIComponent for proper URL encoding
  logoUrl: (() => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://krfitnessstudio.com';
    const logoPath = encodeURIComponent('KR FITNESS LOGO BLACK BACKGROUND.png');
    return `${baseUrl}/${logoPath}`;
  })(),
  phone: '+91 6361079633',
  email: 'krpersonalfitnessstudio@gmail.com',
  website: 'https://krfitnessstudio.com',
};

/**
 * Generate HTML email signature
 * Uses simple, email-client-compatible HTML
 */
function generateEmailSignature(): string {
  // Simple signature with trainer name, gym name, and phone only
  return `<div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb; font-family: Arial, sans-serif;"><p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #1f2937;">${EMAIL_SIGNATURE.trainerName}</p><p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #dc2626;">${EMAIL_SIGNATURE.gymName}</p><p style="margin: 0 0 0 0; font-size: 14px; color: #4b5563;">Phone: ${EMAIL_SIGNATURE.phone}</p></div>`;
}

/**
 * Convert plain text to HTML with signature
 */
function formatEmailBody(body: string, includeSignature: boolean = true): string {
  // Convert plain text to HTML (preserve line breaks)
  // Escape HTML entities first, then convert newlines to <br>
  const htmlBody = body
    .replace(/&/g, '&amp;')  // Escape & first to avoid double-escaping
    .replace(/</g, '&lt;')   // Escape <
    .replace(/>/g, '&gt;')   // Escape >
    .replace(/\n/g, '<br>'); // Convert newlines to <br> after escaping

  const signature = includeSignature ? generateEmailSignature() : '';

  // Use compact HTML for better email client compatibility
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1f2937; background-color: #f9fafb;"><div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;"><div style="color: #1f2937; font-size: 16px; line-height: 1.8;">${htmlBody}</div>${signature}</div></body></html>`;
}

interface EmailProvider {
  sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string; emailId?: string }>;
}

class ResendProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'KR Fitness <no-reply@krfitnessstudio.com>';

    if (!this.apiKey) {
      console.warn('[Email] RESEND_API_KEY not set. Email sending will fail.');
    }

    // Warn if using test domain (only allows sending to account owner)
    if (this.fromEmail.includes('resend.dev') || this.fromEmail.includes('onboarding@')) {
      console.warn('[Email] WARNING: Using test domain. You can only send to your own email address.');
      console.warn('[Email] To send to clients, verify your domain at: https://resend.com/domains');
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string; emailId?: string }> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'RESEND_API_KEY environment variable is not set',
      };
    }

    try {
      // Generate HTML version if not provided
      const html = options.html || formatEmailBody(options.body, true);

      const emailPayload = {
        from: options.from || this.fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.body, // Plain text version
        html: html, // HTML version with signature
      };

      console.log('[Email] Sending email via Resend:', {
        to: options.to,
        subject: options.subject,
        from: emailPayload.from,
        hasHtml: !!emailPayload.html,
        htmlLength: emailPayload.html?.length || 0,
      });

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Email] Resend API error:', {
          status: response.status,
          statusText: response.statusText,
          data,
          payload: emailPayload,
        });
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      // Log successful send with email ID for tracking
      console.log('[Email] Email sent successfully:', {
        emailId: data.id,
        to: options.to,
        subject: options.subject,
        resendUrl: `https://resend.com/emails/${data.id}`,
      });

      return { 
        success: true,
        emailId: data.id, // Resend email ID for tracking
      };
    } catch (error: any) {
      console.error('[Email] Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}

// Export singleton instance
const emailProvider: EmailProvider = new ResendProvider();

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string; emailId?: string }> {
  return emailProvider.sendEmail(options);
}

// For testing or future provider swapping
export function setEmailProvider(provider: EmailProvider) {
  // This would be used if we need to swap providers dynamically
  // For now, we use the singleton pattern
}

