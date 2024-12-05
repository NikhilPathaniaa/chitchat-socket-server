import { blogPosts } from '@/data/blog-data';

export async function getBlogPosts() {
  return blogPosts;
}

export async function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug) || null;
}
