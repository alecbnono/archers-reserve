import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    // Format: "Feb 12, 2026"
    const datePart = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Format: "1:00 PM"
    const timePart = date.toLocaleTimeString("en-GB", {
        // 'en-GB' defaults to 24h
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return { datePart, timePart };
};
