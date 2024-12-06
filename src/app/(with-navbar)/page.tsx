'use client';

import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blog-data';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from '@/lib/utils';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
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

export default function Home() {
  return (
    <Container maxWidth="lg">
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        sx={{ py: { xs: 4, md: 8 } }}
      >
        {/* Hero Section */}
        <MotionBox variants={itemVariants} sx={{ mb: 8, textAlign: 'center' }}>
          <MotionTypography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Welcome to ChitChat Blog
          </MotionTypography>
          <MotionTypography
            variant="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Discover insights about privacy, security, and the future of communication
          </MotionTypography>
        </MotionBox>

        {/* Blog Posts Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4
          }}
        >
          {blogPosts.map((post) => (
            <MotionLink
              key={post.id}
              variants={itemVariants}
              href={`/blogs/${post.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4]
                  }
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <Image
                    src={post.imgSrc}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1
                    }}
                  >
                    {post.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {post.readTime}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.category}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </MotionLink>
          ))}
        </Box>
      </MotionBox>
    </Container>
  );
}
