// ============================================================================
// EMAIL TEMPLATES
// ============================================================================
// Default email templates for common use cases
// These can be overridden by custom templates stored in the database

export type EmailTemplateType = 
  | 'appointment_reminder'
  | 'lead_followup'
  | 'lead_welcome'
  | 'payment_reminder'
  | 'membership_renewal'
  | 'custom';

export interface EmailTemplate {
  id: string;
  type: EmailTemplateType;
  name: string;
  subject: string;
  body: string;
  variables?: string[]; // List of variables that can be replaced (e.g., {{name}}, {{date}})
}

// Default email templates
export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'appointment_reminder',
    type: 'appointment_reminder',
    name: 'Appointment Reminder',
    subject: 'Reminder: Your Training Session Tomorrow',
    body: `Hi {{name}},

This is a friendly reminder that you have a training session scheduled for tomorrow at {{time}}.

Please arrive 5 minutes early to ensure we can start on time and make the most of your session.

If you need to reschedule, please let me know at least 24 hours in advance.

Looking forward to seeing you!`,
    variables: ['name', 'time', 'date'],
  },
  {
    id: 'lead_followup',
    type: 'lead_followup',
    name: 'Lead Follow-up',
    subject: 'Following Up on Your Fitness Goals',
    body: `Hi {{name}},

Thank you for your interest in KR Fitness Studio. I wanted to follow up and see if you have any questions about our personal training programs.

We offer personalized training programs tailored to your specific fitness goals, whether it's weight loss, muscle gain, strength training, or rehabilitation.

I'd love to schedule a consultation to discuss how we can help you achieve your fitness goals. Please let me know a convenient time for you.

Looking forward to hearing from you!`,
    variables: ['name'],
  },
  {
    id: 'lead_welcome',
    type: 'lead_welcome',
    name: 'Lead Welcome',
    subject: 'Welcome to KR Fitness Studio!',
    body: `Hi {{name}},

Welcome to KR Fitness Studio! Thank you for reaching out to us.

I'm Keerthi Raj, your personal fitness trainer with over 15 years of experience. I'm here to help you achieve your fitness goals through personalized training programs designed specifically for you.

Our approach focuses on:
- Customized workout plans based on your goals
- Nutritional guidance to complement your training
- Flexible scheduling to fit your lifestyle
- Expert guidance and motivation

I'd love to schedule a consultation to discuss your fitness goals and create a plan that works for you. Please reply to this email or call me at +91 6361079633 to book your session.

Looking forward to working with you!`,
    variables: ['name'],
  },
  {
    id: 'payment_reminder',
    type: 'payment_reminder',
    name: 'Payment Reminder',
    subject: 'Payment Reminder - KR Fitness Studio',
    body: `Hi {{name}},

This is a friendly reminder that your payment of ₹{{amount}} is due on {{due_date}}.

You can make the payment through:
- Direct bank transfer
- Cash payment at the studio
- Online payment (details will be shared separately)

If you've already made the payment, please ignore this reminder. If you have any questions or need to discuss payment options, please don't hesitate to reach out.

Thank you for your continued trust in KR Fitness Studio!`,
    variables: ['name', 'amount', 'due_date'],
  },
  {
    id: 'membership_renewal',
    type: 'membership_renewal',
    name: 'Membership Renewal Reminder',
    subject: 'Your Membership is Expiring Soon - Renew Now',
    body: `Hi {{name}},

I hope you're enjoying your fitness journey with us! Your membership is set to expire on {{expiry_date}}.

To continue your progress and maintain your results, I'd like to invite you to renew your membership. We have several options available:

- Monthly membership
- 3-month membership (with special discount)
- Yearly membership (best value)

Renewing now will ensure there's no interruption in your training schedule. Plus, as a valued member, you'll receive priority scheduling and continued access to all our services.

Please let me know if you'd like to discuss renewal options or if you have any questions.

Looking forward to continuing our fitness journey together!`,
    variables: ['name', 'expiry_date'],
  },
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return DEFAULT_EMAIL_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: EmailTemplateType): EmailTemplate[] {
  return DEFAULT_EMAIL_TEMPLATES.filter(t => t.type === type);
}

/**
 * Replace template variables with actual values
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  // Remove any unreplaced variables
  result = result.replace(/\{\{[\w]+\}\}/g, '');
  return result;
}

