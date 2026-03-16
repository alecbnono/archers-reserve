export type TimeSliderValue = [number, number];

export type BuildingOption = string; 

export interface AdminLogFilters {
  buildings: BuildingOption[];
  timeRange: TimeSliderValue;
  showVacant: boolean;
}