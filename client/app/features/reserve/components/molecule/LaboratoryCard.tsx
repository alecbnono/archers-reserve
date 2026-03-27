import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    ChartContainer,
} from "@/components/ui/chart";

import { memo, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

import type { RoomProp } from "~/types/labs.types";

const API_URL = import.meta.env.VITE_API_URL;
import {
    buildChartData,
    chartConfig,
    type ChartDataPoint,
    type OccupancyPoint,
} from "../../utils/chart";

function LaboratoryCard({ room, selectedDate, isRecurring, selectedWeekday }: RoomProp) {
    // In recurring mode, pass weekday instead of date
    const dateParam = !isRecurring && selectedDate ? `&date=${selectedDate}` : "";
    const recurringParam = isRecurring && selectedWeekday != null ? `&recurring=true&weekday=${selectedWeekday}` : "";

    const [occupancyData, setOccupancyData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        // Skip occupancy fetch in recurring mode (no specific date to show)
        if (isRecurring) {
            setOccupancyData([]);
            return;
        }
        if (!room.roomId || !selectedDate) return;
        fetch(`${API_URL}/rooms/${room.roomId}/occupancy?date=${selectedDate}`)
            .then(res => res.json())
            .then((data: OccupancyPoint[]) => setOccupancyData(buildChartData(data)));
    }, [room.roomId, selectedDate, isRecurring]);

    return (
        <Link to={`confirm?roomId=${room.roomId}${dateParam}${recurringParam}`} className="grow">
            <Card className="grow">
                <CardHeader className="flex justify-between">
                    <div className="flex items-start gap-2">
                        <div>
                            <img src="/hero.jpg" alt="" className="rounded-xl size-16" />
                        </div>
                        <div className="flex flex-col pt-1 gap-1">
                            <CardTitle>{room.roomCode}</CardTitle>
                            <CardDescription>{room.building}</CardDescription>
                        </div>
                    </div>
                    <FaArrowRight />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center h-32 md:w-96">
                        <ChartContainer config={chartConfig} className="h-32 w-full">
                            <BarChart data={occupancyData} barCategoryGap={0} barGap={0}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    tickLine={true}
                                    axisLine={true}
                                    fontSize={12}
                                />
                                <YAxis
                                    domain={[0, room.capacity ?? "auto"]}
                                />
                                <Bar
                                    dataKey="first"
                                    radius={6}
                                    maxBarSize={8}
                                    fill="var(--color-first)"
                                    isAnimationActive={false}
                                />
                                <Bar
                                    dataKey="second"
                                    radius={6}
                                    maxBarSize={8}
                                    fill="var(--color-second)"
                                    isAnimationActive={false}
                                />
                            </BarChart>
                        </ChartContainer>
                        <div className="text-muted-foreground leading-none text-center text-xs w-full pl-16">
                            Showing total reservations for the day
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default memo(LaboratoryCard);
