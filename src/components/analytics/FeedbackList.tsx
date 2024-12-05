'use client';

import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Chip, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion } from 'framer-motion';

interface Feedback {
  id: number;
  user: string;
  message: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
}

const mockFeedback: Feedback[] = [
  {
    id: 1,
    user: 'John D.',
    message: 'Great chat experience! Very smooth and intuitive.',
    sentiment: 'positive',
    date: '2 hours ago'
  },
  {
    id: 2,
    user: 'Sarah M.',
    message: 'The blog section could use better navigation.',
    sentiment: 'neutral',
    date: '5 hours ago'
  },
  {
    id: 3,
    user: 'Mike R.',
    message: 'Love the new design updates!',
    sentiment: 'positive',
    date: 'Yesterday'
  },
  {
    id: 4,
    user: 'Emma S.',
    message: 'Had some issues with message delivery.',
    sentiment: 'negative',
    date: '2 days ago'
  }
];

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return <ThumbUpIcon sx={{ color: '#10B981' }} />;
    case 'negative':
      return <ThumbDownIcon sx={{ color: '#EF4444' }} />;
    default:
      return <RemoveIcon sx={{ color: '#6B7280' }} />;
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '#10B981';
    case 'negative':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export default function FeedbackList() {
  return (
    <List sx={{ width: '100%', bgcolor: 'transparent' }}>
      {mockFeedback.map((feedback, index) => (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ListItem
            sx={{
              mb: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${getSentimentColor(feedback.sentiment)}15` }}>
                {getSentimentIcon(feedback.sentiment)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">{feedback.user}</Typography>
                  <Chip
                    label={feedback.sentiment}
                    size="small"
                    sx={{
                      bgcolor: `${getSentimentColor(feedback.sentiment)}15`,
                      color: getSentimentColor(feedback.sentiment),
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', my: 0.5 }}
                  >
                    {feedback.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {feedback.date}
                  </Typography>
                </>
              }
            />
          </ListItem>
        </motion.div>
      ))}
    </List>
  );
}
