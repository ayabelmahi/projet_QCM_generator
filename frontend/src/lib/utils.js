import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine des classes CSS de façon conditionnelle
 * et fusionne les conflits Tailwind CSS.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}