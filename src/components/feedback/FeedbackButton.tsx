'use client';

import { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography, Dialog } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { FeedbackForm } from './FeedbackForm';

const feedbackTypes = [
  { type: 'general', label: 'General Feedback', icon: <FeedbackIcon /> },
  { type: 'bug', label: 'Report a Bug', icon: <BugReportIcon /> },
  { type: 'feature', label: 'Feature Request', icon: <LightbulbIcon /> },
  { type: 'praise', label: 'Share Praise', icon: <ThumbUpIcon /> },
] as const;

type FeedbackType = typeof feedbackTypes[number]['type'];

export function FeedbackButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackType>('general');
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFeedbackTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
    handleClose();
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'translateY(-4px)',
            },
            width: 48,
            height: 48,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <FeedbackIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: -1,
            minWidth: 220,
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {feedbackTypes.map((item) => (
          <MenuItem
            key={item.type}
            onClick={() => handleFeedbackTypeSelect(item.type)}
            sx={{
              py: 1.5,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: '8px',
              mx: 0.5,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Box
              sx={{
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {item.icon}
            </Box>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="lg"
        fullWidth
      >
        <FeedbackForm 
          feedbackType={selectedType}
          onClose={handleFormClose}
        />
      </Dialog>
    </>
  );
}
