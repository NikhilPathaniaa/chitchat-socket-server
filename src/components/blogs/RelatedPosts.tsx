'use client';

import { BlogPost } from '@/lib/blog';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BiTime } from 'react-icons/bi';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: number;
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  // Since we now have only one blog post, we'll show a message instead
  if (posts.length <= 1) {
    return null;
  }

  // Get 3 related posts excluding the current one
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={`/blogs/${post.slug}`}
              className="block group"
            >
              <div className="relative aspect-[16/9] mb-4 rounded-2xl overflow-hidden">
                <Image
                  src={post.imgSrc}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <BiTime className="text-lg" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
