"use client"

import { motion } from "framer-motion"
import { Container, Typography, Grid, Paper, Box, Card, CardContent, Chip } from '@mui/material'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import '@fontsource/poppins'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { useState, useEffect } from 'react'
import HeroAnimation from '@/components/HeroAnimation'
import ChatIllustration from '@/components/ChatIllustration'

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}))

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const slideVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

const AnimatedNumber = ({ value, duration = 2000 }: AnimatedNumberProps) => {
  const [count, setCount] = useState(0)
  const endValue = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9]/g, '')

  useEffect(() => {
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * endValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [endValue, duration])

  return <>{count}{suffix}</>
}

export default function About() {
  return (
    <Box 
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
      sx={{ 
        overflowY: 'auto',
        height: '100vh',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(var(--primary-rgb), 0.3)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(var(--primary-rgb), 0.5)',
          },
        },
      }}
    >
      {/* Hero Section with Animation */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: { xs: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pb: { xs: 4, md: 0 },
        }}
      >
        <HeroAnimation />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    mb: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    textShadow: '0 0 40px rgba(99, 102, 241, 0.2)',
                  }}
                >
                  About ChitChat
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Roboto',
                    fontWeight: 300,
                    color: 'text.secondary',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                    lineHeight: 1.6,
                    opacity: 0.9,
                    mb: 4,
                  }}
                >
                  Revolutionizing communication with real-time messaging and seamless collaboration
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {['Privacy First', 'Real-Time', 'No Storage', 'Frontend Only'].map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      sx={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#8b5cf6',
                        borderRadius: '9999px',
                        px: 2,
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideVariants}
        >
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(99, 102, 241, 0.1)',
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 300,
                color: 'text.secondary',
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              To revolutionize online communication by providing a truly private, frontend-only chat platform 
              where conversations remain ephemeral and leave no digital footprint.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4} component={motion.div} variants={container} initial="hidden" animate="show">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index} component={motion.div} variants={item}>
              <StyledPaper 
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px -10px rgba(var(--primary-rgb), 0.2)',
                  },
                }}
              >
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    mb: 1,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                  }}
                >
                  <AnimatedNumber value={stat.value} />
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>

        {/* Why Choose Us Section */}
        <Box sx={{ mt: 12, mb: 12 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              textAlign: 'center',
              mb: 6,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose ChitChat?
          </Typography>
          <Grid container spacing={4}>
            {whyChooseUs.map((reason, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledPaper
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 30px -10px rgba(var(--primary-rgb), 0.2)',
                        '&::before': {
                          transform: 'translateY(0)',
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        transform: 'translateY(-100%)',
                        transition: 'transform 0.3s ease-in-out',
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontFamily: 'Poppins',
                        mb: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 600,
                      }}
                    >
                      {reason.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        opacity: 0.9
                      }}
                    >
                      {reason.description}
                    </Typography>
                  </StyledPaper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 12 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              textAlign: 'center',
              mb: 6,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powerful Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledPaper
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 30px -10px rgba(var(--primary-rgb), 0.2)',
                        '&::before': {
                          transform: 'translateY(0)',
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        transform: 'translateY(-100%)',
                        transition: 'transform 0.3s ease-in-out',
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontFamily: 'Poppins',
                        mb: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        opacity: 0.9
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </StyledPaper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technologies Section */}
        <Box sx={{ mt: 12, mb: 12 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              textAlign: 'center',
              mb: 6,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Built with Modern Tech
          </Typography>
          <Box
            component={motion.div}
            variants={container}
            initial="hidden"
            animate="show"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(6, 1fr)',
              },
              gap: 4,
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                variants={item}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {tech.name}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

const stats = [
  { value: "0", label: "Data Stored" },
  { value: "100%", label: "Frontend Only" },
  { value: "0", label: "Backend Servers" },
  { value: "100%", label: "Privacy" },
]

const features = [
  {
    title: "No Backend Storage",
    description: "Pure frontend application - no servers, no databases. Your chats exist only in your browser's memory.",
  },
  {
    title: "Browser-Only Chat",
    description: "All messages stay in your browser. Close the tab or refresh, and everything disappears completely.",
  },
  {
    title: "Direct Peer Chat",
    description: "Connect directly with other users through WebRTC. No intermediary servers storing your conversations.",
  },
  {
    title: "Session-Only Messages",
    description: "Messages exist only during your active session. Refresh the page for a fresh, clean start.",
  },
  {
    title: "Client-Side Only",
    description: "Everything runs in your browser. No external servers or databases involved in storing messages.",
  },
  {
    title: "Temporary Memory",
    description: "Chats stored temporarily in browser memory. Close the tab, and all traces of conversations vanish.",
  },
]

const whyChooseUs = [
  {
    title: "True Privacy",
    description: "Unlike other chat apps that claim privacy but store data, we literally can't store your messages - there's no backend to store them in.",
  },
  {
    title: "No Accounts Needed",
    description: "Start chatting instantly. No sign-ups, no passwords, no personal information required. Just open and chat.",
  },
  {
    title: "Lightning Fast",
    description: "With no server roundtrips or database queries, messages are delivered instantly through peer-to-peer connections.",
  },
  {
    title: "Zero Knowledge",
    description: "We can't read your messages even if we wanted to - all communication happens directly between users.",
  },
  {
    title: "No Tracking",
    description: "No analytics, no cookies, no user tracking. Your privacy is our top priority.",
  },
  {
    title: "Open Source",
    description: "Fully transparent codebase. Verify our privacy claims yourself - see exactly how your data is handled.",
  },
]

const technologies = [
  { 
    name: "Next.js",
    logo: "/images/tech/nextjs.svg"
  },
  { 
    name: "TypeScript",
    logo: "/images/tech/typescript.svg"
  },
  { 
    name: "WebRTC",
    logo: "/images/tech/webrtc.svg"
  },
  { 
    name: "TailwindCSS",
    logo: "/images/tech/tailwind.svg"
  },
  { 
    name: "Framer Motion",
    logo: "/images/tech/framer.svg"
  },
  { 
    name: "Material UI",
    logo: "/images/tech/mui.svg"
  }
]
