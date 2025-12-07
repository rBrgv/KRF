'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, isMetaPixelEnabled, META_PIXEL_ID } from '@/lib/metaPixel';

/**
 * Meta Pixel Component
 * 
 * This component tracks PageView on route changes.
 * The Meta Pixel script is loaded in the head via Next.js Script component.
 * 
 * Place this component in the root layout to enable global PageView tracking.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for fbq to be available (script loads in head)
    const checkReady = () => {
      if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
        setIsReady(true);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    
    if (META_PIXEL_ID) {
      checkReady();
    }
  }, []);

  useEffect(() => {
    // Track PageView on route changes (skip initial load as it's handled by script in head)
    if (!isReady || !META_PIXEL_ID) return;

    const timer = setTimeout(() => {
      if (isMetaPixelEnabled()) {
        trackPageView();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname, isReady]);

  // This component doesn't render anything
  return null;
}

