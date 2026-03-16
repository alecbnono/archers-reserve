import type { Route } from "./+types/adminLogs";
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";
import { useReservationLogs } from "~/features/reserve/hooks/useReservationLogs";
import { useState, useCallback } from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function adminLogs() {
    const {
        reservations,
        isLoading,
        error,
        cancelBatch,
        cancellingBatchId,
        cancelError,
    } = useReservationLogs(true);

    // --- Filter state (placeholder for future server-side filtering) ---
    const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
    const [vacantOnly, setVacantOnly] = useState(false);
    const [timeRange, setTimeRange] = useState<[number, number]>([420, 1080]);

    const buildings = Array.from(
        new Set(reservations.map((r) => r.building)),
    ).sort();

    const handleToggleBuilding = useCallback((building: string) => {
        setSelectedBuildings((prev) =>
            prev.includes(building)
                ? prev.filter((b) => b !== building)
                : [...prev, building],
        );
    }, []);

    return (
        <div className="flex w-full">
            <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
                <h1 className="text-3xl font-bold ml-4">Reservation Logs</h1>
                <div className="flex md:flex-row justify-end flex-col gap-4">
                    <FilterLaboratory
                        buildings={buildings}
                        selectedBuildings={selectedBuildings}
                        onToggleBuilding={handleToggleBuilding}
                        vacantOnly={vacantOnly}
                        onToggleVacant={setVacantOnly}
                        timeRange={timeRange}
                        onTimeRangeChange={setTimeRange}
                    />
                    <ReserveLogs
                        reservations={reservations}
                        isLoading={isLoading}
                        error={error}
                        isAdmin={true}
                        canManage={true}
                        onCancel={cancelBatch}
                        cancellingBatchId={cancellingBatchId}
                        cancelError={cancelError}
                    />
                </div>
            </div>
        </div>
    );
}
