'use client';

import { getAllPosts } from '@/lib/blog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField,
  Chip,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Zoom
} from '@mui/material';
import { BlogCard } from '@/components/blog/BlogCard';
import { useState, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MessageIcon from '@mui/icons-material/Message';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

const FEATURES = [
  { 
    icon: <LightbulbIcon />, 
    text: "Expert Insights",
    filter: "expert" 
  },
  { 
    icon: <MessageIcon />, 
    text: "Real-time Chat Tips",
    filter: "tips" 
  },
  { 
    icon: <AutoStoriesIcon />, 
    text: "Latest Updates",
    filter: "updates" 
  },
];

export default function BlogList() {
  const allPosts = getAllPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter posts based on search and selected feature
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!selectedFilter) return matchesSearch;

      // Match posts based on the selected feature
      switch(selectedFilter) {
        case 'expert':
          return matchesSearch && post.isExpertPost;
        case 'tips':
          return matchesSearch && post.type === 'tip';
        case 'updates':
          return matchesSearch && post.isUpdate;
        default:
          return matchesSearch;
      }
    });
  }, [allPosts, searchQuery, selectedFilter]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'transparent',
      position: 'relative',
    }}>
      <AnimatedBackground />
      
      {/* Header Section */}
      <Container maxWidth="lg" sx={{ pt: 20, pb: 16 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Discover ChitChat
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Explore the future of communication through our curated articles and insights.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Tooltip 
                      title={feature.text} 
                      placement="top" 
                      TransitionComponent={Zoom}
                    >
                      <Chip
                        icon={feature.icon}
                        label={feature.text}
                        onClick={() => setSelectedFilter(
                          selectedFilter === feature.filter ? null : feature.filter
                        )}
                        sx={{
                          bgcolor: selectedFilter === feature.filter 
                            ? 'rgba(99, 102, 241, 0.2)' 
                            : 'rgba(99, 102, 241, 0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          px: 2,
                          py: 1.5,
                          '& .MuiChip-label': {
                            fontSize: '0.95rem',
                            fontWeight: 500,
                          },
                          '& .MuiChip-icon': {
                            fontSize: '1.1rem',
                          },
                        }}
                      />
                    </Tooltip>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search for tips, guides, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '50px',
                      bgcolor: 'white',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.12)',
                      },
                      transition: 'all 0.3s ease',
                    }
                  }}
                />

                <motion.div
                  initial={false}
                  animate={{ 
                    height: showFilters ? 'auto' : 0,
                    opacity: showFilters ? 1 : 0,
                    marginTop: showFilters ? 16 : 0
                  }}
                  style={{ overflow: 'hidden' }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    p: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  }}>
                    <Button
                      variant={selectedFilter === null ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setSelectedFilter(null)}
                      sx={{
                        borderRadius: '50px',
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 2,
                      }}
                    >
                      All
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Blog Posts Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <BlogCard post={post} index={index} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Box 
              sx={{ 
                textAlign: 'center', 
                mt: 8,
                p: 4,
                borderRadius: 4,
                bgcolor: 'rgba(99, 102, 241, 0.05)',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No articles found
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your search or filters to find what you're looking for.
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
