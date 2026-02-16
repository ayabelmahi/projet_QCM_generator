import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Cette fonction permet de fusionner les classes Tailwind proprement
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}