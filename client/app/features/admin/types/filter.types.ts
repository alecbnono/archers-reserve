import type { ReservationType } from "~/types/reservation.types";

export type TimeSliderValue = [number, number];

export type BuildingOption = string; 

export interface AdminLogFilters {
  buildings: BuildingOption[];
  timeRange: TimeSliderValue;
  showVacant: boolean;
}

export interface UseAdminLogsReturn {
  reservations: ReservationType[];
  isLoading: boolean;
  error: string;
  refetch: () => Promise<void>;
}