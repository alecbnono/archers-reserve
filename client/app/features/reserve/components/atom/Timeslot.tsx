import { ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TimeslotType } from "../../types/reserve.types";
import { formatTime12h } from "../../utils/reserve";

interface TimeslotProps extends TimeslotType {
    disabled?: boolean;
}

export default function Timeslot({
    timeslotId,
    startTime,
    endTime,
    occupiedSeats,
    capacity,
    disabled = false,
}: TimeslotProps) {
    return (
        <ToggleGroupItem
            value={timeslotId.toString()}
            disabled={disabled}
            className="rounded-full p-2 py-0 md:p-4 bg-neutral-50 border-2 border-primary 
            data-[state=on]:bg-primary 
            data-[state=on]:text-neutral-50
            hover:bg-green-200 
            hover:text-neutral-950
            transition
            duration-150
            text-xs
            md:text-sm
            md:w-56
            disabled:opacity-40
            disabled:cursor-not-allowed
            disabled:border-neutral-300
            disabled:bg-neutral-100
            disabled:hover:bg-neutral-100
            disabled:hover:text-inherit
            "
        >
            <span>{formatTime12h(startTime)} - {formatTime12h(endTime)}</span>
            <span>
                {" "}
                | {occupiedSeats}/{capacity}
            </span>
        </ToggleGroupItem>
    );
}
