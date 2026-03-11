import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface SeatBoxProps {
    seatNumber: number;
    checked: boolean;
    disabled: boolean;
    onSelect: (seatNumber: number) => void;
}

export default function SeatBox({
    seatNumber,
    checked,
    disabled,
    onSelect,
}: SeatBoxProps) {
    return (
        <Tooltip key="top">
            <TooltipTrigger asChild>
                <Checkbox
                    className="size-6 bg-white"
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={() => onSelect(seatNumber)}
                />
            </TooltipTrigger>
            <TooltipContent>
                <div className="flex items-center">Seat {seatNumber}</div>
            </TooltipContent>
        </Tooltip>
    );
}
