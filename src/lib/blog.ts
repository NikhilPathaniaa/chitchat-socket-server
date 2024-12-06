import { blogPosts, type BlogPost } from '@/data/blog-data';

export type { BlogPost };

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const post = blogPosts.find(post => post.slug === slug);
  return post || null;
}

export function getAllSlugs(): string[] {
  return blogPosts.map(post => post.slug);
}
