import type { ChartConfig } from "@/components/ui/chart";

export const description = "A bar chart";

export interface OccupancyPoint {
  timeslotId: number;
  startTime: string;
  endTime: string;
  reservedCount: number;
}

export interface ChartDataPoint {
  hour: string;   // "07:00"
  first: number;  // :00–:30 count
  second: number; // :30–:00 count
}

export function buildChartData(occupancy: OccupancyPoint[]): ChartDataPoint[] {
  const hourMap = new Map<string, ChartDataPoint>();
  for (const slot of occupancy) {
    const [h, m] = slot.startTime.split(":"); 
    const key = `${h}:00`;
    if (!hourMap.has(key)) hourMap.set(key, { hour: key, first: 0, second: 0 });
    const entry = hourMap.get(key)!;
    if (m === "00") entry.first = slot.reservedCount;
    else entry.second = slot.reservedCount;
  }
  return Array.from(hourMap.values());
}

export const chartConfig = {
  first:  { label: ":00–:30", color: "var(--primary)" },
  second: { label: ":30–:00", color: "var(--primary)" },
} satisfies ChartConfig;