import type { ChartConfig } from "@/components/ui/chart";

export const description = "A bar chart";

// Placeholder chart data — will be replaced with real occupancy data later
export const chartData = [
    {
        hour: "08:00",
        q0: 12,
        q1: 18,
        q2: 10,
        q3: 15,
    },
    {
        hour: "10:00",
        q0: 20,
        q1: 14,
        q2: 9,
        q3: 11,
    },
    {
        hour: "12:00",
        q0: 12,
        q1: 18,
        q2: 10,
        q3: 15,
    },
    {
        hour: "14:00",
        q0: 20,
        q1: 14,
        q2: 9,
        q3: 11,
    },
    {
        hour: "16:00",
        q0: 12,
        q1: 18,
        q2: 10,
        q3: 15,
    },
    {
        hour: "18:00",
        q0: 20,
        q1: 14,
        q2: 9,
        q3: 11,
    },
];

export const chartConfig = {
    q0: { label: "00–15", color: "var(--primary)" },
    q1: { label: "15–30", color: "var(--primary)" },
    q2: { label: "30–45", color: "var(--primary)" },
    q3: { label: "45–60", color: "var(--primary)" },
} satisfies ChartConfig;
