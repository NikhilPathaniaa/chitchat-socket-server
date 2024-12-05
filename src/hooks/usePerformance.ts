import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  timeToFirstByte?: number;
  firstContentfulPaint?: number;
  domInteractive?: number;
  loadComplete?: number;
}

export const usePerformance = () => {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    // Time to First Byte
    metricsRef.current.timeToFirstByte = navigation.responseStart - navigation.requestStart;

    // First Contentful Paint
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      metricsRef.current.firstContentfulPaint = fcp.startTime;
    }

    // DOM Interactive
    metricsRef.current.domInteractive = navigation.domInteractive;

    // Load Complete
    metricsRef.current.loadComplete = navigation.loadEventEnd;

    // Log performance metrics
    console.info('Performance Metrics:', {
      timeToFirstByte: `${metricsRef.current.timeToFirstByte.toFixed(2)}ms`,
      firstContentfulPaint: `${metricsRef.current.firstContentfulPaint?.toFixed(2)}ms`,
      domInteractive: `${metricsRef.current.domInteractive.toFixed(2)}ms`,
      loadComplete: `${metricsRef.current.loadComplete.toFixed(2)}ms`,
    });

    // Report to analytics if needed
    // reportToAnalytics(metricsRef.current);
  }, []);

  return metricsRef.current;
};
