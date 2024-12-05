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
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
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
    restDelta: 0.001
  });
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.onChange(v => setProgress(v));
    return () => unsubscribe();
  }, [scrollProgress]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{ flex: 1, paddingRight: '40px' }}
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
            </motion.div>

            {/* Image - Right Side */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              style={{
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
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 6, md: 12 },
          px: { xs: 3, sm: 6, md: 8 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.35rem' },
              color: 'text.secondary',
              mb: 8,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.8,
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              '& strong': {
                color: 'text.primary',
                fontWeight: 600
              }
            }}
          >
            {post.description}
          </Typography>

          <Box
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              '& .markdown-content': {
                '& p': {
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  lineHeight: 1.9,
                  color: 'text.primary',
                  mb: 4,
                  fontFamily: "'Inter', sans-serif",
                  '& strong': {
                    color: alpha(theme.palette.primary.main, 0.9),
                    fontWeight: 600
                  }
                },
                '& h2': {
                  ...gradientTextStyle,
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                  mt: 10,
                  mb: 4,
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '-0.02em'
                },
                '& h3': {
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  color: 'text.primary',
                  mt: 8,
                  mb: 3,
                  letterSpacing: '-0.01em'
                },
                '& ul': {
                  pl: 4,
                  mb: 6,
                  '& li': {
                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                    lineHeight: 1.8,
                    color: 'text.primary',
                    mb: 2,
                    fontFamily: "'Inter', sans-serif",
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -24,
                      top: '0.75em',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    }
                  }
                },
                '& code': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  padding: '3px 8px',
                  borderRadius: 1,
                  fontSize: '0.9em',
                  fontFamily: "'Fira Code', monospace",
                  color: theme.palette.primary.main
                },
                '& pre': {
                  backgroundColor: '#1a1a1a',
                  padding: 4,
                  borderRadius: 2,
                  overflow: 'auto',
                  mb: 6,
                  '& code': {
                    backgroundColor: 'transparent',
                    color: '#fff',
                    padding: 0,
                    fontSize: '0.95em',
                    fontFamily: "'Fira Code', monospace"
                  }
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 4,
                  py: 2,
                  my: 6,
                  mx: 0,
                  fontStyle: 'italic',
                  color: alpha(theme.palette.text.primary, 0.8),
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  borderRadius: '0 8px 8px 0',
                  '& p': {
                    mb: 0
                  }
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  my: 6
                }
              }
            }}
          >
            <div className="markdown-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </Box>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 12 }}>
            <Typography variant="h2" sx={{
              ...gradientTextStyle,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
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
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{
                      p: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'transparent',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 50%, rgba(217,70,239,0.05) 100%)'
                      }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'text.primary', 
                          mb: 2,
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600 
                        }}
                      >
                        {relatedPost.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          fontFamily: "'Inter', sans-serif" 
                        }}
                      >
                        {relatedPost.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Link>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Scroll to Top Button with Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 10
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 56,
            height: 56
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            style={{
              position: 'absolute',
              transform: 'rotate(-90deg)'
            }}
          >
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke={alpha(theme.palette.primary.main, 0.2)}
              strokeWidth="3"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray="163.36"
              style={{
                strokeDashoffset: useTransform(
                  scrollYProgress,
                  [0, 1],
                  [163.36, 0]
                ),
              }}
            />
          </svg>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'white'
              }
            }}
          >
            <KeyboardArrowUpIcon 
              sx={{ 
                color: 'primary.main',
                fontSize: '1.8rem'
              }} 
            />
          </IconButton>
        </Box>
      </motion.div>

      {/* Feedback Button */}
      <Box sx={{ position: 'fixed', bottom: 32, left: 32, zIndex: 10 }}>
        <FeedbackButton />
      </Box>
    </>
  );
}
