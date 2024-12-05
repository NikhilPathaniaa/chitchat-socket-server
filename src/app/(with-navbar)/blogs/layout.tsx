import BlogList from './BlogList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | ChitChat',
  description: 'Explore our latest articles about chat applications, real-time communication, and web development.',
  openGraph: {
    title: 'ChitChat Blog',
    description: 'Discover insights about real-time communication, web security, and modern chat applications.',
    type: 'website',
    siteName: 'ChitChat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChitChat Blog',
    description: 'Discover insights about real-time communication, web security, and modern chat applications.',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogData = BlogList();
  
  // Pass the blog data to the client component
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
