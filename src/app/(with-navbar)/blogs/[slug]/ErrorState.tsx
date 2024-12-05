"use client";

import { Container, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function ErrorState() {
  return (
    <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Blog Post Not Found</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The blog post you're looking for doesn't exist.
      </Typography>
      <Link href="/blogs" passHref>
        <IconButton 
          component="a"
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
