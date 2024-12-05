'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { BiTime } from 'react-icons/bi';
import type { BlogPost } from '@/lib/blog';
import { useRef } from 'react';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const router = useRouter();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const springConfig = { stiffness: 100, damping: 15, mass: 0.5 };
  const y = useSpring(isInView ? 0 : 100, springConfig);
  const scale = useSpring(isInView ? 1 : 0.8, springConfig);
  const opacity = useSpring(isInView ? 1 : 0, springConfig);

  return (
    <motion.div
      ref={cardRef}
      style={{
        y,
        scale,
        opacity,
        cursor: 'pointer'
      }}
      whileHover={{ 
        scale: 1.03,
        y: -15,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      onClick={() => router.push(`/blogs/${post.slug}`)}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'perspective(1000px) rotateX(0deg)',
          '&:hover': {
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            transform: 'perspective(1000px) rotateX(2deg)',
            '& .arrow-icon': {
              transform: 'translateX(6px) rotate(0deg)',
              color: '#6366F1',
            },
            '& .card-image': {
              transform: 'scale(1.08) rotate(-1deg)',
            }
          }
        }}
      >
        {post.imgSrc && (
          <Box sx={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
            <Image
              src={post.imgSrc}
              alt={post.title}
              fill
              className="card-image"
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {post.isExpertPost && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Chip
                    label="Expert Insights"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </motion.div>
              )}
              {post.type === 'tip' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Chip
                    label="Chat Tips"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </motion.div>
              )}
              {post.isUpdate && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <Chip
                    label="Latest Update"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </motion.div>
              )}
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4,
              }}
            >
              {post.title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '25%',
                  height: '1.6em',
                  background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9) 50%)',
                }
              }}
            >
              {post.description}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BiTime style={{ opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary">
                {post.readTime}
              </Typography>
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <motion.div
                initial={{ rotate: -45, x: -5 }}
                animate={{ rotate: -45, x: -5 }}
                whileHover={{ 
                  rotate: 0,
                  x: 5,
                  transition: { type: "spring", stiffness: 200, damping: 10 }
                }}
              >
                <HiArrowRight 
                  size={20} 
                  className="arrow-icon"
                  style={{ 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
