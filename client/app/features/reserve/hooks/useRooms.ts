import { useEffect, useState } from "react";
import type { RoomType } from "~/types/labs.types";
import { fetchRooms } from "~/features/reserve/services/room.service";

export function useRooms() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");

      const result = await fetchRooms();

      if (cancelled) return;

      if (result.error) {
        setError(result.error);
      } else {
        setRooms(result.rooms ?? []);
      }

      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, isLoading, error };
}
