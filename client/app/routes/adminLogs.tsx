import { useFilters } from "~/features/admin/hooks/useFilters";
import { useAdminLogs } from "~/features/admin/hooks/useAdminLogs";
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function adminLogs() {
  const { 
    building: { buildings, selectedBuildings, toggleBuilding },
    vacant: { showVacant, toggleShowVacant },
    time: { timeRange, updateTimeRange }
  } = useFilters();

  const { reservations, isLoading, error } = useAdminLogs({
    buildings: selectedBuildings ? [...selectedBuildings] : [],
    timeRange,
    showVacant,
  });

  //TODO: reservations not showing in ReserveLogs
  console.log(reservations);

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
        <h1 className="text-3xl font-bold ml-4">Reservation Logs</h1>
        <div className="flex md:flex-row justify-end flex-col gap-4">
          <FilterLaboratory
            buildings={buildings}
            selectedBuildings={selectedBuildings ? [...selectedBuildings] : []}
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