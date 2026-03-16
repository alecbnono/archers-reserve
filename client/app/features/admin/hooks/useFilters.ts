import { useFilterBuilding } from "./useFilterBuilding";
import { useFilterTime } from "./useFilterTime";
import { useAdminLogFilters } from "./useFilterVacant";

export function useFilters() {
  const buildingHook = useFilterBuilding();
  const timeHook = useFilterTime();
  const vacantHook = useAdminLogFilters();

  const building = {
    buildings: buildingHook.buildings,
    selectedBuilding: buildingHook.selectedBuilding,
    toggleBuilding: buildingHook.toggleBuilding,
  };

  const time = {
    timeRange: timeHook.timeRange,
    updateTimeRange: timeHook.updateTimeRange,
  };

  const vacant = {
    showVacant: vacantHook.showVacant,
    toggleShowVacant: vacantHook.toggleShowVacant,
  };

  return {
    building,
    time,
    vacant,
  };
}