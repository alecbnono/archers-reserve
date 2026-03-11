import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { LuCalendarClock } from "react-icons/lu";
import { FaMapPin } from "react-icons/fa6";
import { formatTimeslotRanges } from "../../utils/reserve";
import { FaComputer } from "react-icons/fa6";

interface ConfirmationDisplayProps {
    selectedTimeslots: string[];
    selectedSeat: number | null;
    reserveAll: boolean;
}

export default function ConfirmationDisplay({
    selectedTimeslots,
    selectedSeat,
    reserveAll,
}: ConfirmationDisplayProps) {
    return (
        <Card className="rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <FaMapPin size={24} className="shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <p className="text-md font-medium">Gokongwei Hall 301</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <LuCalendarClock size={24} className="shrink-0 mt-0.5" />
                    <div className="flex flex-row gap-1 flex-wrap w-50">
                        <p className="text-md font-medium">Monday, January 2, 3005</p>
                        {selectedTimeslots.length > 0 ? (
                            <p className="text-md">
                                {formatTimeslotRanges(selectedTimeslots)}
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
