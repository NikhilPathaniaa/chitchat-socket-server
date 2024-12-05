import { motion } from 'framer-motion';

const HeroAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated circles */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: '10%',
          left: '15%',
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
        animate={{
          x: [0, -70, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: '20%',
          right: '10%',
        }}
      />
      
      {/* Chat bubbles animation */}
      <motion.div
        className="absolute bottom-20 left-1/4"
        animate={{
          y: [-20, 0, -20],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute top-32 right-1/4"
        animate={{
          y: [0, -20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
            stroke="rgba(217, 70, 239, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroAnimation;
