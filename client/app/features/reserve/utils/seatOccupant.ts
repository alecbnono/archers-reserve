import type { TimeslotType, SeatOccupantPreview, SeatOccupant } from "../types/reserve.types";

/**
 * Resolve seat occupant previews across selected timeslots.
 *
 * For each occupied seat, check occupants across all selected timeslots:
 * - If any occupant is anonymous → "Anonymous" with null avatar
 * - If a seat has different occupants (different avatars) across timeslots → "Multiple users"
 * - Otherwise → show the single occupant's avatar
 *
 * Returns a Map<seatId, SeatOccupantPreview>.
 */
export function resolveSeatOccupantPreviews(
    timeslots: TimeslotType[],
    selectedTimeslotIds: string[],
): Map<number, SeatOccupantPreview> {
    const result = new Map<number, SeatOccupantPreview>();

    // Collect all occupants per seat across selected timeslots
    const occupantsBySeat = new Map<number, SeatOccupant[]>();
    for (const ts of timeslots) {
        if (!selectedTimeslotIds.includes(ts.timeslotId.toString())) continue;
        for (const occupant of ts.seatOccupants) {
            if (!occupantsBySeat.has(occupant.seatId)) {
                occupantsBySeat.set(occupant.seatId, []);
            }
            occupantsBySeat.get(occupant.seatId)!.push(occupant);
        }
    }

    for (const [seatId, occupants] of occupantsBySeat) {
        // If any occupant entry is anonymous → anonymous preview (not navigable)
        if (occupants.some((o) => o.isAnonymous)) {
            result.set(seatId, { profilePictureUrl: null, label: "Anonymous", visibleUserId: null });
            continue;
        }

        // Check if all occupants are the same user via visibleUserId
        const uniqueUsers = new Set(occupants.map((o) => o.visibleUserId));
        if (uniqueUsers.size > 1) {
            result.set(seatId, { profilePictureUrl: null, label: "Multiple users", visibleUserId: null });
            continue;
        }

        // Single occupant — show their avatar; navigable only if visibleUserId is positive (real user)
        const avatar = occupants[0].profilePictureUrl;
        const userId = occupants[0].visibleUserId;
        result.set(seatId, {
            profilePictureUrl: avatar,
            label: "",
            visibleUserId: userId > 0 ? userId : null,
        });
    }

    return result;
}
