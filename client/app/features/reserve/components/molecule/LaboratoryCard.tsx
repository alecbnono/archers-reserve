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
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { memo } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

import type { RoomProp } from "~/types/labs.types";
import { chartData, chartConfig } from "../../utils/chart";

function LaboratoryCard({ room, selectedDate }: RoomProp) {
    const dateParam = selectedDate ? `&date=${selectedDate}` : "";
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
                            <BarChart data={chartData} barCategoryGap={0} barGap={0}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    tickLine={true}
                                    axisLine={true}
                                    fontSize={12}
                                />
                                <YAxis
                                    domain={[0, room.capacity]}
                                />
                                <Bar
                                    dataKey="q0"
                                    radius={6}
                                    maxBarSize={8}
                                    fill="var(--color-q0)"
                                    isAnimationActive={false}
                                />
                                <Bar
                                    dataKey="q1"
                                    radius={6}
                                    maxBarSize={8}
                                    fill="var(--color-q1)"
                                    isAnimationActive={false}
                                />
                                <Bar
                                    dataKey="q2"
                                    radius={6}
                                    maxBarSize={8}
                                    fill="var(--color-q1)"
                                    isAnimationActive={false}
                                />
                                <Bar
                                    dataKey="q3"
                                    radius={6}
                                    maxBarSize={8}
                                    fill="var(--color-q1)"
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
