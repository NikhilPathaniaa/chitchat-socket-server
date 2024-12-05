'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';

export default function BlogNavigation({ prevPost, nextPost }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      mt: 4,
      pt: 4,
      borderTop: '1px solid',
      borderColor: 'divider'
    }}>
      {prevPost ? (
        <Link 
          href={`/blogs/${encodeURIComponent(prevPost.slug)}`} 
          style={{ textDecoration: 'none' }}
          passHref
        >
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Previous Post
              </Typography>
              <Typography variant="subtitle2" color="text.primary">
                {prevPost.title}
              </Typography>
            </Box>
          </Button>
        </Link>
      ) : (
        <Box></Box>
      )}

      {nextPost ? (
        <Link 
          href={`/blogs/${encodeURIComponent(nextPost.slug)}`} 
          style={{ textDecoration: 'none' }}
          passHref
        >
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Next Post
              </Typography>
              <Typography variant="subtitle2" color="text.primary">
                {nextPost.title}
              </Typography>
            </Box>
          </Button>
        </Link>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}
