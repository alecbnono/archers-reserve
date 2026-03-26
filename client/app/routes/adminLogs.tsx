import { useMemo } from "react";
import { useFilters } from "~/features/admin/hooks/useFilters";
import { useAdminLogs } from "~/features/admin/hooks/useAdminLogs";
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";
import { useAdminUserSearch } from "~/features/reserve/hooks/useAdminUserSearch";

export default function adminLogs() {
  const {
    building: { buildings, selectedBuildings, toggleBuilding },
    time: { timeRange, updateTimeRange },
  } = useFilters();

  const userSearch = useAdminUserSearch();

  const adminFilters = useMemo(
    () => ({
      buildings: [...selectedBuildings],
      timeRange,
      selectedUserId: userSearch.selectedUser?.id,
    }),
    [selectedBuildings, timeRange, userSearch.selectedUser],
  );

  const { reservations, isLoading, error } = useAdminLogs(adminFilters);

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
        <h1 className="text-3xl font-bold ml-4">Reservation Logs</h1>
        <div className="flex md:flex-row md:items-start justify-start flex-col gap-4">
          <FilterLaboratory
            buildings={buildings}
            selectedBuildings={[...selectedBuildings]}
            onToggleBuilding={toggleBuilding}
            vacantOnly={false}
            onToggleVacant={() => {}}
            timeRange={timeRange}
            onTimeRangeChange={updateTimeRange}
            showVacantFilter={false}
            showUserFilter={true}
            userQuery={userSearch.query}
            userResults={userSearch.results}
            userIsSearching={userSearch.isSearching}
            userSearchError={userSearch.searchError}
            selectedUser={userSearch.selectedUser}
            showUserResults={userSearch.showResults}
            onUserQueryChange={userSearch.handleQueryChange}
            onSelectUser={userSearch.handleSelectUser}
            onClearUser={userSearch.handleClearUser}
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