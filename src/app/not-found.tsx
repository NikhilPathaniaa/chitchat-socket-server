'use client';

import Link from 'next/link'
import { Button, Container, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'
import HomeIcon from '@mui/icons-material/Home'

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for does not exist or has been moved.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5555, #3DBDB4)',
                },
              }}
            >
              Return Home
            </Button>
          </Link>
        </motion.div>
      </Box>
    </Container>
  )
}
