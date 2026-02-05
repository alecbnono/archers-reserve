import Timeslot from "../atom/Timeslot";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "~/components/ui/button";

import SeatSelection from "../molecule/SeatSelection";
import ConfirmationDisplay from "../molecule/ConfirmationDisplay";

export default function LaboratoryConfirmation() {
    return (
        <div className="flex justify-evenly p-8 grow items-center  flex-wrap">
            <ToggleGroup
                type="single"
                className="flex flex-col gap-2 max-h-125 flex-wrap"
                spacing={2}
            >
                {Array.from({ length: 22 }, (_, i) => i + 1).map((minutes) => (
                    <Timeslot
                        timeInMins={390 + minutes * 30}
                        capacity={20}
                        occupiedSeats={10}
                    />
                ))}
            </ToggleGroup>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-medium">Confirm your booking</h1>

                <SeatSelection />
                <ConfirmationDisplay />

                <Button className="w-full rounded-full">Submit</Button>
            </div>
        </div>
    );
}
