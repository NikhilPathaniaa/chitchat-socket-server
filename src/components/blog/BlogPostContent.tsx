'use client';

import React from 'react';
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import { Box, Container, Typography, Chip, Link, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import ReactMarkdown from 'react-markdown';
import type { BlogPost } from '@/lib/blog';

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const fadeInUp: Variants = {
    initial: { 
      opacity: 0, 
      y: 60 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: '100vh', 
        pb: 8,
        position: 'relative'
      }}
    >
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(to right, #3B82F6, #10B981)',
          transformOrigin: '0%',
          scaleX
        }}
      />
      
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: 8 }}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Hero Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              mb: 6 
            }}
          >
            {/* Image Section */}
            <motion.div 
              variants={fadeInUp}
              style={{ flex: '0 0 50%' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '220px', md: '280px' },
                  width: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Image
                  src={post.imgSrc.startsWith('http') ? post.imgSrc : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${post.imgSrc}`}
                  alt={post.title}
                  fill
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  priority
                />
              </Box>
            </motion.div>

            {/* Content Section */}
            <Box sx={{ flex: '1 1 50%' }}>
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 800,
                    mb: 3,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {post.title}
                </Typography>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: '1rem' }} />}
                    label={post.readTime}
                    variant="outlined"
                    sx={{ 
                      borderRadius: '8px',
                      height: '32px',
                    }}
                  />
                  {post.isExpertPost && (
                    <Chip
                      label="Expert Insights"
                      sx={{ 
                        borderRadius: '8px',
                        height: '32px',
                        bgcolor: 'primary.main',
                        color: 'white',
                      }}
                    />
                  )}
                </Box>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4,
                    fontSize: '1.125rem',
                    lineHeight: 1.6,
                  }}
                >
                  {post.description}
                </Typography>
              </motion.div>
            </Box>
          </Box>

          {/* Article Content */}
          <motion.div variants={fadeInUp}>
            <Box 
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                px: { xs: 2, sm: 4 },
                '& .markdown': {
                  '& h1, & h2, & h3': {
                    fontFamily: "'Poppins', sans-serif",
                    color: 'text.primary',
                    fontWeight: 'bold',
                    mt: 4,
                    mb: 2
                  },
                  '& h1': {
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                  },
                  '& h2': {
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                  },
                  '& h3': {
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  },
                  '& p': { 
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    mb: 4,
                    color: 'text.secondary'
                  },
                  '& ul, & ol': {
                    pl: 4,
                    mb: 4,
                    '& li': {
                      mb: 2,
                      color: 'text.secondary',
                      fontSize: '1.125rem',
                      lineHeight: 1.6
                    }
                  },
                }
              }}
            >
              <ReactMarkdown className="markdown">
                {post.content}
              </ReactMarkdown>
            </Box>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography variant="h2" sx={{ mb: 4 }}>Related Posts</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.slug}
                    href={`/blogs/${relatedPost.slug}`}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', width: '100%', height: 200, borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                        <Image
                          src={relatedPost.imgSrc.startsWith('http') ? relatedPost.imgSrc : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${relatedPost.imgSrc}`}
                          alt={relatedPost.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {relatedPost.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {relatedPost.description}
                      </Typography>
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={relatedPost.readTime}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Back to Top Button */}
      <IconButton
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[4],
          '&:hover': {
            bgcolor: 'background.paper'
          }
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <KeyboardArrowUpIcon />
      </IconButton>

      {/* Feedback Button */}
      <Box sx={{ position: 'fixed', bottom: 24, left: 24 }}>
        <FeedbackButton />
      </Box>
    </Box>
  );
}
