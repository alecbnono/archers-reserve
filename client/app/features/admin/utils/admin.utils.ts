import type { AdminLogFilters } from "../types/filter.types";

/**
 * Get a summary of active admin filters.
 */
export function getFilterSummary(filters: AdminLogFilters): string {
  const parts: string[] = [];

  if (filters.buildings.length > 0) {
    parts.push(`Buildings: ${filters.buildings.join(", ")}`);
  }

  const startHour = Math.floor(filters.timeRange[0] / 60);
  const endHour = Math.floor(filters.timeRange[1] / 60);
  if (startHour !== 7 || endHour !== 18) {
    parts.push(`Time: ${startHour}AM - ${endHour}PM`);
  }

  if (filters.showVacant) {
    parts.push("Hiding cancelled");
  }

  return parts.length > 0 ? parts.join(" | ") : "No filters";
}

/**
 * Determine whether the current filters are still at their default values.
 */
export function areFiltersDefault(filters: AdminLogFilters): boolean {
  return (
    filters.buildings.length === 0 &&
    filters.timeRange[0] === 420 &&
    filters.timeRange[1] === 1080 &&
    !filters.showVacant
  );
}
