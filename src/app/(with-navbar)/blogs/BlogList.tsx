import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60";

export default async function BlogList() {
  const posts = await getAllPosts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          href={`/blogs/${post.slug}`}
          className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="relative h-64 overflow-hidden">
            <Image
              src={post.imgSrc || FALLBACK_IMAGE}
              alt={post.title}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white transform group-hover:scale-105 transition-all duration-300">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                {post.readTime}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {post.title}
            </h2>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors duration-200">
              {post.description}
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>
        </Link>
      ))}
    </div>
  );
}
