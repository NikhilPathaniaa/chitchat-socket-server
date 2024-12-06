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

interface BlogPostPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const gradientTextStyle = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default function BlogPostPage({ post, relatedPosts }: BlogPostPageProps) {
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          transformOrigin: '0%',
          scaleX
        }}
      />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ 
            position: 'relative',
            height: { xs: '200px', sm: '300px', md: '400px' },
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Image
              src={post.imgSrc}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>

          <Typography variant="h1" sx={{
            ...gradientTextStyle,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.02em',
            textAlign: 'center'
          }}>
            {post.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={post.readTime}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            {post.isExpertPost && (
              <Chip
                label="Expert Post"
                sx={{
                  background: theme.palette.success.main,
                  color: 'white'
                }}
              />
            )}
            {post.type && (
              <Chip
                label={post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                sx={{
                  background: theme.palette.info.main,
                  color: 'white'
                }}
              />
            )}
          </Box>

          <Box sx={{
            '& .markdown-content': {
              '& p': {
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.7,
                color: 'text.primary',
                mb: 3
              },
              '& h2': {
                ...gradientTextStyle,
                fontSize: { xs: '1.75rem', sm: '2rem' },
                fontWeight: 600,
                mt: 5,
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '-0.02em'
              },
              '& h3': {
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                color: 'text.primary',
                mt: 4,
                mb: 2,
                letterSpacing: '-0.01em'
              },
              '& ul': {
                pl: 4,
                mb: 3,
                '& li': {
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  lineHeight: 1.7,
                  color: 'text.primary',
                  mb: 1
                }
              },
              '& code': {
                backgroundColor: 'grey.100',
                padding: '2px 6px',
                borderRadius: 1,
                fontSize: '0.9em',
                fontFamily: 'monospace'
              },
              '& pre': {
                backgroundColor: 'grey.900',
                padding: 3,
                borderRadius: 2,
                overflow: 'auto',
                mb: 3,
                '& code': {
                  backgroundColor: 'transparent',
                  color: 'common.white',
                  padding: 0
                }
              }
            }
          }}>
            <div className="markdown-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </Box>

          {relatedPosts.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography variant="h2" sx={{
                ...gradientTextStyle,
                fontSize: { xs: '1.75rem', sm: '2rem' },
                fontWeight: 600,
                mb: 4,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '-0.02em'
              }}>
                Related Posts
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blogs/${relatedPost.slug}`}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Box sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        borderColor: 'transparent'
                      }
                    }}>
                      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                        {relatedPost.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {relatedPost.description}
                      </Typography>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </motion.div>

        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%)',
            }
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>

        <Box sx={{ position: 'fixed', bottom: 32, left: 32 }}>
          <FeedbackButton />
        </Box>
      </Container>
    </>
  );
}
