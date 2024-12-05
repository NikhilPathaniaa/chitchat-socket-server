'use client';

import Script from 'next/script';

const GoogleAnalytics = ({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              restricted_data_processing: true,
              client_storage: 'none',
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
