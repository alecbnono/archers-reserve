import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

export default function SeatBox() {
    return (
        <Tooltip key="top">
            <TooltipTrigger asChild>
                <Checkbox className="size-6 bg-white" />
            </TooltipTrigger>
            <TooltipContent className="">
                <div className="flex items-center">Reserve</div>
            </TooltipContent>
        </Tooltip>
    );
}
