import { useEffect, useState } from "react";
import type { AvailabilityData } from "~/features/reserve/types/reserve.types";
import { fetchAvailability } from "~/features/reserve/services/availability.service";

export function useAvailability(roomId: number | null, date: string | null) {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomId || !date) {
      setData(null);
      setError("");
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");

      const result = await fetchAvailability(roomId!, date!);

      if (cancelled) return;

      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result.data ?? null);
      }

      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [roomId, date]);

  return { data, isLoading, error };
}
