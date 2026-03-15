import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Timeslot from "../atom/Timeslot";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import SeatSelection from "../molecule/SeatSelection";
import ConfirmationDisplay from "../molecule/ConfirmationDisplay";

import { useAuthStore } from "~/store/user.store";
import { useAvailability } from "~/features/reserve/hooks/useAvailability";
import { createReservation } from "~/features/reserve/services/reservation.service";
import { isTimeslotPast } from "~/features/reserve/utils/reserve";

export default function LaboratoryConfirmation() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // --- Parse and validate query params ---
    const roomId = useMemo(() => {
        const raw = searchParams.get("roomId");
        const parsed = Number(raw);
        return raw && !isNaN(parsed) && parsed > 0 ? parsed : null;
    }, [searchParams]);

    const date = useMemo(() => {
        const raw = searchParams.get("date");
        return raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
    }, [searchParams]);

    // --- Fetch availability ---
    const { data: availability, isLoading, error } = useAvailability(roomId, date);

    // --- Reservation selection state ---
    const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [reserveAll, setReserveAll] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Reset selection when availability data changes (new room or date)
    useEffect(() => {
        setSelectedTimeslots([]);
        setSelectedSeat(null);
        setReserveAll(false);
        setIsAnonymous(false);
        setSubmitError("");
    }, [availability]);

    // --- Compute occupied seats across all selected timeslots ---
    // A seat is occupied if it's reserved in ANY selected timeslot
    const occupiedSeatIds = useMemo(() => {
        if (!availability || selectedTimeslots.length === 0) return [];

        const occupied = new Set<number>();
        for (const ts of availability.timeslots) {
            if (selectedTimeslots.includes(ts.timeslotId.toString())) {
                for (const seatId of ts.reservedSeatIds) {
                    occupied.add(seatId);
                }
            }
        }
        return Array.from(occupied);
    }, [availability, selectedTimeslots]);

    // --- Auto-clear selected seat if it becomes occupied after timeslot change ---
    useEffect(() => {
        if (selectedSeat !== null && occupiedSeatIds.includes(selectedSeat)) {
            setSelectedSeat(null);
        }
    }, [occupiedSeatIds, selectedSeat]);

    // --- Compute past timeslot IDs (start time has already passed for the selected date) ---
    const pastTimeslotIds = useMemo(() => {
        if (!availability || !date) return new Set<string>();
        const past = new Set<string>();
        for (const ts of availability.timeslots) {
            if (isTimeslotPast(date, ts.startTime)) {
                past.add(ts.timeslotId.toString());
            }
        }
        return past;
    }, [availability, date]);

    // --- Auto-clear any selected timeslots that have since passed ---
    useEffect(() => {
        if (pastTimeslotIds.size === 0) return;
        setSelectedTimeslots((prev) =>
            prev.filter((id) => !pastTimeslotIds.has(id)),
        );
    }, [pastTimeslotIds]);

    // --- Handlers ---
    const handleTimeslotChange = useCallback((value: string[]) => {
        setSelectedTimeslots(value);
    }, []);

    const handleSeatSelect = useCallback((seat: number | null) => {
        setSelectedSeat(seat);
    }, []);

    const handleReserveAllChange = useCallback((value: boolean) => {
        setReserveAll(value);
        if (value) setSelectedSeat(null);
    }, []);

    const handleAnonymousChange = useCallback((value: boolean) => {
        setIsAnonymous(value);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!roomId || !date || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError("");

        const result = await createReservation({
            roomId,
            date,
            timeslotIds: selectedTimeslots.map(Number),
            seatId: reserveAll ? null : selectedSeat,
            reserveAll,
            isAnonymous,
        });

        setIsSubmitting(false);

        if (result.error) {
            setSubmitError(result.error);
            return;
        }

        // Success — navigate to profile page to see the new reservation
        navigate("/dashboard/profile");
    }, [
        roomId, date, selectedTimeslots, selectedSeat,
        reserveAll, isAnonymous, isSubmitting, navigate,
    ]);

    // --- Validation ---
    const hasTimeslots = selectedTimeslots.length > 0;
    const hasSeat = selectedSeat !== null || reserveAll;
    const hasContext = roomId !== null && date !== null && availability !== null;
    const isValid = hasContext && hasTimeslots && hasSeat;

    // --- Invalid params state ---
    if (!roomId || !date) {
        return (
            <div className="flex flex-col items-center w-full pt-8">
                <h1 className="text-3xl font-semibold mb-8">
                    Confirm your booking
                </h1>
                <p className="text-destructive text-center py-8">
                    Invalid booking link. Please select a room and date from the lab list.
                </p>
            </div>
        );
    }

    // --- Loading / error states ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full pt-8">
                <h1 className="text-3xl font-semibold mb-8">
                    Confirm your booking
                </h1>
                <p className="text-muted-foreground text-center py-8">
                    Loading availability...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center w-full pt-8">
                <h1 className="text-3xl font-semibold mb-8">
                    Confirm your booking
                </h1>
                <p className="text-destructive text-center py-8">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full pt-8">
            <h1 className="text-3xl font-semibold mb-8 md:mb-0">
                Confirm your booking
            </h1>
            <div className="flex flex-col gap-8 md:gap-16 md:flex-row items-center justify-center px-8 w-full grow flex-wrap">
                <ToggleGroup
                    type="multiple"
                    value={selectedTimeslots}
                    onValueChange={handleTimeslotChange}
                    className="grid grid-flow-col grid-cols-2 grid-rows-11 gap-2"
                    spacing={2}
                >
                    {availability?.timeslots.map((ts) => (
                        <Timeslot
                            key={ts.timeslotId}
                            timeslotId={ts.timeslotId}
                            startTime={ts.startTime}
                            endTime={ts.endTime}
                            occupiedSeats={ts.occupiedSeats}
                            capacity={availability.room.capacity}
                            reservedSeatIds={ts.reservedSeatIds}
                            disabled={pastTimeslotIds.has(ts.timeslotId.toString())}
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
                        totalSeats={availability?.room.capacity ?? 0}
                        selectedSeat={selectedSeat}
                        reserveAll={reserveAll}
                        isAnonymous={isAnonymous}
                        occupiedSeatIds={occupiedSeatIds}
                        onSeatSelect={handleSeatSelect}
                        onReserveAllChange={handleReserveAllChange}
                        onAnonymousChange={handleAnonymousChange}
                    />
                    <ConfirmationDisplay
                        roomCode={availability?.room.roomCode ?? null}
                        building={availability?.room.building ?? null}
                        selectedDate={date}
                        selectedTimeslotIds={selectedTimeslots}
                        timeslots={availability?.timeslots ?? []}
                        selectedSeat={selectedSeat}
                        reserveAll={reserveAll}
                    />

                    <Button
                        className="w-full rounded-full"
                        disabled={!isValid || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    {submitError && (
                        <p className="text-destructive text-sm text-center">
                            {submitError}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
