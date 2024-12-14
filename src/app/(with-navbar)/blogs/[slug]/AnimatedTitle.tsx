'use client';

import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  title: string;
}

export default function AnimatedTitle({ title }: AnimatedTitleProps) {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          fontFamily: 'Poppins',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          textShadow: '0 0 40px rgba(99, 102, 241, 0.2)',
        }}
      >
        {title}
      </motion.h1>
    </div>
  );
}
