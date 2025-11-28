/**
 * Input sanitization utilities
 * Prevents SQL injection and XSS attacks
 */

/**
 * Sanitize search input for database queries
 * Escapes special characters used in SQL LIKE patterns
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[%_\\]/g, (match) => {
      // Escape SQL LIKE special characters
      if (match === '%') return '\\%';
      if (match === '_') return '\\_';
      if (match === '\\') return '\\\\';
      return match;
    })
    .slice(0, 100); // Limit length
}

/**
 * Sanitize general text input
 */
export function sanitizeTextInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, maxLength);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase().slice(0, 255);
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '').slice(0, 20);
}



