import { useEffect, useState } from "react";
import type { ReservationType } from "~/types/reservation.types";
import {
  fetchMyReservations,
  fetchAllReservations,
} from "~/features/reserve/services/reservationLogs.service";

export function useReservationLogs(isAdmin: boolean) {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");

      const result = isAdmin
        ? await fetchAllReservations()
        : await fetchMyReservations();

      if (cancelled) return;

      if (result.error) {
        setError(result.error);
      } else {
        setReservations(result.reservations ?? []);
      }

      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  return { reservations, isLoading, error };
}
