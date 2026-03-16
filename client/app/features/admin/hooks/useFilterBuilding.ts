import { useState } from "react";
import type { BuildingOption } from "../types/filter.types";

const BUILDINGS: BuildingOption[] = [
  "Andrew Gonzales Hall",
  "Connon Hall",
  "Gokongwei Hall",
  "St. Joseph Hall",  
  "St. La Salle Hall",
  "Velasco Hall",
  "Yuchengco Hall",
];

export function useFilterBuilding() {
  const [selectedBuildings, setSelectedBuildings] = useState<BuildingOption[]>([]);

  const toggleBuilding = (building: BuildingOption) => {
    setSelectedBuildings(prev => 
      prev.includes(building)
        ? prev.filter(b => b !== building)  
        : [...prev, building]               
    );
  };


  return {
    selectedBuildings,        
    setSelectedBuildings,
    toggleBuilding,
    buildings: BUILDINGS,
  };
}