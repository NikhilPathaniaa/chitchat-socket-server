'use client';

import { Box, Container, Typography, Chip, IconButton, useTheme, alpha, Paper, Avatar } from '@mui/material';
import { motion, useScroll, useSpring, Variants, useTransform } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Image from 'next/image';
import Link from 'next/link';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import ReactMarkdown from 'react-markdown';
import type { BlogPost } from '@/lib/blog';
import { useEffect, useState } from 'react';

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const gradientTextStyle = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.2, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const textVariants: Variants = {
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

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.onChange(v => setProgress(v));
    return () => unsubscribe();
  }, [scrollProgress]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Box
        component={motion.div}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(to right, #6366f1, #8b5cf6, #d946ef)',
          transformOrigin: '0%',
          scaleX,
          zIndex: theme.zIndex.appBar + 1
        }}
      />

      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '500px',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
            backgroundSize: '40px 40px',
            zIndex: 1
          }}
        />

        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 4, md: 8 },
            position: 'relative',
            zIndex: 2
          }}>
            {/* Title - Left Side */}
            <Box
              component={motion.div}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              sx={{ flex: 1, paddingRight: '40px' }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  ...gradientTextStyle,
                  mb: 2
                }}
              >
                {post.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {/* Min Read Chip */}
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                  label={`${post.readTime}`}
                  sx={{
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    '& .MuiChip-icon': {
                      color: theme.palette.primary.main
                    }
                  }}
                />
                {/* Expert Insights Tag */}
                <Chip
                  label="Expert Insights"
                  sx={{
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.3),
                    color: theme.palette.success.main
                  }}
                />
                {/* Tags */}
                {post.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                      color: theme.palette.secondary.main
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Image - Right Side */}
            <Box
              component={motion.div}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              sx={{
                width: '600px',
                height: '400px',
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent'
                }}
              >
                <Image
                  src={post.imgSrc}
                  alt={post.title}
                  fill
                  style={{ 
                    objectFit: 'contain',
                    margin: 'auto',
                    borderRadius: '24px'
                  }}
                  onLoadingComplete={(img) => {
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    const containerAspectRatio = 600 / 400;

                    if (aspectRatio > containerAspectRatio) {
                      img.style.width = '100%';
                      img.style.height = 'auto';
                    } else {
                      img.style.height = '100%';
                      img.style.width = 'auto';
                    }
                  }}
                  priority
                />
              </Box>

              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(217,70,239,0.1) 100%)',
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none'
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 8
        }}
      >
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Article Content */}
          <Box sx={{ 
            '& > *': { mb: 4 },
            '& h1': { 
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'text.primary',
              mb: 3
            },
            '& h2': {
              fontSize: '2rem',
              fontWeight: 600,
              color: 'text.primary',
              mb: 2
            },
            '& h3': {
              fontSize: '1.75rem',
              fontWeight: 600,
              color: 'text.primary',
              mb: 2
            },
            '& p': {
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'text.secondary',
              mb: 4
            },
            '& ul, & ol': {
              pl: 4,
              mb: 4,
              '& li': {
                mb: 1,
                fontSize: '1.125rem',
                color: 'text.secondary'
              }
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 4,
              py: 1,
              my: 4,
              fontStyle: 'italic',
              color: 'text.secondary'
            },
            '& code': {
              bgcolor: 'grey.100',
              p: 0.5,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875em'
            },
            '& pre': {
              bgcolor: 'grey.900',
              color: 'common.white',
              p: 2,
              borderRadius: 2,
              overflowX: 'auto',
              '& code': {
                bgcolor: 'transparent',
                color: 'inherit'
              }
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 4
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </Box>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Related Posts
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 4 
              }}>
                {relatedPosts.map((relatedPost) => (
                  <Paper
                    key={relatedPost.slug}
                    component={Link}
                    href={`/blogs/${relatedPost.slug}`}
                    sx={{
                      p: 3,
                      textDecoration: 'none',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                      {relatedPost.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {relatedPost.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      {/* Scroll to Top Button */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={scrollToTop}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
            width: 48,
            height: 48,
          }}
        >
          <KeyboardArrowUpIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Box>

      {/* Feedback Button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
        <FeedbackButton />
      </Box>
    </>
  );
}
