export type TimeslotType = {
    timeInMins: number;
    occupiedSeats: number;
    capacity: number;
};

export interface ReservationSelection {
    selectedTimeslots: string[];
    selectedSeat: number | null;
    reserveAll: boolean;
    isAnonymous: boolean;
}
