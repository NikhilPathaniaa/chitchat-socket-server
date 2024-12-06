import { Metadata } from 'next';
import { BlogPost } from './blog';

interface SeoConfig {
  baseUrl: string;
  siteName: string;
  twitterHandle?: string;
  defaultImage?: string;
  author: {
    name: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    bio: string;
  };
}

const seoConfig: SeoConfig = {
  baseUrl: 'https://chitchat.com',
  siteName: 'ChitChat',
  twitterHandle: '@chitchat',
  defaultImage: 'https://chitchat.com/default-og.jpg',
  author: {
    name: 'ChitChat Team',
    website: 'https://chitchat.com',
    bio: 'Full-stack developer and creator of ChitChat. Passionate about building real-time communication solutions and modern web applications.',
  },
};

export function generateBlogPostMetadata(post: BlogPost, slug: string): Metadata {
  const canonicalUrl = `${seoConfig.baseUrl}/blogs/${slug}`;
  const ogImage = post.imgSrc || seoConfig.defaultImage;

  return {
    title: post.seoTitle || `${post.title} | ${seoConfig.siteName}`,
    description: post.seoDescription || post.description,
    keywords: post.seoKeywords,
    authors: [{ 
      name: seoConfig.author.name,
      url: seoConfig.author.website,
    }],
    creator: seoConfig.author.name,
    publisher: seoConfig.author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      type: 'article',
      authors: [seoConfig.author.name],
      images: ogImage ? [
        {
          url: ogImage || '',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      images: ogImage ? [
        {
          url: ogImage || '',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
  };
}

export function generateBlogListMetadata(): Metadata {
  const canonicalUrl = `${seoConfig.baseUrl}/blogs`;

  return {
    title: 'Blog | ChitChat - Real-time Communication Insights',
    description: 'Explore expert insights on real-time communication, chat applications, and modern web development by Nikhil Pathania.',
    keywords: ['chat applications', 'real-time communication', 'web development', 'NextJS', 'React', 'TypeScript'],
    authors: [{ 
      name: seoConfig.author.name,
      url: seoConfig.author.website,
    }],
    creator: seoConfig.author.name,
    publisher: seoConfig.author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'ChitChat Blog - Real-time Communication Insights',
      description: 'Explore expert insights on real-time communication, chat applications, and modern web development by Nikhil Pathania.',
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      type: 'website',
      images: [
        {
          url: seoConfig.defaultImage || 'https://chitchat.com/default-blog-image.jpg',
          width: 1200,
          height: 630,
          alt: 'ChitChat Blog by Nikhil Pathania',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title: 'ChitChat Blog - Real-time Communication Insights',
      description: 'Explore expert insights on real-time communication, chat applications, and modern web development by Nikhil Pathania.',
      images: [
        {
          url: seoConfig.defaultImage || 'https://chitchat.com/default-blog-image.jpg',
          width: 1200,
          height: 630,
          alt: 'ChitChat Blog by Nikhil Pathania',
        },
      ],
    },
  };
}
