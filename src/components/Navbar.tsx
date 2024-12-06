'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const navItems = [
  { name: "About", path: "/about" },
  { name: "Blogs", path: "/blogs" },
  { name: "Chat", path: "/chat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MotionBox
      component="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bgcolor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(5px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
        zIndex: 1000,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo Section - Left Corner */}
          <Link href="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
            <MotionBox
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer'
              }}
            >
              <MotionBox
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                animate={{
                  y: [0, -3, 0],
                  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  p: 1,
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.15)',
                }}
              >
                <ChatBubbleOutlineIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </MotionBox>
              <Box>
                <MotionTypography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.5px'
                  }}
                >
                  ChitChat
                </MotionTypography>
              </Box>
            </MotionBox>
          </Link>

          {/* Center Section - Empty */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links - Desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 4 }}>
              {navItems.map((item, i) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  style={{ textDecoration: 'none' }}
                >
                  <MotionBox
                    onHoverStart={() => setHovered(item.name)}
                    onHoverEnd={() => setHovered(null)}
                    sx={{ position: 'relative' }}
                  >
                    <Typography
                      sx={{
                        color: pathname === item.path ? 'primary.main' : 'text.primary',
                        fontWeight: pathname === item.path ? 600 : 400,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {item.name}
                    </Typography>
                    <AnimatePresence>
                      {hovered === item.name && (
                        <MotionBox
                          layoutId="navbar-underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          sx={{
                            position: 'absolute',
                            bottom: -2,
                            left: 0,
                            right: 0,
                            height: 2,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </MotionBox>
                </Link>
              ))}
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    background: 'rgba(33, 150, 243, 0.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      typography: 'body2',
                      fontWeight: 500,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      },
                    },
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    onClick={handleMenuClose}
                    component={Link}
                    href={item.path}
                    selected={pathname === item.path}
                    sx={{
                      color: pathname === item.path ? 'primary.main' : 'inherit',
                      fontWeight: pathname === item.path ? 600 : 500,
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Box>
      </Container>
    </MotionBox>
  );
}
