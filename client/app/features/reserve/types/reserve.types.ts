export interface SeatOccupant {
    seatId: number;
    profilePictureUrl: string | null;
    isAnonymous: boolean;
    /** Real user ID when visible, unique negative sentinel when hidden. */
    visibleUserId: number;
}

/** Resolved preview for a single seat across all selected timeslots. */
export interface SeatOccupantPreview {
    profilePictureUrl: string | null;
    label: string;  // "Anonymous", "Multiple users", or empty for avatar-only
    /** Positive user ID when navigable (single visible occupant), null otherwise. */
    visibleUserId: number | null;
}

export type TimeslotType = {
    timeslotId: number;
    startTime: string;
    endTime: string;
    occupiedSeats: number;
    reservedSeatIds: number[];
    seatOccupants: SeatOccupant[];
    capacity: number;
};

export interface RoomInfo {
    roomId: number;
    roomCode: string;
    building: string;
    floor: number;
    capacity: number;
}

export interface AvailabilityData {
    room: RoomInfo;
    date: string;
    timeslots: TimeslotType[];
}

export interface ReservationSelection {
    selectedTimeslots: string[];
    selectedSeat: number | null;
    reserveAll: boolean;
    isAnonymous: boolean;
}
