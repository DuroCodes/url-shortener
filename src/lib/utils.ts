import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ShortenedUrl {
  long_url: string;
  slug: string;
  user_id: string;
  views: number;
}
