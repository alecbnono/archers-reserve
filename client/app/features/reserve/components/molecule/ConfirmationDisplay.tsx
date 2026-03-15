import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { LuCalendarClock } from "react-icons/lu";
import { FaMapPin } from "react-icons/fa6";
import { FaComputer } from "react-icons/fa6";
import type { TimeslotType } from "../../types/reserve.types";
import { formatSelectedTimeslots, formatDate } from "../../utils/reserve";

interface ConfirmationDisplayProps {
    roomCode: string | null;
    building: string | null;
    selectedDate: string | null;
    selectedTimeslotIds: string[];
    timeslots: TimeslotType[];
    selectedSeat: number | null;
    reserveAll: boolean;
}

export default function ConfirmationDisplay({
    roomCode,
    building,
    selectedDate,
    selectedTimeslotIds,
    timeslots,
    selectedSeat,
    reserveAll,
}: ConfirmationDisplayProps) {
    return (
        <Card className="rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <FaMapPin size={24} className="shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        {roomCode && building ? (
                            <p className="text-md font-medium">
                                {building} {roomCode}
                            </p>
                        ) : (
                            <p className="text-md text-neutral-400">No room selected</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <LuCalendarClock size={24} className="shrink-0 mt-0.5" />
                    <div className="flex flex-row gap-1 flex-wrap w-50">
                        {selectedDate ? (
                            <p className="text-md font-medium">{formatDate(selectedDate)}</p>
                        ) : (
                            <p className="text-md text-neutral-400">No date selected</p>
                        )}
                        {selectedTimeslotIds.length > 0 ? (
                            <p className="text-md">
                                {formatSelectedTimeslots(selectedTimeslotIds, timeslots)}
                            </p>
                        ) : (
                            <p className="text-md text-neutral-400">No timeslot selected</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <FaComputer size={24} className="shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        {reserveAll ? (
                            <p className="text-md font-medium">All seats reserved</p>
                        ) : selectedSeat !== null ? (
                            <p className="text-md font-medium">PC {selectedSeat}</p>
                        ) : (
                            <p className="text-md text-neutral-400">No seat selected</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
