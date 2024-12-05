'use client';

import { useEffect } from 'react'
import { Button, Container, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container maxWidth="sm">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {error.message || 'An unexpected error occurred'}
        </Typography>
        <Button
          variant="contained"
          onClick={reset}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5555, #3DBDB4)',
            },
          }}
        >
          Try again
        </Button>
      </Box>
    </Container>
  )
}
