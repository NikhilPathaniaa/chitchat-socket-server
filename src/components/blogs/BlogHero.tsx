'use client';

import { BlogPost } from '@/lib/blog';
import { motion } from 'framer-motion';
import ImageSkeleton from '../ui/ImageSkeleton';
import { BiTime } from 'react-icons/bi';

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  return (
    <header className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#e0e7ff_0%,_transparent_60%)] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#818cf8_0%,_transparent_60%)] opacity-20" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
              {post.isExpertPost && (
                <span className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-full ring-1 ring-indigo-100/80">
                  Expert Insights
                </span>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <BiTime className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.description}
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/10 ring-1 ring-gray-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white/20 mix-blend-overlay z-10 rounded-[2.5rem]" />
              {post.imgSrc && (
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden transform transition-transform duration-500">
                  <ImageSkeleton
                    src={post.imgSrc}
                    alt={post.title}
                    width={800}
                    height={600}
                    className="object-cover rounded-[2.5rem] w-full h-full"
                    priority={true}
                  />
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10 rounded-[2.5rem]" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-30" />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Continue Reading</span>
            <div className="p-2 rounded-full bg-white shadow-lg shadow-indigo-100 ring-1 ring-gray-900/5">
              <svg
                className="w-5 h-5 text-indigo-600 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
