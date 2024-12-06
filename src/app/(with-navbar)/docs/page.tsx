'use client';

import Link from "next/link"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DocsPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="h-full container py-2">
        {/* Hero Section - Ultra Compact */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Documentation
          </h1>
          <p className="text-[8px] text-muted-foreground">
            Build amazing real-time chat applications
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-1.5 h-[calc(100%-3rem)]">
          {/* Main Content - Left */}
          <div className="col-span-8 grid grid-rows-4 gap-1.5">
            {/* Feature Cards - Top */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="row-span-3 grid grid-cols-2 gap-1.5"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="group relative overflow-hidden rounded-md border bg-background/50 p-1.5 backdrop-blur-sm hover:shadow-sm hover:shadow-primary/5"
                >
                  <h3 className="font-medium text-[8px] mb-1">{feature.title}</h3>
                  <p className="text-[7px] text-muted-foreground mb-1.5">{feature.description}</p>
                  <Link
                    href={feature.href}
                    className="text-[7px] text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    Learn more
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Start - Bottom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden rounded-md border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-1.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[8px] font-bold mb-0.5">Ready to Get Started?</h2>
                  <p className="text-[7px] text-muted-foreground">
                    Follow our quick start guide
                  </p>
                </div>
                <Link
                  href="/docs/installation"
                  className="inline-flex items-center rounded-sm bg-primary px-2 py-1 text-[7px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Quick Start
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Updates - Right */}
          <motion.div
            className="col-span-4 rounded-md border bg-background/50 backdrop-blur-sm p-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-[8px] font-bold mb-1">Latest Updates</h2>
            <div className="space-y-1">
              {updates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <h3 className="text-[7px] font-medium group-hover:text-primary transition-colors">
                    {update.title}
                  </h3>
                  <p className="text-[6px] text-muted-foreground">{update.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Getting Started",
    description: "Quick setup guide to integrate ChitChat in your app",
    href: "/docs/installation",
  },
  {
    title: "Chat Components",
    description: "Beautiful and accessible chat interface components",
    href: "/docs/components",
  },
  {
    title: "File Sharing",
    description: "Implement secure file sharing in your chat",
    href: "/docs/features/file-sharing",
  },
  {
    title: "Video Calls",
    description: "Add video calling with just a few lines of code",
    href: "/docs/features/video-calls",
  },
  {
    title: "API Reference",
    description: "Complete API documentation for developers",
    href: "/docs/api",
  },
  {
    title: "Examples",
    description: "Real-world examples and code snippets",
    href: "/docs/examples",
  },
]

const updates = [
  {
    title: "Video Calls Beta",
    description: "New video calling feature with up to 4 participants",
  },
  {
    title: "File Sharing Update",
    description: "Added file preview and progress tracking",
  },
  {
    title: "Performance Boost",
    description: "Major optimizations for large chat rooms",
  },
  {
    title: "New Components",
    description: "Added message threading and reactions",
  },
]
