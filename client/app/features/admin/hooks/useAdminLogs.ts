import { useEffect, useState, useCallback } from "react";
import { fetchAllReservations } from "../services/admin.services";
import type { AdminLogFilters, UseAdminLogsReturn } from "../types/filter.types";
import type { ReservationType } from "~/types/reservation.types";

export function useAdminLogs(filters: AdminLogFilters): UseAdminLogsReturn {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminLogs = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await fetchAllReservations(filters);

      if (result.error) {
        setError(result.error);
        setReservations([]);
      } else {
        setReservations(result.reservations || []);
      }
    } catch {
      setError("Failed to fetch admin logs");
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAdminLogs();
  }, [loadAdminLogs]);

  const refetch = useCallback(() => loadAdminLogs(), [loadAdminLogs]);

  return {
    reservations,
    isLoading,
    error,
    refetch,
  };
}