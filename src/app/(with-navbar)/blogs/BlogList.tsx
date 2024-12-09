import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  title: string;
  description: string;
  slug: string;
  image?: string;
  date: string;
}

const BlogCard = ({ title, description, slug, image, date }: BlogCardProps) => {
  return (
    <Link href={`/blogs/${slug}`} className="group block h-full">
      <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700">
        {image && (
          <div className="relative w-full h-52">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
            {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60";

export default async function BlogList() {
  const posts = await getAllPosts();

  console.log('Posts:', posts);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-8">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            description={post.description}
            slug={post.slug}
            image={post.imgSrc || FALLBACK_IMAGE}
            date={post.date}
          />
        ))}
      </div>
    </main>
  );
}
