'use client';

import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';
import BlogCard from './BlogCard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10, 
        bgcolor: 'grey.50'
      }}
    >
      <Box sx={{ 
        maxWidth: '1400px', 
        mx: 'auto', 
        px: { xs: 2, sm: 3, lg: 4 }
      }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.875rem', sm: '2.25rem' },
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              You might also like
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                fontSize: '1.125rem',
                color: 'text.secondary',
                maxWidth: '42rem',
                mx: 'auto'
              }}
            >
              Explore more articles on similar topics to expand your knowledge
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 4
          }}
        >
          {relatedPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
