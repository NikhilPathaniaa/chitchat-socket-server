'use client';

import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#ef4444',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Something went wrong!
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
          {error.message || 'An unexpected error occurred. Please try again.'}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          variant="contained"
          onClick={reset}
          sx={{
            bgcolor: '#8b5cf6',
            '&:hover': {
              bgcolor: '#7c3aed',
            },
          }}
        >
          Try again
        </Button>
      </motion.div>
    </Box>
  );
}
