import { Button } from "~/components/ui/button";
import type { TimeslotType } from "../../types/reserve.types";
import { formatTime } from "../../utils/reserve";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Timeslot({
    timeInMins,
    occupiedSeats,
    capacity,
}: TimeslotType) {
    return (
        <ToggleGroupItem
            value={timeInMins.toString()}
            className="rounded-full p-4 bg-neutral-50 border-2 border-primary 
            data-[state=on]:bg-primary 
            data-[state=on]:text-neutral-50
            hover:bg-green-200 
            hover:text-neutral-950
            transition
            duration-150
            "
        >
            <span>{formatTime(timeInMins)}</span>
            <span>
                {" "}
                | {occupiedSeats}/{capacity}
            </span>
        </ToggleGroupItem>
    );
}
