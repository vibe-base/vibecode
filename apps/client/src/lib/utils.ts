import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes properly.
 * Uses clsx for conditional class names and tailwind-merge to handle Tailwind class conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
