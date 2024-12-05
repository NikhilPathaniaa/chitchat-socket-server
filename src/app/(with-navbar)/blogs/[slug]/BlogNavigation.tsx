'use client';

import { BlogPost } from '@/data/blog-data';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Post {
  slug: string;
  title: string;
}

interface BlogNavigationProps {
  prevPost?: Post;
  nextPost?: Post;
}

export default function BlogNavigation({ prevPost, nextPost }: BlogNavigationProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4,
        py: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {prevPost ? (
        <Link 
          href={`/blogs/${prevPost.slug}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          <Box>
            <Typography variant="body2" color="textSecondary">
              Previous
            </Typography>
            <Typography variant="body1">
              {prevPost.title}
            </Typography>
          </Box>
        </Link>
      ) : (
        // Empty box to maintain spacing
        <Box />
      )}

      {nextPost ? (
        <Link 
          href={`/blogs/${nextPost.slug}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="textSecondary">
              Next
            </Typography>
            <Typography variant="body1">
              {nextPost.title}
            </Typography>
          </Box>
          <ArrowRight size={20} style={{ marginLeft: '8px' }} />
        </Link>
      ) : (
        // Empty box to maintain spacing
        <Box />
      )}
    </Box>
  );
}
