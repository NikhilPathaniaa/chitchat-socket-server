'use client';

import { Box, Typography, Paper } from '@mui/material';
import { keyframes } from '@mui/system';

interface Message {
  from?: string;
  message: string;
  fileData?: string;
  fileName?: string;
  fileType?: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

// Define animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bubbleIn = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2,
        animation: `${slideIn} 0.3s ease-out`,
      }}
    >
      {!isOwnMessage && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            mr: 1,
            animation: `${bubbleIn} 0.3s ease-out`,
          }}
        >
          {message.from?.[0].toUpperCase()}
        </Box>
      )}

      <Paper
        elevation={1}
        sx={{
          maxWidth: '70%',
          position: 'relative',
          p: 2,
          bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
          color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
          borderRadius: isOwnMessage ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
          animation: `${bubbleIn} 0.3s ease-out`,
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '20px',
            height: '20px',
            top: 0,
            [isOwnMessage ? 'right' : 'left']: -10,
            backgroundColor: isOwnMessage ? 'primary.main' : 'background.paper',
            clipPath: isOwnMessage 
              ? 'polygon(100% 0, 0 0, 100% 100%)'
              : 'polygon(0 0, 100% 0, 0 100%)',
          },
          boxShadow: isOwnMessage 
            ? '0 4px 20px rgba(99, 102, 241, 0.2)'
            : '0 4px 20px rgba(0, 0, 0, 0.05)',
          backdropFilter: !isOwnMessage ? 'blur(10px)' : 'none',
          border: !isOwnMessage ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        {message.fileData && (
          <Box sx={{ mb: 1 }}>
            {message.fileType?.startsWith('image/') ? (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 1,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease',
                  },
                }}
              >
                <img 
                  src={message.fileData} 
                  alt={message.fileName || 'Image'} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }} 
                />
              </Box>
            ) : message.fileType?.startsWith('video/') ? (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 1,
                }}
              >
                <video 
                  src={message.fileData} 
                  controls 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                  }} 
                />
              </Box>
            ) : null}
            {message.fileName && (
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  mt: 0.5,
                  opacity: 0.8,
                  fontStyle: 'italic',
                }}
              >
                {message.fileName}
              </Typography>
            )}
          </Box>
        )}
        <Typography 
          sx={{ 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
            fontWeight: 400,
          }}
        >
          {message.message}
        </Typography>
      </Paper>

      {isOwnMessage && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            ml: 1,
            animation: `${bubbleIn} 0.3s ease-out`,
          }}
        >
          {message.from?.[0].toUpperCase()}
        </Box>
      )}
    </Box>
  );
}
