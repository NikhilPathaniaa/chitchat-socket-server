'use client';

import React from 'react';
import {
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FeedbackFormProps {
  onClose: () => void;
  feedbackType: 'general' | 'bug' | 'feature' | 'praise';
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, feedbackType }) => {
  const getFeedbackTitle = () => {
    switch (feedbackType) {
      case 'bug':
        return 'Report a Bug';
      case 'feature':
        return 'Request a Feature';
      case 'praise':
        return 'Share Your Praise';
      default:
        return 'General Feedback';
    }
  };

  // Get the appropriate Tally form URL based on feedback type
  const getTallyFormUrl = () => {
    switch (feedbackType) {
      case 'bug':
        return 'https://tally.so/embed/wLErVl'; // Bug report form
      case 'feature':
        return 'https://tally.so/embed/w7JAe0'; // Feature request form
      case 'praise':
        return 'https://tally.so/embed/mYo6yW'; // Praise form
      default:
        return 'https://tally.so/embed/mRZNlj'; // General feedback form
    }
  };

  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {getFeedbackTitle()}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 1, height: '60vh', minHeight: 400, p: 0 }}>
        <iframe
          src={getTallyFormUrl()}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Feedback Form"
          style={{
            background: 'transparent',
            border: 'none',
          }}
        />
      </DialogContent>
    </>
  );
};
