export const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
};

/**
 * Groups sorted minute values into consecutive ranges (30-min interval)
 * and formats them as compact strings.
 *
 * Example:
 *   Input:  [420, 450, 480, 540, 570, 720]
 *   Output: "7:00–8:00, 9:00–9:30, 12:00"
 */
export function formatTimeslotRanges(
    slots: string[],
    interval: number = 30,
): string {
    if (slots.length === 0) return "";

    const sorted = [...slots].map(Number).sort((a, b) => a - b);

    const groups: number[][] = [];
    let current: number[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i - 1] === interval) {
            current.push(sorted[i]);
        } else {
            groups.push(current);
            current = [sorted[i]];
        }
    }
    groups.push(current);

    return groups
        .map((group) => {
            if (group.length === 1) {
                return formatTime(group[0]);
            }
            return `${formatTime(group[0])}–${formatTime(group[group.length - 1])}`;
        })
        .join(", ");
}
