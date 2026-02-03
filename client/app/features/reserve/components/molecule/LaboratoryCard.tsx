import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
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
    type ChartConfig,
} from "@/components/ui/chart";

import { FaArrowRight } from "react-icons/fa";

export const description = "A bar chart";

const chartData = [
    {
        hour: "08:00",
        q0: 12, // 00–15
        q1: 18, // 15–30
        q2: 10, // 30–45
        q3: 15, // 45–60
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
        q0: 12, // 00–15
        q1: 18, // 15–30
        q2: 10, // 30–45
        q3: 15, // 45–60
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
        q0: 12, // 00–15
        q1: 18, // 15–30
        q2: 10, // 30–45
        q3: 15, // 45–60
    },
    {
        hour: "18:00",
        q0: 20,
        q1: 14,
        q2: 9,
        q3: 11,
    },
];

const chartConfig = {
    q0: { label: "00–15" },
    q1: { label: "15–30" },
    q2: { label: "30–45" },
    q3: { label: "45–60" },
} satisfies ChartConfig;

export default function LaboratoryCard() {
    return (
        <Card className="grow">
            <CardHeader className="flex justify-between">
                <div className="flex items-start gap-2">
                    <div>
                        <img src="./hero.jpg" alt="" className="rounded-xl size-16" />
                    </div>
                    <div className="flex flex-col pt-1 gap-1">
                        <CardTitle>Room 301</CardTitle>
                        <CardDescription>Gokongwei Hall - 3rd Floor</CardDescription>
                    </div>
                </div>
                <FaArrowRight />
            </CardHeader>
            <CardContent>
                <div className="h-32 w-96">
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
                                domain={[0, 20]} // choose a constant max
                            />
                            <Bar dataKey="q0" radius={6} maxBarSize={8} />
                            <Bar dataKey="q1" radius={6} maxBarSize={8} />
                            <Bar dataKey="q2" radius={6} maxBarSize={8} />
                            <Bar dataKey="q3" radius={6} maxBarSize={8} />
                        </BarChart>
                    </ChartContainer>
                    <div className="text-muted-foreground leading-none text-center text-xs w-full pl-16">
                        Showing total reservations for the day
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </Card>
    );
}
