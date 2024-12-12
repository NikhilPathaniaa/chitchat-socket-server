'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

interface BlogCardProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
  slug: string;
  index: number;
}

export default function BlogCard({
  title,
  description,
  category,
  readTime,
  slug,
  index,
}: BlogCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Link href={`/blogs/${slug}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-[16/9] rounded-t-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 shimmer" />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-gray-600 line-clamp-3">
              {description}
            </p>

            {/* Read Time */}
            <div className="mt-4 flex items-center text-gray-500">
              <FiClock className="w-4 h-4 mr-2" />
              <span className="text-sm">{readTime}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
