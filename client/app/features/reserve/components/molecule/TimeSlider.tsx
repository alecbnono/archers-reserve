import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "../../utils/reserve";

export default function TimeSlider() {
    // State holds the start and end times in minutes
    const [timeRange, setTimeRange] = useState([420, 1080]); // 7:00 - 18:00 in minutes

    return (
        <div className="mx-auto grid w-full max-w-xs gap-3">
            <Label htmlFor="slider-time-filter">Time</Label>
            <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-sm">
                    {formatTime(timeRange[0])}
                </span>
                <span className="text-muted-foreground text-sm">
                    {formatTime(timeRange[1])}
                </span>
            </div>
            <Slider
                id="slider-time-filter"
                value={timeRange}
                onValueChange={(val: number[]) => setTimeRange(val)}
                min={420}
                max={1080}
                step={30}
            />
        </div>
    );
}
