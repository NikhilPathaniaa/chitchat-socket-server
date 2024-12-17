const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to get all blog posts
function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  const posts = glob.sync('*.mdx', { cwd: postsDirectory });
  return posts.map(post => ({
    slug: post.replace(/\.mdx$/, ''),
    date: new Date().toISOString()
  }));
}

async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chitchat.com';
  const posts = getBlogPosts();
  
  // Generate blog post URLs
  const blogUrls = posts.map(post => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // Core pages
  const coreUrls = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'always',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6
    }
  ];

  const allUrls = [...coreUrls, ...blogUrls];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastModified, changeFrequency, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);
