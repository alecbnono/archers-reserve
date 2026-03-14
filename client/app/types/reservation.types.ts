export type ReservationStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type ReservationType = {
  reservationId: number;
  requestTime: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  building: string;
  roomCode: string;
  seatId: number;
  isAnonymous: boolean;
  status: ReservationStatus;
  cancelledAt: string | null;
  // Admin-only fields
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};
