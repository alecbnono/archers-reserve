import { useFilters } from "~/features/admin/hooks/useFilters";
import { fetchAllReservations } from "~/features/admin/services/admin.services"; 
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";
import { useEffect, useState, useCallback } from "react";
import type { ReservationType } from "~/types/reservation.types";

export default function adminLogs() {
  const { 
    building: { buildings, selectedBuilding, toggleBuilding },
    vacant: { showVacant, toggleShowVacant },
    time: { timeRange, updateTimeRange }
  } = useFilters(); 

  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminLogs = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const filters = {
      buildings: selectedBuilding ? [selectedBuilding] : [],
      timeRange,
      showVacant,
    };

    const result = await fetchAllReservations(filters);

    if (result.error) {
      setError(result.error);
      setReservations([]);
    } else {
      setReservations(result.reservations);
    }

    setIsLoading(false);
  }, [selectedBuilding, timeRange, showVacant]);

  useEffect(() => {
    loadAdminLogs();
  }, [loadAdminLogs]);

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
        <h1 className="text-3xl font-bold ml-4">Reservation Logs</h1>
        <div className="flex md:flex-row justify-end flex-col gap-4">
          <FilterLaboratory
            buildings={buildings}
            selectedBuildings={selectedBuilding ? [selectedBuilding] : []}
            onToggleBuilding={toggleBuilding}
            vacantOnly={showVacant}
            onToggleVacant={toggleShowVacant}
            timeRange={timeRange}
            onTimeRangeChange={updateTimeRange}
          />
          
          <ReserveLogs
            reservations={reservations}
            isLoading={isLoading}
            error={error}
            canManage={true}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
}