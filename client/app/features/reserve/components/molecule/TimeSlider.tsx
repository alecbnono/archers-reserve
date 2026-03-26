import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatMinutes } from "../../utils/reserve";

type TimeSliderProps = {
    timeRange: [number, number];
    onTimeRangeChange: (range: [number, number]) => void;
};

export default function TimeSlider({ timeRange, onTimeRangeChange }: TimeSliderProps) {
    return (
        <div className="mx-auto grid w-full max-w-xs gap-3">
            <Label htmlFor="slider-time-filter">Time</Label>
            <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-sm">{formatMinutes(timeRange[0])}</span>
                <span className="text-muted-foreground text-sm">{formatMinutes(timeRange[1])}</span>
            </div>
            <Slider
                id="slider-time-filter"
                value={timeRange}
                onValueChange={(val: number[]) => onTimeRangeChange([val[0], val[1]])}
                min={420}
                max={1080}
                step={30}
            />
        </div>
    );
}