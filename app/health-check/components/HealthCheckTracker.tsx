'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/metaPixel';

/**
 * Health Check Tracker Component
 * 
 * Tracks ViewContent event when user views the Health Check page.
 * This component should be placed in the Health Check page to track
 * when users view the assessment.
 */
export function HealthCheckTracker() {
  useEffect(() => {
    // Track ViewContent when the Health Check page is viewed
    trackViewContent({
      content_name: 'Health Check',
      content_category: 'HealthScoreTest',
    });
  }, []);

  // This component doesn't render anything
  return null;
}

