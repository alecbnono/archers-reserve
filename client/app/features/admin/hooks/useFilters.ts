import { useFilterBuilding } from "./useFilterBuilding";
import { useFilterTime } from "./useFilterTime";
import { useAdminLogFilters } from "./useFilterVacant";

export function useFilters(){
  const building = useFilterBuilding();
  const time = useFilterTime();
  const vacant = useAdminLogFilters();

  const filters = {
    building: building.selectedBuilding || undefined,
    startTime: time.timeRange[0],
    endTime: time.timeRange[1],
    showVacant: vacant.showVacant,
  };

  return {
    building,
    time,
    vacant,
    filters, 
    clearAll: () => {
      building.setSelectedBuilding(null);
      time.resetTimeRange();
      vacant.setShowVacant(false);
    },
  };
}