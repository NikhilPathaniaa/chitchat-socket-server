'use client';

import { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket/context';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ChatPage() {
  const [username, setUsername] = useState('');
  const { setUsername: setContextUsername, connect } = useSocket();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    try {
      setContextUsername(username.trim());
      connect();
      router.push('/chat/room');
      toast.success('Connected successfully!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to connect. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        elevation={4}
        sx={{
          width: '100%',
          p: 4,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          bgcolor: 'background.paper',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: 0.1
          }}
        >
          <Image
            src="/logo.svg"
            alt="ChitChat Logo"
            width={80}
            height={80}
            priority
          />
        </motion.div>

        <Typography
          variant="h4"
          component={motion.h4}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: 0.2
          }}
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Welcome to ChitChat
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Enter your username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              textTransform: 'none',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
              },
            }}
          >
            Join Chat
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
