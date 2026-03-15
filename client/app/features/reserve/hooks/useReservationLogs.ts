import { useCallback, useEffect, useState } from "react";
import type { ReservationType } from "~/types/reservation.types";
import {
  fetchMyReservations,
  fetchAllReservations,
  cancelReservationBatch as cancelBatchApi,
} from "~/features/reserve/services/reservationLogs.service";

export function useReservationLogs(isAdmin: boolean) {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingBatchId, setCancellingBatchId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const result = isAdmin
      ? await fetchAllReservations()
      : await fetchMyReservations();

    if (result.error) {
      setError(result.error);
    } else {
      setReservations(result.reservations ?? []);
    }

    setIsLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await load();
      if (cancelled) return;
    })();

    return () => {
      cancelled = true;
    };
  }, [load]);

  const cancelBatch = useCallback(
    async (batchId: string) => {
      setCancellingBatchId(batchId);
      setCancelError("");

      const result = await cancelBatchApi(batchId);

      if (result.error) {
        setCancelError(result.error);
        setCancellingBatchId(null);
        return false;
      }

      // Refresh the list so the cancelled batch shows updated status
      await load();
      setCancellingBatchId(null);
      return true;
    },
    [load],
  );

  return {
    reservations,
    isLoading,
    error,
    cancelBatch,
    cancellingBatchId,
    cancelError,
  };
}
