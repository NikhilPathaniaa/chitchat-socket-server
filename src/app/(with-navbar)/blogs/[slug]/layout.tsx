import { Metadata } from 'next';
import { getPostBySlug, getAllSlugs, type BlogPost } from '@/lib/blog';
import Script from 'next/script';
import './styles.css';

type Params = {
  slug: string;
}

type Props = {
  params: Promise<Params>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogPost | null = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    keywords: post.seoKeywords || [post.category, ...(post.tags || [])],
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      type: 'article',
      publishedTime: new Date().toISOString(),
    }
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogLayout({ children, params }: Props) {
  const { slug } = await params;
  return <>{children}</>;
}
