import { Button } from "~/components/ui/button";
import type { TimeslotType } from "../../types/reserve.types";
import { formatTime } from "../../utils/reserve";

export default function Timeslot({
    timeInMins,
    occupiedSeats,
    capacity,
}: TimeslotType) {
    return (
        <Button className="rounded-full p-4  bg-neutral-50 border-2 border-primary">
            <span>{formatTime(timeInMins)}</span>
            <span>
                {" "}
                | {occupiedSeats}/{capacity}
            </span>
        </Button>
    );
}
