'use client';

import { BlogPost } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';
import { motion, useScroll, useSpring } from 'framer-motion';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function BlogPostClient({ post, relatedPosts }: Props) {
  const theme = useTheme();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Box component="main" sx={{ minHeight: '100vh', pb: 8 }}>
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
      
      <Container sx={{ pt: { xs: 4, md: 8 }, pb: 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
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
                  '& img': {
                    transition: 'transform 0.3s ease-in-out'
                  },
                  '&:hover img': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Image
                  src={post.imgSrc}
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
                    background: 'linear-gradient(45deg, #3B82F6, #10B981)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
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
                      '& .MuiChip-label': {
                        px: 2,
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
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
                        '& .MuiChip-label': {
                          px: 2,
                          fontSize: '0.875rem',
                          fontWeight: 500
                        },
                        '&:hover': { bgcolor: 'primary.dark' }
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
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '0.01em'
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
                  ...theme.typography.body1,
                  fontFamily: "'Inter', sans-serif",
                  color: 'text.primary',
                  '& h1': {
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                    color: 'text.primary',
                    mt: 6,
                    mb: 4,
                    letterSpacing: '-0.02em'
                  },
                  '& h2': {
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                    color: 'text.primary',
                    mt: 5,
                    mb: 3,
                    letterSpacing: '-0.01em'
                  },
                  '& h3': {
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    fontWeight: 600,
                    fontFamily: '"Poppins", sans-serif',
                    color: 'text.primary',
                    mt: 4,
                    mb: 2
                  },
                  '& p': { 
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    mb: 4,
                    color: 'text.secondary',
                    '&:first-of-type': {
                      fontSize: '1.25rem',
                      color: 'text.primary'
                    }
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    my: 4,
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
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
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 4,
                    py: 2,
                    my: 4,
                    mx: 0,
                    bgcolor: 'action.hover',
                    borderRadius: '0 16px 16px 0',
                    '& p': {
                      fontSize: '1.25rem',
                      fontStyle: 'italic',
                      color: 'text.primary',
                      mb: 0
                    }
                  },
                  '& code': {
                    fontFamily: 'monospace',
                    bgcolor: 'grey.100',
                    color: 'primary.main',
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.875em'
                  },
                  '& pre': {
                    bgcolor: 'grey.900',
                    color: 'common.white',
                    p: 3,
                    borderRadius: '12px',
                    overflow: 'auto',
                    my: 4
                  }
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
                          src={relatedPost.imgSrc}
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={relatedPost.readTime}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
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
