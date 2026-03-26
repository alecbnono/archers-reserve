import { useEffect, useState } from "react";
import type { PublicProfile } from "~/features/profile/services/profile.service";
import { fetchUserProfile } from "~/features/profile/services/profile.service";
import type { ReservationType } from "~/types/reservation.types";
import { fetchUserReservations } from "~/features/reserve/services/reservationLogs.service";

export function usePublicProfile(userId: number | null) {
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [reservations, setReservations] = useState<ReservationType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId || userId <= 0) {
            setProfile(null);
            setReservations([]);
            setIsLoading(false);
            setError("Invalid user ID");
            return;
        }

        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setError("");

            const [profileResult, reservationsResult] = await Promise.all([
                fetchUserProfile(userId!),
                fetchUserReservations(userId!),
            ]);

            if (cancelled) return;

            if (profileResult.error) {
                setError(profileResult.error);
                setProfile(null);
                setReservations([]);
            } else {
                setProfile(profileResult.profile ?? null);
                // Reservations may fail independently (e.g. privacy) — show profile anyway
                setReservations(reservationsResult.reservations ?? []);
            }

            setIsLoading(false);
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return { profile, reservations, isLoading, error };
}
