'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track non-chat pages
    if (typeof window !== 'undefined' && 'gtag' in window && !pathname.startsWith('/chat')) {
      const url = pathname + searchParams.toString();
      
      // Remove any potential sensitive data from URL
      const sanitizedUrl = url.split('?')[0]; // Remove query parameters
      
      // @ts-ignore
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: sanitizedUrl,
        anonymize_ip: true,
        allow_google_signals: false,
        restricted_data_processing: true
      });
    }
  }, [pathname, searchParams]);
};
