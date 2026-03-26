import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Timeslot from "../atom/Timeslot";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

import SeatSelection from "../molecule/SeatSelection";
import ConfirmationDisplay from "../molecule/ConfirmationDisplay";
import AdminUserSearch from "../molecule/AdminUserSearch";

import { useAuthStore } from "~/store/user.store";
import { useAvailability } from "~/features/reserve/hooks/useAvailability";
import { useAdminUserSearch } from "~/features/reserve/hooks/useAdminUserSearch";
import { createReservation } from "~/features/reserve/services/reservation.service";
import {
    fetchReservationBatchDetail,
    editReservationBatch,
} from "~/features/reserve/services/reservationLogs.service";
import { checkRecurringConflicts } from "~/features/reserve/services/availability.service";
import { isTimeslotPast } from "~/features/reserve/utils/reserve";
import { resolveSeatOccupantPreviews } from "~/features/reserve/utils/seatOccupant";
import { getNextWeekdayDate } from "~/features/reserve/utils/date";

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
        if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

        // Recurring mode: resolve date from weekday param
        if (searchParams.get("recurring") === "true") {
            const wd = searchParams.get("weekday");
            if (wd != null) {
                const idx = Number(wd);
                if (!isNaN(idx) && idx >= 0 && idx <= 6) {
                    return getNextWeekdayDate(idx);
                }
            }
        }

        return null;
    }, [searchParams]);

    // --- Edit mode detection ---
    const batchId = useMemo(() => searchParams.get("batchId"), [searchParams]);
    const isEditMode = batchId !== null;

    // --- Recurring mode ---
    const recurringParam = searchParams.get("recurring") === "true";
    const [isRecurring, setIsRecurring] = useState(recurringParam);
    const [hasFacultyConflict, setHasFacultyConflict] = useState(false);
    const [isCheckingRecurringConflicts, setIsCheckingRecurringConflicts] = useState(false);

    // Force reserveAll + clear seat selection whenever recurring mode is active
    useEffect(() => {
        if (isRecurring) {
            setReserveAll(true);
            setSelectedSeat(null);
        }
    }, [isRecurring]);

    // --- Fetch availability (exclude own batch seats during edit) ---
    const { data: availability, isLoading, error } = useAvailability(roomId, date, batchId);

    // --- Reservation selection state ---
    const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [reserveAll, setReserveAll] = useState(recurringParam);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // --- Admin user search (only used when admin is creating, not editing) ---
    const isAdmin = currentUser?.role === "ADMIN";
    const adminSearch = useAdminUserSearch();

    // --- Edit mode: fetch batch detail and prefill ---
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const prefillApplied = useRef(false);

    useEffect(() => {
        if (!isEditMode || !batchId || !availability) return;
        // Only prefill once per batchId + availability combo
        if (prefillApplied.current) return;

        let cancelled = false;

        (async () => {
            setEditLoading(true);
            setEditError("");

            const result = await fetchReservationBatchDetail(batchId);

            if (cancelled) return;
            setEditLoading(false);

            if (result.error) {
                setEditError(result.error);
                return;
            }

            if (!result.data) return;

            const detail = result.data;

            if (detail.status !== "UPCOMING") {
                setEditError("Only upcoming reservations can be edited.");
                return;
            }

            // Apply prefill
            setSelectedTimeslots(detail.timeslotIds.map(String));
            setIsAnonymous(detail.isAnonymous);
            setIsRecurring(detail.isRecurring);
            setSubmitError("");

            // Normalize recurring: always force all-seat (handles legacy data too)
            if (detail.isRecurring) {
                setReserveAll(true);
                setSelectedSeat(null);
            } else {
                setReserveAll(detail.reserveAll);
                setSelectedSeat(detail.seatId);
            }

            prefillApplied.current = true;
        })();

        return () => {
            cancelled = true;
        };
    }, [isEditMode, batchId, availability]);

    // Reset selection when availability data changes (new room or date)
    // but NOT in edit mode (prefill handles that)
    useEffect(() => {
        if (isEditMode) return;
        setSelectedTimeslots([]);
        setSelectedSeat(null);
        setReserveAll(isRecurring);
        setIsAnonymous(false);
        setSubmitError("");
    }, [availability, isEditMode, isRecurring]);

    // Reset prefill flag when batchId changes
    useEffect(() => {
        prefillApplied.current = false;
    }, [batchId]);

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

    // --- Resolve seat occupant previews for hover tooltips ---
    const seatOccupantPreviews = useMemo(() => {
        if (!availability || selectedTimeslots.length === 0) return new Map();
        return resolveSeatOccupantPreviews(availability.timeslots, selectedTimeslots);
    }, [availability, selectedTimeslots]);

    // --- Auto-clear selected seat if it becomes occupied after timeslot change ---
    useEffect(() => {
        if (selectedSeat !== null && occupiedSeatIds.includes(selectedSeat)) {
            setSelectedSeat(null);
        }
    }, [occupiedSeatIds, selectedSeat]);

    // --- Compute past timeslot IDs (start time has already passed for the selected date) ---
    // In recurring mode, don't disable any timeslots — the series spans many future weeks
    const pastTimeslotIds = useMemo(() => {
        if (isRecurring) return new Set<string>();
        if (!availability || !date) return new Set<string>();
        const past = new Set<string>();
        for (const ts of availability.timeslots) {
            if (isTimeslotPast(date, ts.startTime)) {
                past.add(ts.timeslotId.toString());
            }
        }
        return past;
    }, [availability, date, isRecurring]);

    // --- Auto-clear any selected timeslots that have since passed ---
    useEffect(() => {
        if (pastTimeslotIds.size === 0) return;
        setSelectedTimeslots((prev) =>
            prev.filter((id) => !pastTimeslotIds.has(id)),
        );
    }, [pastTimeslotIds]);

    // --- Recurring conflict check (debounced) ---
    useEffect(() => {
        if (!isRecurring || !roomId || !date || selectedTimeslots.length === 0) {
            setHasFacultyConflict(false);
            return;
        }

        let cancelled = false;
        setIsCheckingRecurringConflicts(true);

        const timer = setTimeout(async () => {
            const result = await checkRecurringConflicts({
                roomId,
                date,
                timeslotIds: selectedTimeslots.map(Number),
                seatId: null,
                reserveAll: true,
            });
            if (!cancelled) {
                setHasFacultyConflict(result.hasFacultyConflict === true);
                setIsCheckingRecurringConflicts(false);
            }
        }, 400);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            setIsCheckingRecurringConflicts(false);
        };
    }, [isRecurring, roomId, date, selectedTimeslots]);

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

    // Derived: in recurring mode, reserveAll is always true regardless of state
    const effectiveReserveAll = isRecurring || reserveAll;

    const handleSubmit = useCallback(async () => {
        if (!roomId || !date || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError("");

        const payload = {
            roomId,
            date,
            timeslotIds: selectedTimeslots.map(Number),
            seatId: effectiveReserveAll ? null : selectedSeat,
            reserveAll: effectiveReserveAll,
            isAnonymous,
            ...(isRecurring ? { isRecurring: true } : {}),
            ...(isAdmin && !isEditMode && adminSearch.selectedUser
                ? { targetUserId: adminSearch.selectedUser.id }
                : {}),
        };

        const result = isEditMode && batchId
            ? await editReservationBatch(batchId, payload)
            : await createReservation(payload);

        setIsSubmitting(false);

        if (result.error) {
            setSubmitError(result.error);
            return;
        }

        // Success — navigate based on role/context
        const redirectTo = isAdmin
            ? "/dashboard/logs"
            : "/dashboard/profile";
        navigate(redirectTo);
    }, [
        roomId, date, selectedTimeslots, selectedSeat,
        reserveAll, isAnonymous, isRecurring, isSubmitting, navigate,
        isEditMode, batchId, isAdmin, adminSearch.selectedUser,
    ]);

    // --- Validation ---
    const hasTimeslots = selectedTimeslots.length > 0;
    const hasSeat = selectedSeat !== null || effectiveReserveAll;
    const hasContext = roomId !== null && date !== null && availability !== null;
    const hasAdminTarget = !isAdmin || isEditMode || adminSearch.selectedUser !== null;
    const isValid = hasContext && hasTimeslots && hasSeat && hasAdminTarget;

    // --- Page title ---
    const pageTitle = isEditMode ? "Edit your booking" : "Confirm your booking";

    // --- Invalid params state ---
    if (!roomId || !date) {
        return (
            <div className="flex flex-col items-center w-full pt-8">
                <h1 className="text-3xl font-semibold mb-8">
                    {pageTitle}
                </h1>
                <p className="text-destructive text-center py-8">
                    Invalid booking link. Please select a room and date from the lab list.
                </p>
            </div>
        );
    }

    // --- Loading / error states ---
    if (isLoading || editLoading) {
        return (
            <div className="flex flex-col items-center w-full pt-8">
                <h1 className="text-3xl font-semibold mb-8">
                    {pageTitle}
                </h1>
                <p className="text-muted-foreground text-center py-8">
                    {editLoading ? "Loading reservation..." : "Loading availability..."}
                </p>
            </div>
        );
    }

    if (error || editError) {
        return (
            <div className="flex flex-col items-center w-full pt-8">
                <h1 className="text-3xl font-semibold mb-8">
                    {pageTitle}
                </h1>
                <p className="text-destructive text-center py-8">
                    {editError || error}
                </p>
            </div>
        );
    }

    // --- Submit button label ---
    const submitLabel = isSubmitting
        ? (isEditMode ? "Updating..." : "Submitting...")
        : (isEditMode ? "Update Reservation" : "Submit");

    return (
        <div className="flex flex-col items-center w-full pt-8">
            <h1 className="text-3xl font-semibold mb-8 md:mb-0">
                {pageTitle}
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
                            seatOccupants={ts.seatOccupants}
                            disabled={pastTimeslotIds.has(ts.timeslotId.toString())}
                        />
                    ))}
                </ToggleGroup>
                <div className="flex flex-col gap-4">
                    {isAdmin && !isEditMode && (
                        <AdminUserSearch
                            query={adminSearch.query}
                            results={adminSearch.results}
                            isSearching={adminSearch.isSearching}
                            searchError={adminSearch.searchError}
                            selectedUser={adminSearch.selectedUser}
                            showResults={adminSearch.showResults}
                            onQueryChange={adminSearch.handleQueryChange}
                            onSelectUser={adminSearch.handleSelectUser}
                            onClearUser={adminSearch.handleClearUser}
                        />
                    )}
                    <SeatSelection
                        totalSeats={availability?.room.capacity ?? 0}
                        selectedSeat={selectedSeat}
                        reserveAll={effectiveReserveAll}
                        isAnonymous={isAnonymous}
                        occupiedSeatIds={occupiedSeatIds}
                        seatOccupantPreviews={seatOccupantPreviews}
                        forceReserveAll={isRecurring}
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
                        reserveAll={effectiveReserveAll}
                        isRecurring={isRecurring}
                    />

                    {isRecurring && hasFacultyConflict && (
                        <p className="text-amber-700 bg-amber-50 border border-amber-300 rounded-md px-3 py-2 text-sm text-center">
                            A faculty/admin reservation conflicts with one or more dates in this recurring series. Submission will be rejected.
                        </p>
                    )}

                    <Button
                        className="w-full rounded-full"
                        disabled={!isValid || isSubmitting || (isRecurring && isCheckingRecurringConflicts)}
                        onClick={handleSubmit}
                    >
                        {submitLabel}
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
