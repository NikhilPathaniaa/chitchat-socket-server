'use client';

import { motion } from "framer-motion"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRightIcon,
  CheckIcon,
  CommandLineIcon,
  CubeIcon,
  ServerIcon,
} from "@heroicons/react/24/solid"

const steps = [
  {
    title: "Install Dependencies",
    description: "Install the ChitChat packages using your preferred package manager.",
    icon: CubeIcon,
  },
  {
    title: "Configure Server",
    description: "Set up your WebSocket server and configure environment variables.",
    icon: ServerIcon,
  },
  {
    title: "Initialize Client",
    description: "Add ChitChat components to your React application.",
    icon: CommandLineIcon,
  },
]

export default function InstallationPage() {
  return (
    <motion.div
      className="container max-w-4xl py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col items-start gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
        >
          Installation
          <div className="mx-2 h-4 w-px bg-primary/20" />
          <span className="text-primary/80">v1.0.0</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          Getting Started with ChitChat
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Follow these steps to integrate ChitChat into your application.
        </motion.p>
      </div>

      {/* Prerequisites */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
        <div className="grid gap-4">
          {prerequisites.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border p-4 bg-background/50"
            >
              <CheckIcon className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Installation Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6">Installation Steps</h2>
        <div className="relative">
          <div className="absolute left-8 top-8 bottom-8 w-px bg-border" />
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative pl-16"
              >
                <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full border bg-background shadow-sm">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  {index === 0 && (
                    <Tabs defaultValue="npm" className="w-full">
                      <TabsList className="w-full justify-start">
                        <TabsTrigger value="npm">npm</TabsTrigger>
                        <TabsTrigger value="yarn">yarn</TabsTrigger>
                        <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                      </TabsList>
                      <TabsContent value="npm" className="mt-4">
                        <div className="rounded-lg bg-muted p-4">
                          <pre className="text-sm">
                            <code>npm install @chitchat/core @chitchat/react</code>
                          </pre>
                        </div>
                      </TabsContent>
                      <TabsContent value="yarn" className="mt-4">
                        <div className="rounded-lg bg-muted p-4">
                          <pre className="text-sm">
                            <code>yarn add @chitchat/core @chitchat/react</code>
                          </pre>
                        </div>
                      </TabsContent>
                      <TabsContent value="pnpm" className="mt-4">
                        <div className="rounded-lg bg-muted p-4">
                          <pre className="text-sm">
                            <code>pnpm add @chitchat/core @chitchat/react</code>
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                  {index === 1 && (
                    <div className="rounded-lg bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// .env.local
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-server.com
NEXT_PUBLIC_API_KEY=your-api-key

// server.ts
import { createServer } from '@chitchat/server'

const server = createServer({
  port: process.env.PORT || 3000,
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
  },
})`}</code>
                      </pre>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="rounded-lg bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// app/chat/page.tsx
import { ChatWindow } from '@chitchat/react'

export default function ChatPage() {
  return (
    <ChatWindow
      userId="user123"
      roomId="room456"
      onMessage={(msg) => console.log(msg)}
    />
  )
}`}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-lg border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <ArrowRightIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
            <p className="text-muted-foreground mb-4">
              Now that you have ChitChat installed, learn how to use its features and components.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/docs/features/messaging"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Explore Features
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/docs/components"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                View Components
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const prerequisites = [
  {
    title: "Node.js 14.0 or later",
    description: "ChitChat requires Node.js version 14.0 or higher. Download it from nodejs.org",
  },
  {
    title: "Package Manager",
    description: "npm (v6.0+), yarn (v1.22+), or pnpm (v6.0+)",
  },
  {
    title: "React 18",
    description: "ChitChat is built for React 18 and takes advantage of its latest features.",
  },
]
