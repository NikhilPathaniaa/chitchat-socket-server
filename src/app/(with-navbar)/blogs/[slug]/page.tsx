import { getPostBySlug, getAllPosts, type BlogPost } from '@/lib/blog';
import BlogPostContent from './BlogPostContent';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.title,
    description: post.description
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return null; // or handle 404
  }

  // Get related posts (excluding current post)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== params.slug)
    .slice(0, 2); // Get up to 2 related posts

  return <BlogPostContent post={post} relatedPosts={relatedPosts} />;
}
