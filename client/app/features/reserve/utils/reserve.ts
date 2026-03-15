import type { TimeslotType } from "../types/reserve.types";

/**
 * Parse a time value into hours and minutes.
 * Handles DB strings ("HH:MM:SS", "HH:MM") and ISO datetime strings.
 */
function parseTime(time: string): { hours: number; minutes: number } {
    // Handle ISO datetime strings (e.g. "1970-01-01T07:30:00.000Z")
    const isoMatch = String(time).match(/T(\d{2}):(\d{2})/);
    if (isoMatch) {
        return {
            hours: parseInt(isoMatch[1], 10),
            minutes: parseInt(isoMatch[2], 10),
        };
    }
    // Handle plain time strings "HH:MM" or "HH:MM:SS"
    const parts = String(time).split(":");
    return {
        hours: parseInt(parts[0], 10),
        minutes: parseInt(parts[1], 10),
    };
}

/**
 * Convert a time string (DB "HH:MM:SS", ISO datetime, etc.) to total
 * minutes since midnight. Useful for numeric comparison of timeslots.
 */
export function toMinutes(time: string): number {
    const { hours, minutes } = parseTime(time);
    return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to 12-hour display.
 * e.g. 420 → "7:00 AM", 780 → "1:00 PM"
 */
export function formatMinutes(minutes: number): string {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Format a DB time string ("HH:MM:SS" or "HH:MM") into 12-hour format.
 * e.g. "07:00:00" → "7:00 AM", "13:30:00" → "1:30 PM"
 */
export function formatTime12h(time: string): string {
    const { hours, minutes } = parseTime(time);
    const period = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Format a time range from two DB time strings into 12-hour display.
 * e.g. ("07:00:00", "07:30:00") → "7:00 AM - 7:30 AM"
 */
export function formatTimeRange(start: string, end: string): string {
    return `${formatTime12h(start)} - ${formatTime12h(end)}`;
}

/**
 * Format selected timeslot IDs into merged continuous 12-hour time ranges.
 * Consecutive slots are merged using numeric minute comparison (avoids
 * string format variations from the API).
 *
 * Example:
 *   Selected: 7:00–7:30, 7:30–8:00, 8:30–9:00
 *   Output:  "7:00 AM - 8:00 AM, 8:30 AM - 9:00 AM"
 */
export function formatSelectedTimeslots(
    selectedIds: string[],
    timeslots: TimeslotType[],
): string {
    if (selectedIds.length === 0) return "";

    const selected = timeslots
        .filter((ts) => selectedIds.includes(ts.timeslotId.toString()))
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

    if (selected.length === 0) return "";

    // Group into continuous ranges by comparing minutes numerically
    const groups: { start: string; end: string }[] = [];
    let current = { start: selected[0].startTime, end: selected[0].endTime };

    for (let i = 1; i < selected.length; i++) {
        if (toMinutes(selected[i].startTime) === toMinutes(current.end)) {
            // Contiguous — extend the current range
            current = { start: current.start, end: selected[i].endTime };
        } else {
            // Gap — push and start a new range
            groups.push(current);
            current = { start: selected[i].startTime, end: selected[i].endTime };
        }
    }
    groups.push(current);

    return groups
        .map((g) => `${formatTime12h(g.start)} - ${formatTime12h(g.end)}`)
        .join(", ");
}

/**
 * Returns true if the timeslot's start time has already passed for the given date.
 * A slot is considered past once now >= (date + startTime).
 *
 * @param dateStr  "YYYY-MM-DD" — the reservation date
 * @param startTime  DB time string or ISO datetime string for the slot start
 */
export function isTimeslotPast(dateStr: string, startTime: string): boolean {
    const { hours, minutes } = parseTime(startTime);
    const [y, m, d] = dateStr.split("-").map(Number);
    const slotStart = new Date(y, m - 1, d, hours, minutes, 0, 0);
    return Date.now() >= slotStart.getTime();
}

/**
 * Format a date string "YYYY-MM-DD" into a readable date.
 * Parses as local date to avoid timezone shift.
 */
export function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
