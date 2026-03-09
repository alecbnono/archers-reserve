import Timeslot from "../atom/Timeslot";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import SeatSelection from "../molecule/SeatSelection";
import ConfirmationDisplay from "../molecule/ConfirmationDisplay";

import { useAuthStore } from "~/store/user.store";

export default function LaboratoryConfirmation() {
    const currentUser = useAuthStore((state) => state.currentUser);
    return (
        <div className="flex flex-col items-center w-full pt-8">
            <h1 className="text-3xl font-semibold mb-8 md:mb-0">
                Confirm your booking
            </h1>
            <div className="flex flex-col gap-8 md:flex-row items-center justify-center md:justify-around px-8 w-full grow flex-wrap">
                <ToggleGroup
                    type="single"
                    className="flex flex-col gap-2 max-h-86 md:max-h-125 w-full md:w-fit flex-wrap"
                    spacing={2}
                >
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((minutes) => (
                        <Timeslot
                            key={minutes}
                            timeInMins={390 + minutes * 30}
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
                    <SeatSelection />
                    <ConfirmationDisplay />

                    <Button className="w-full rounded-full">Submit</Button>
                </div>
            </div>
        </div>
    );
}
