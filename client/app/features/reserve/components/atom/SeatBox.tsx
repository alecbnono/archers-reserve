import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

export default function SeatBox({
    isDisabled = false,
}: {
    isDisabled: boolean;
}) {
    return (
        <Tooltip key="top">
            <TooltipTrigger asChild>
                <Checkbox className="size-6 bg-white" disabled={isDisabled} />
            </TooltipTrigger>
            <TooltipContent className="">
                <div className="flex items-center">Reserve</div>
            </TooltipContent>
        </Tooltip>
    );
}
