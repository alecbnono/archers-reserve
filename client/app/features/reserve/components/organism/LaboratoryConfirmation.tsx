import { useState } from "react";
import Timeslot from "../atom/Timeslot";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import SeatSelection from "../molecule/SeatSelection";
import ConfirmationDisplay from "../molecule/ConfirmationDisplay";

import { useAuthStore } from "~/store/user.store";

export default function LaboratoryConfirmation() {
    const currentUser = useAuthStore((state) => state.currentUser);

    // --- Centralized reservation selection state ---
    const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [reserveAll, setReserveAll] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const hasTimeslots = selectedTimeslots.length > 0;
    const hasSeat = selectedSeat !== null || reserveAll;
    const isValid = hasTimeslots && hasSeat;

    return (
        <div className="flex flex-col items-center w-full pt-8">
            <h1 className="text-3xl font-semibold mb-8 md:mb-0">
                Confirm your booking
            </h1>
            <div className="flex flex-col gap-8 md:flex-row items-center justify-center md:justify-around px-8 w-full grow flex-wrap">
                <ToggleGroup
                    type="multiple"
                    value={selectedTimeslots}
                    onValueChange={setSelectedTimeslots}
                    className="flex flex-col gap-2 max-h-86 md:max-h-125 w-full md:w-fit flex-wrap"
                    spacing={2}
                >
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((slot) => (
                        <Timeslot
                            key={slot}
                            timeInMins={390 + slot * 30}
                            capacity={20}
                            occupiedSeats={10}
                        />
                    ))}
                </ToggleGroup>
                <div className="flex flex-col gap-4">
                    {currentUser?.role === "ADMIN" ? (
                        <Field orientation="horizontal">
                            <Input type="search" placeholder="Search user..." />
                            <Button>Search</Button>
                        </Field>
                    ) : (
                        <></>
                    )}
                    <SeatSelection
                        totalSeats={22}
                        selectedSeat={selectedSeat}
                        reserveAll={reserveAll}
                        isAnonymous={isAnonymous}
                        onSeatSelect={setSelectedSeat}
                        onReserveAllChange={setReserveAll}
                        onAnonymousChange={setIsAnonymous}
                    />
                    <ConfirmationDisplay
                        selectedTimeslots={selectedTimeslots}
                        selectedSeat={selectedSeat}
                        reserveAll={reserveAll}
                    />

                    <Button
                        className="w-full rounded-full"
                        disabled={!isValid}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
