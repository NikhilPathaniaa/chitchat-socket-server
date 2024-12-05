"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "./scroll-area"

export interface DocsSidebarNavProps {
  items: {
    title: string
    href: string
    items?: {
      title: string
      href: string
    }[]
  }[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-full py-6">
      <div className="w-full">
        {items.map((item, index) => (
          <div key={index} className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              {item.title}
            </h4>
            {item?.items?.length && (
              <DocsSidebarNavItems items={item.items} pathname={pathname} />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

interface DocsSidebarNavItemsProps {
  items: { title: string; href: string }[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
            pathname === item.href
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          )}
          target="_blank"
        >
          {item.title}
        </Link>
      ))}
    </div>
  ) : null
}
