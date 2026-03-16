import { createContext, useContext } from "react";
import { useFilterBuilding } from "~/features/reserve/hooks/useFilterBuilding";
import { useFilterTime } from "~/features/reserve/hooks/useFilterTime";
import { useAdminLogFilters } from "~/features/reserve/hooks/useFilterVacant";

const FiltersContext = createContext<any>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const building = useFilterBuilding();
  const time = useFilterTime();
  const vacant = useAdminLogFilters();

  const filters = {
    building: building.selectedBuilding,
    startTime: time.timeRange[0],
    endTime: time.timeRange[1],
    showVacant: vacant.showVacant,
  };

  return (
    <FiltersContext.Provider value={{ filters, building, time, vacant }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}