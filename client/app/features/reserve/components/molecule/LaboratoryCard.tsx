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
import {
    buildChartData,
    chartConfig,
    type ChartDataPoint,
    type OccupancyPoint,
} from "../../utils/chart";

function LaboratoryCard({ room, selectedDate }: RoomProp) {
    const dateParam = selectedDate ? `&date=${selectedDate}` : "";

    const [occupancyData, setOccupancyData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        if (!room.roomId || !selectedDate) return;
        fetch(`/rooms/${room.roomId}/occupancy?date=${selectedDate}`)
            .then(res => res.json())
            .then((data: OccupancyPoint[]) => setOccupancyData(buildChartData(data)));
    }, [room.roomId, selectedDate]);

    return (
        <Link to={`confirm?roomId=${room.roomId}${dateParam}`} className="grow">
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