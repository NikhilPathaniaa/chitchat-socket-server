import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow as fdn } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date | number) {
  return fdn(new Date(date), { addSuffix: true })
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const hours = Math.floor(diffInMinutes / 60);
  const days = Math.floor(hours / 24);

  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;
  
  return date.toLocaleDateString();
}
