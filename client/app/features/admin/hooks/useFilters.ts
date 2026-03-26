import { useFilterBuilding } from "./useFilterBuilding";
import { useFilterTime } from "./useFilterTime";

export function useFilters() {
  const buildingHook = useFilterBuilding();
  const timeHook = useFilterTime();

  const building = {
    buildings: buildingHook.buildings,
    selectedBuildings: buildingHook.selectedBuildings,
    toggleBuilding: buildingHook.toggleBuilding,
  };

  const time = {
    timeRange: timeHook.timeRange,
    updateTimeRange: timeHook.updateTimeRange,
  };

  return { building, time };
}