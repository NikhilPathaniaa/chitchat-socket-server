'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const InstallationPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Installation Guide
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to the ChitChat installation guide. Follow these steps to get started with our platform.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Prerequisites
          </Typography>
          <Typography variant="body1" component="div">
            Before installing ChitChat, ensure you have:
            <ul>
              <li>Node.js 18.17.0 or higher</li>
              <li>npm or yarn package manager</li>
              <li>Git (optional, but recommended)</li>
            </ul>
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Installation Steps
          </Typography>
          <Typography variant="body1" component="div">
            1. Clone the repository:
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                my: 2
              }}
            >
              git clone https://github.com/yourusername/chitchat.git
            </Box>

            2. Install dependencies:
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                my: 2
              }}
            >
              npm install
              # or
              yarn install
            </Box>

            3. Start the development server:
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                my: 2
              }}
            >
              npm run dev
              # or
              yarn dev
            </Box>
          </Typography>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default InstallationPage;
