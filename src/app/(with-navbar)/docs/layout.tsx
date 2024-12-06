"use client"

import Link from "next/link"
import { DocsSidebarNav } from "@/components/ui/sidebar-nav"
import { docsConfig } from "@/config/docs"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ChitChat</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/docs/components"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Components
            </Link>
            <Link
              href="/examples"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Examples
            </Link>
            <Link
              href="https://github.com/yourusername/chitchat"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </header>
      <div className="container flex-1">
        <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </aside>
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">
              <div className="pb-12 pt-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
