'use client';

import FeedbackWrapper from './FeedbackWrapper';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FeedbackWrapper />
    </>
  );
}
