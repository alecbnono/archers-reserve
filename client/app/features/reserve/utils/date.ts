/** Day names starting from Monday */
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type WeekOption = {
    weekNumber: number;
    startDate: Date; // Monday of that week
    label: string; // e.g. "Week 1 (Jan 6 – Jan 12)"
    isPast: boolean;
};

export type DayOption = {
    index: number; // 0..6
    date: Date;
    label: string; // e.g. "Mon 6"
    dateString: string; // "YYYY-MM-DD"
    isPast: boolean;
};

/**
 * Create a local-only Date (no timezone shift).
 * Months are 0-indexed.
 */
function localDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
}

/**
 * Get the first Monday of a given year.
 * Scans Jan 1..7 to find the first day where getDay() === 1.
 */
export function getFirstMondayOfYear(year: number): Date {
    const jan1 = localDate(year, 0, 1);
    const day = jan1.getDay(); // 0=Sun, 1=Mon, ...
    // Distance to next Monday (or 0 if Jan 1 is already Monday)
    const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    return localDate(year, 0, 1 + offset);
}

/**
 * Add `n` days to a date, returning a new Date.
 */
function addDays(date: Date, n: number): Date {
    return localDate(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

/**
 * Format a date as "YYYY-MM-DD" (local, no timezone shift).
 */
export function toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * Format a date as short label: "Mon 6", "Tue 7", etc.
 */
function formatDayLabel(date: Date, dayIndex: number): string {
    const dayName = DAY_LABELS[dayIndex];
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${dayName} ${month} ${day}`;
}

/**
 * Format a date range label for a week: "Week 1 (Jan 6 – Jan 12)"
 */
function formatWeekLabel(weekNumber: number, monday: Date, sunday: Date): string {
    const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `Week ${weekNumber} (${fmt(monday)} – ${fmt(sunday)})`;
}

/**
 * Check if a date is strictly before today (comparing date-only, no time).
 */
function isBeforeToday(date: Date, today: Date): boolean {
    return toDateString(date) < toDateString(today);
}

/**
 * Check if an entire week is in the past (Sunday < today).
 */
function isWeekPast(weekStart: Date, today: Date): boolean {
    const sunday = addDays(weekStart, 6);
    return isBeforeToday(sunday, today);
}

/**
 * Generate all week options for the current year.
 * Weeks start on the first Monday of the year and continue
 * as long as the Monday falls within the same year.
 */
export function getWeeksForYear(year: number, today: Date): WeekOption[] {
    const weeks: WeekOption[] = [];
    let monday = getFirstMondayOfYear(year);
    let weekNumber = 1;

    while (monday.getFullYear() === year) {
        const sunday = addDays(monday, 6);
        weeks.push({
            weekNumber,
            startDate: monday,
            label: formatWeekLabel(weekNumber, monday, sunday),
            isPast: isWeekPast(monday, today),
        });
        monday = addDays(monday, 7);
        weekNumber++;
    }

    return weeks;
}

/**
 * Get the 7 day options (Mon..Sun) for a given week start date.
 */
export function getDaysForWeek(weekStart: Date, today: Date): DayOption[] {
    return Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        return {
            index: i,
            date,
            label: formatDayLabel(date, i),
            dateString: toDateString(date),
            isPast: isBeforeToday(date, today),
        };
    });
}

/**
 * Find the current week number for today within the year's weeks.
 * Returns the week number where today falls, or the first future week.
 */
export function getCurrentWeekNumber(weeks: WeekOption[], today: Date): number {
    const todayStr = toDateString(today);

    for (const week of weeks) {
        const mondayStr = toDateString(week.startDate);
        const sundayStr = toDateString(addDays(week.startDate, 6));
        if (todayStr >= mondayStr && todayStr <= sundayStr) {
            return week.weekNumber;
        }
    }

    // If today is before the first Monday, return week 1
    // If today is after all weeks, return the last week
    const firstFuture = weeks.find((w) => !w.isPast);
    return firstFuture?.weekNumber ?? weeks[weeks.length - 1].weekNumber;
}

/**
 * Given day options, find the first non-past day index.
 * Falls back to 0 (Monday) if all days are past (shouldn't happen
 * since we don't allow selecting fully-past weeks).
 */
export function getFirstValidDayIndex(days: DayOption[]): number {
    const first = days.find((d) => !d.isPast);
    return first?.index ?? 0;
}

/**
 * Compute the last date of a recurring weekly series (start + 3 calendar months, inclusive).
 * Mirrors the server-side `expandWeeklyDates` logic. Returns "YYYY-MM-DD".
 */
export function computeRecurringEndDate(startDateStr: string): string {
    const [y, m, d] = startDateStr.split("-").map(Number);
    const start = new Date(y, m - 1, d);
    const endBound = new Date(y, m - 1 + 3, d); // +3 calendar months

    let current = new Date(start);
    let last = current;
    while (current <= endBound) {
        last = new Date(current);
        current = addDays(current, 7);
    }
    return toDateString(last);
}

/**
 * Given a weekday index (0=Mon..6=Sun from our day tabs), return the
 * next occurrence of that weekday as "YYYY-MM-DD".
 *
 * If today IS that weekday, return NEXT week's occurrence so that
 * all timeslots in the first date are guaranteed to be in the future.
 * For other weekdays, return the upcoming occurrence this week.
 */
export function getNextWeekdayDate(weekdayIndex: number): string {
    const today = new Date();
    // JS getDay(): 0=Sun,1=Mon..6=Sat
    // Our tabs: 0=Mon..5=Sat,6=Sun
    // Convert our index → JS day: Mon=1,Tue=2,...Sat=6,Sun=0
    const targetJsDay = weekdayIndex === 6 ? 0 : weekdayIndex + 1;
    const todayJsDay = today.getDay();

    let diff = targetJsDay - todayJsDay;
    if (diff <= 0) diff += 7; // today or past → push to next week

    const target = localDate(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + diff,
    );
    return toDateString(target);
}
