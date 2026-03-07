export type ReservationType = {
    id: number;
    requestTime: string;
    startTime: string;
    building: string;
    room: string;
    seatRow: string;
    seatCol: number;
    firstName: string;
    lastName: string;
    email: string;
};

export type ReservationProp = {
    reservation: ReservationType;
};

export type TableType = {
    title: string;
};
