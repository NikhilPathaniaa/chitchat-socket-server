import { Container, Box, IconButton, Typography, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';
import { BiTime } from 'react-icons/bi';

interface BlogContentProps {
  post: BlogPost;
  prevPost?: BlogPost;
  nextPost?: BlogPost;
}

export default function BlogContent({ post, prevPost, nextPost }: BlogContentProps) {
  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Blog Post Not Found</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The blog post you're looking for doesn't exist.
        </Typography>
        <Link href="/blogs">
          <IconButton 
            sx={{ 
              backgroundColor: 'background.paper',
              boxShadow: 1,
              '&:hover': { backgroundColor: 'background.paper' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Link>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Link href="/blogs">
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {prevPost && (
                <Link href={`/blogs/${prevPost.slug}`}>
                  <IconButton>
                    <ArrowBackIcon />
                  </IconButton>
                </Link>
              )}
              {nextPost && (
                <Link href={`/blogs/${nextPost.slug}`}>
                  <IconButton>
                    <ArrowForwardIcon />
                  </IconButton>
                </Link>
              )}
            </Box>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontFamily: 'Poppins',
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}
            >
              {post.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              {post.isExpertPost && (
                <Chip 
                  label="Expert Insights"
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BiTime />
                <Typography variant="body2" color="text.secondary">
                  {post.readTime}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box>
            {post.imgSrc && (
              <Box
                component="img"
                src={post.imgSrc}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  mb: 4
                }}
              />
            )}
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8,
                color: 'text.secondary',
                whiteSpace: 'pre-wrap'
              }}
            >
              {post.content}
            </Typography>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}
