import { motion } from 'framer-motion';

const ChatIllustration = () => {
  return (
    <motion.svg
      width="600"
      height="400"
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      {/* Background gradient circles */}
      <motion.circle
        cx="300"
        cy="200"
        r="180"
        fill="url(#gradient1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1 }}
      />
      <motion.circle
        cx="300"
        cy="200"
        r="150"
        fill="url(#gradient2)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Left person with chat bubble */}
      <motion.g
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <circle cx="180" cy="200" r="50" fill="#6366f1" />
        <path
          d="M180 170c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"
          fill="white"
        />
        <motion.path
          d="M230 160h100v60h-20l-10 20-10-20h-60v-60z"
          fill="#6366f1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      </motion.g>

      {/* Right person with chat bubble */}
      <motion.g
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <circle cx="420" cy="200" r="50" fill="#8b5cf6" />
        <path
          d="M420 170c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"
          fill="white"
        />
        <motion.path
          d="M270 240h100v60h-60l-10 20-10-20h-20v-60z"
          fill="#8b5cf6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
      </motion.g>

      {/* Animated dots in chat bubbles */}
      <motion.g
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1
            }
          }
        }}
      >
        <motion.circle
          cx="260"
          cy="190"
          r="5"
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        />
        <motion.circle
          cx="280"
          cy="190"
          r="5"
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        />
        <motion.circle
          cx="300"
          cy="190"
          r="5"
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        />
      </motion.g>

      {/* Animated dots in second chat bubble */}
      <motion.g
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
              delay: 0.5
            }
          }
        }}
      >
        <motion.circle
          cx="300"
          cy="270"
          r="5"
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        />
        <motion.circle
          cx="320"
          cy="270"
          r="5"
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        />
        <motion.circle
          cx="340"
          cy="270"
          r="5"
          fill="white"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        />
      </motion.g>

      {/* Gradients */}
      <defs>
        <radialGradient
          id="gradient1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(300 200) rotate(90) scale(180)"
        >
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
        <radialGradient
          id="gradient2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(300 200) rotate(90) scale(150)"
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

export default ChatIllustration;
