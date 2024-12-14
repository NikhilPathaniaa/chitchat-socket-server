'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { BlogPost } from '@/lib/blog';
import { Box, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { HTMLMotionProps } from 'framer-motion';

interface BlogCardProps {
  post: BlogPost;
}

const MotionCard = motion(Card);

const BlogCard = ({ post }: BlogCardProps) => {
  const { title, description, category, readTime, slug } = post;
  
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 4,
        '& .MuiCardActionArea-root': {
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }
      }}
      elevation={1}
    >
      <CardActionArea
        component={Link}
        href={`/blogs/${slug}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        <CardContent sx={{ p: 3, width: '100%' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textTransform: 'uppercase',
              mb: 1,
              display: 'block'
            }}
          >
            {category}
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {description}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'text.secondary',
            mt: 'auto'
          }}>
            <FiClock style={{ marginRight: '0.5rem' }} />
            <Typography variant="caption">
              {readTime} min read
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </MotionCard>
  );
};

export default BlogCard;
