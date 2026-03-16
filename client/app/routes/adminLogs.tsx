import { useMemo } from "react";
import { useFilters } from "~/features/admin/hooks/useFilters";
import { useAdminLogs } from "~/features/admin/hooks/useAdminLogs";
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";

export default function adminLogs() {
  const {
    building: { buildings, selectedBuildings, toggleBuilding },
    time: { timeRange, updateTimeRange },
  } = useFilters();

  const adminFilters = useMemo(
    () => ({
      buildings: [...selectedBuildings],
      timeRange,
    }),
    [selectedBuildings, timeRange],
  );

  const { reservations, isLoading, error } = useAdminLogs(adminFilters);

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
        <h1 className="text-3xl font-bold ml-4">Reservation Logs</h1>
        <div className="flex md:flex-row justify-start flex-col gap-4">
          <FilterLaboratory
            buildings={buildings}
            selectedBuildings={[...selectedBuildings]}
            onToggleBuilding={toggleBuilding}
            vacantOnly={false}
            onToggleVacant={() => {}}
            timeRange={timeRange}
            onTimeRangeChange={updateTimeRange}
            showVacantFilter={false}
          />

          <ReserveLogs
            reservations={reservations}
            isLoading={isLoading}
            error={error}
            canManage={false}
            isAdmin={true}
            onCancel={async () => false}
            cancellingBatchId={null}
            cancelError=""
          />
        </div>
      </div>
    </div>
  );
}