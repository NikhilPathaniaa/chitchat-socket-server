'use client';

import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            You might also like
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Explore more articles on similar topics to expand your knowledge
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((post, index) => (
            <BlogCard
              key={post.slug}
              index={index}
              title={post.title}
              description={post.description}
              category={post.category}
              readTime={post.readTime}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
