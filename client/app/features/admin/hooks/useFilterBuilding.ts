import { useState } from "react";
import type { BuildingOption } from "../types/filter.types";

const BUILDINGS: BuildingOption[] = [
  "St. La Salle Hall",
  "John Gokongwei Sr. Hall",
  "St. Joseph Hall",
  "Urbano J. Velasco Hall",
];

export function useFilterBuilding() {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingOption | null>(null);

  const toggleBuilding = (building: BuildingOption) => {
    setSelectedBuilding((prev) => (prev === building ? null : building));
  };

  return {
    selectedBuilding,
    setSelectedBuilding,
    toggleBuilding,
    buildings: BUILDINGS,
  };
}