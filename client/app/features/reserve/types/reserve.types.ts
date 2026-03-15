export type TimeslotType = {
    timeslotId: number;
    startTime: string;
    endTime: string;
    occupiedSeats: number;
    reservedSeatIds: number[];
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
