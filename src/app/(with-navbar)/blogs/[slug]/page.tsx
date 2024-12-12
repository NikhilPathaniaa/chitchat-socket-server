import { getPostBySlug, getAllPosts, type BlogPost } from '@/lib/blog';
import BlogPostContent from './BlogPostContent';
import type { Metadata } from 'next';

type Params = {
  slug: string;
}

type Props = {
  params: Promise<Params>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
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

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>The requested blog post could not be found.</p>
      </div>
    );
  }

  const relatedPosts = (await getAllPosts())
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  return <BlogPostContent post={post} relatedPosts={relatedPosts} />;
}
