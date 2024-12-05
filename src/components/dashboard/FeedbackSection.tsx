'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import { motion } from 'framer-motion';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FeedbackIcon from '@mui/icons-material/Feedback';

const FORM_IDS = {
  bug: 'wLErVl',
  feature: 'w7JAe0',
  praise: 'mYo6yW',
  general: 'mRZNlj'
};

export const FeedbackSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const getTallyDashboardUrl = () => {
    switch (activeTab) {
      case 1:
        return `https://tally.so/forms/${FORM_IDS.bug}/responses`; // Bug reports
      case 2:
        return `https://tally.so/forms/${FORM_IDS.feature}/responses`; // Feature requests
      case 3:
        return `https://tally.so/forms/${FORM_IDS.praise}/responses`; // Praise
      case 4:
        return `https://tally.so/forms/${FORM_IDS.general}/responses`; // General feedback
      default:
        return `https://tally.so/forms`; // All forms
    }
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 3, height: '100%', overflow: 'hidden' }}
    >
      <Typography variant="h6" gutterBottom>
        Feedback Dashboard
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="All Forms" />
        <Tab icon={<BugReportIcon />} label="Bugs" />
        <Tab icon={<EmojiObjectsIcon />} label="Features" />
        <Tab icon={<ThumbUpIcon />} label="Praise" />
        <Tab icon={<FeedbackIcon />} label="General" />
      </Tabs>

      <Box sx={{ height: 'calc(100vh - 250px)', overflow: 'hidden' }}>
        <iframe
          src={getTallyDashboardUrl()}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
          title="Feedback Dashboard"
        />
      </Box>
    </Paper>
  );
};
