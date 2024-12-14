'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { motion, useScroll, useTransform, useSpring, useInView, motionValue } from 'framer-motion';
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

const MotionCard = motion(Card);

export function BlogCard({ post, index }: BlogCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef as React.RefObject<Element>, { once: true, margin: "-100px" });

  const springConfig = { stiffness: 100, damping: 15, mass: 0.5 };
  const y = useSpring(isInView ? 0 : 100, springConfig);
  const scale = useSpring(isInView ? 1 : 0.8, springConfig);
  const opacity = useSpring(useTransform(isInView ? motionValue(0) : motionValue(100), [0, 100], [0, 1]));

  const handleClick = () => {
    router.push(`/blogs/${post.slug}`);
  };

  return (
    <MotionCard
      ref={cardRef}
      style={{
        y,
        scale: Number(scale.get()),
        opacity: Number(opacity.get())
      }}
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        '&:hover': {
          '& .blog-image': {
            transform: 'scale(1.05)'
          },
          '& .arrow-icon': {
            transform: 'translateX(4px)'
          }
        }
      }}
      elevation={1}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden'
        }}
      >
        <Image
          src={post.imgSrc}
          alt={post.title}
          fill
          className="blog-image"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 500
            }}
          />
          {post.isExpertPost && (
            <Chip
              label="Expert"
              size="small"
              sx={{
                ml: 1,
                bgcolor: 'secondary.main',
                color: 'white',
                fontWeight: 500
              }}
            />
          )}
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {post.description}
        </Typography>

        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <BiTime style={{ marginRight: '0.5rem' }} />
            <Typography variant="caption">
              {post.readTime}
            </Typography>
          </Box>

          <Box
            className="arrow-icon"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <HiArrowRight size={20} />
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
}
