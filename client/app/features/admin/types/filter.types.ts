export type TimeSliderValue = [number, number];

export type BuildingOption = ["St. La Salle Hall","John Gokongwei Sr. Hall", "St. Joseph Hall", "Urbano J. Velasco Hall"];

export interface AdminLogFilters {
  buildings: BuildingOption[];
  timeRange: TimeSliderValue;
  showVacant: boolean;
}