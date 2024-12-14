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

const stagger = {
  visible: {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: theme.palette.primary.main,
          transformOrigin: '0%',
          scaleX
        }}
      />

      <Container maxWidth="lg">
        <Box component={motion.div} 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          sx={{ mt: 8, mb: 6 }}>
          {/* Category and Read Time */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Chip
              label={post.category}
              color="primary"
              sx={{ 
                borderRadius: '16px',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            />
            <Chip
              icon={<AccessTimeIcon />}
              label={post.readTime}
              variant="outlined"
              sx={{ 
                borderRadius: '16px',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              fontWeight: 800,
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(99, 102, 241, 0.2)'
            }}
          >
            {post.title}
          </Typography>
        </Box>

        {/* Content */}
        <Box
          component={motion.div}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          sx={{
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 4
            },
            '& h2': {
              fontSize: '2rem',
              fontWeight: 700,
              mt: 6,
              mb: 3,
              color: theme.palette.text.primary
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              color: theme.palette.text.primary
            },
            '& p': {
              fontSize: '1.125rem',
              lineHeight: 1.7,
              mb: 4,
              color: theme.palette.text.secondary
            },
            '& ul, & ol': {
              pl: 4,
              mb: 4
            },
            '& li': {
              fontSize: '1.125rem',
              lineHeight: 1.7,
              mb: 2,
              color: theme.palette.text.secondary
            },
            '& code': {
              backgroundColor: theme.palette.grey[100],
              padding: '0.2em 0.4em',
              borderRadius: 1,
              fontSize: '0.875em',
              fontFamily: 'monospace'
            },
            '& pre': {
              backgroundColor: theme.palette.grey[900],
              color: theme.palette.common.white,
              padding: 3,
              borderRadius: 2,
              overflow: 'auto',
              mb: 4,
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
                color: 'inherit'
              }
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              pl: 3,
              py: 1,
              my: 4,
              fontStyle: 'italic',
              backgroundColor: theme.palette.grey[50],
              borderRadius: 1
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Box>

        {/* Scroll to Top Button */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 10
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              },
              width: 48,
              height: 48
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Box>

        {/* Feedback Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 4 }}>
          <FeedbackButton />
        </Box>
      </Container>
    </>
  );
}
