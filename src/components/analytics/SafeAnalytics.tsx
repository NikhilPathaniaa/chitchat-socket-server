'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface SafeMetric {
  label: string;
  value: string | number;
  description: string;
}

const SafeAnalytics = () => {
  // Example of safe metrics we can track
  const safeMetrics: SafeMetric[] = [
    {
      label: 'Total Active Rooms',
      value: '---',
      description: 'Number of active chat rooms (anonymous)'
    },
    {
      label: 'Blog Views',
      value: '---',
      description: 'Total blog post views'
    },
    {
      label: 'Peak Hours',
      value: '---',
      description: 'Most active time of day'
    },
    {
      label: 'Site Visits',
      value: '---',
      description: 'Public page visits only'
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Site Analytics
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          * All metrics are anonymous and exclude private chat data
        </Typography>
      </Typography>
      
      <Grid container spacing={3}>
        {safeMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" sx={{ my: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SafeAnalytics;
