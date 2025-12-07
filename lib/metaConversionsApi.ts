/**
 * Meta Conversions API (Server-Side Tracking)
 * 
 * This module handles server-side event tracking to Meta's Conversions API.
 * It works alongside the client-side Meta Pixel for enhanced tracking.
 * 
 * Features:
 * - Server-to-server event tracking (not blocked by ad blockers)
 * - Dataset Quality API integration for monitoring
 * - Enhanced conversion tracking
 */

import crypto from 'crypto';

/**
 * Meta Pixel ID
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Meta Conversions API Access Token
 * Get from: Meta Events Manager > Settings > Conversions API
 */
export const META_CONVERSIONS_API_ACCESS_TOKEN = process.env.META_CONVERSIONS_API_ACCESS_TOKEN || '';

/**
 * Meta Dataset Quality API Token
 * Get from: Meta Events Manager > Settings > Dataset Quality API
 */
export const META_DATASET_QUALITY_API_TOKEN = process.env.META_DATASET_QUALITY_API_TOKEN || '';

/**
 * Test Event Code (optional, for testing)
 */
export const META_PIXEL_TEST_CODE = process.env.NEXT_PUBLIC_META_PIXEL_TEST_CODE || '';

/**
 * Check if Conversions API is configured
 */
export const isConversionsApiEnabled = (): boolean => {
  return !!META_PIXEL_ID && !!META_CONVERSIONS_API_ACCESS_TOKEN;
};

/**
 * Hash user data (email, phone) for privacy
 * Meta requires SHA-256 hashing of PII
 */
export const hashUserData = (value: string): string => {
  if (!value) return '';
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
};

/**
 * Get client IP address from request
 */
export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || '0.0.0.0';
};

/**
 * Get user agent from request
 */
export const getUserAgent = (request: Request): string => {
  return request.headers.get('user-agent') || '';
};

/**
 * Create user data object for Conversions API
 * Meta expects hashed values for PII (email, phone)
 */
export interface UserData {
  em?: string; // Hashed email (SHA-256)
  ph?: string; // Hashed phone (SHA-256)
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string; // Facebook browser ID (from cookie)
  fbc?: string; // Facebook click ID (from URL parameter)
}

export const createUserData = (
  email?: string,
  phone?: string,
  request?: Request
): UserData => {
  const userData: UserData = {};

  if (email) {
    userData.em = hashUserData(email);
  }

  if (phone) {
    // Remove non-digits and hash
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits) {
      userData.ph = hashUserData(phoneDigits);
    }
  }

  if (request) {
    userData.client_ip_address = getClientIp(request);
    userData.client_user_agent = getUserAgent(request);
  }

  return userData;
};

/**
 * Send event to Meta Conversions API
 */
export interface ConversionEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  event_source_url?: string;
  action_source: 'website' | 'app' | 'phone_call' | 'email' | 'other';
  user_data: UserData;
  custom_data?: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
  };
}

export const sendConversionEvent = async (
  event: ConversionEvent,
  request?: Request
): Promise<{ success: boolean; error?: string }> => {
  if (!isConversionsApiEnabled()) {
    return { success: false, error: 'Conversions API not configured' };
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events`;

    const payload: any = {
      data: [event],
      access_token: META_CONVERSIONS_API_ACCESS_TOKEN,
    };

    // Add test event code if configured
    if (META_PIXEL_TEST_CODE) {
      payload.test_event_code = META_PIXEL_TEST_CODE;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Meta Conversions API] Error:', data);
      return {
        success: false,
        error: data.error?.message || 'Failed to send event',
      };
    }

    console.log('[Meta Conversions API] Event sent successfully:', {
      event_name: event.event_name,
      event_id: data.events_received?.[0]?.event_id,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Meta Conversions API] Exception:', error);
    return {
      success: false,
      error: error.message || 'Failed to send event',
    };
  }
};

/**
 * Track PageView event
 */
export const trackPageView = async (
  request?: Request,
  url?: string
): Promise<void> => {
  if (!isConversionsApiEnabled()) return;

  const event: ConversionEvent = {
    event_name: 'PageView',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: url,
    user_data: createUserData(undefined, undefined, request),
  };

  await sendConversionEvent(event, request);
};

/**
 * Track ViewContent event
 */
export const trackViewContent = async (
  params: {
    content_name?: string;
    content_category?: string;
    url?: string;
  },
  request?: Request,
  userData?: { email?: string; phone?: string }
): Promise<void> => {
  if (!isConversionsApiEnabled()) return;

  const event: ConversionEvent = {
    event_name: 'ViewContent',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: params.url,
    user_data: createUserData(userData?.email, userData?.phone, request),
    custom_data: {
      content_name: params.content_name,
      content_category: params.content_category,
    },
  };

  await sendConversionEvent(event, request);
};

/**
 * Track Lead event
 */
export const trackLead = async (
  params: {
    content_name?: string;
    value?: number;
    currency?: string;
    url?: string;
  },
  request?: Request,
  userData?: { email?: string; phone?: string; name?: string }
): Promise<void> => {
  if (!isConversionsApiEnabled()) return;

  // Generate event ID for deduplication (use timestamp + random)
  const eventId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const event: ConversionEvent = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    event_source_url: params.url,
    user_data: createUserData(userData?.email, userData?.phone, request),
    custom_data: {
      content_name: params.content_name,
      value: params.value || 0,
      currency: params.currency || 'INR',
    },
  };

  await sendConversionEvent(event, request);
};

/**
 * Get Dataset Quality metrics
 * Requires Dataset Quality API token
 */
export const getDatasetQuality = async (): Promise<any> => {
  if (!META_DATASET_QUALITY_API_TOKEN || !META_PIXEL_ID) {
    return null;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/dataset_quality`;
    const response = await fetch(`${url}?access_token=${META_DATASET_QUALITY_API_TOKEN}`);

    if (!response.ok) {
      console.error('[Dataset Quality API] Error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Dataset Quality API] Exception:', error);
    return null;
  }
};

