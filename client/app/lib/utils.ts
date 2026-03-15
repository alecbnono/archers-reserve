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

/** Tailwind classes for each reservation status badge. */
export const STATUS_STYLES: Record<string, string> = {
    UPCOMING: "text-blue-600 font-semibold",
    ONGOING: "text-green-600 font-semibold",
    COMPLETED: "text-muted-foreground",
    CANCELLED: "text-red-600 font-semibold",
};
