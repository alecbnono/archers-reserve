import Timeslot from "../atom/Timeslot";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function LaboratoryConfirmation() {
    return (
        <div className="flex justify-between p-8 grow items-center">
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
        </div>
    );
}
