'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: '#8b5cf6',
          }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#6366f1',
            fontWeight: 500,
          }}
        >
          Loading...
        </Typography>
      </motion.div>
    </Box>
  );
}
