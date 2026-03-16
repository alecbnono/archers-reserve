import { useFilters } from "~/features/admin/hooks/useFilters";
import { useAdminLogs } from "~/features/admin/hooks/useAdminLogs";
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";
import { convertToReservationTypes } from "~/features/admin/utils/admin.utils";

export default function adminLogs() {
  const filtersHook = useFilters();
  const { 
    building: { buildings, selectedBuilding, toggleBuilding },
    vacant: { showVacant, toggleShowVacant },
    time: { timeRange, updateTimeRange }
  } = filtersHook;

  const { reservations, isLoading, error } = useAdminLogs({
    buildings: selectedBuilding ? [selectedBuilding] : [],
    timeRange,
    showVacant,
  });

  const formattedReservations = convertToReservationTypes(reservations);

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
            reservations={formattedReservations}
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