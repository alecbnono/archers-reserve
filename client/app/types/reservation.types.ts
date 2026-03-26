export type ReservationStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type ReservationType = {
  batchId: string;
  requestTime: string;
  reservationDate: string;
  reservationDateEnd: string | null;  // non-null for recurring batches
  timeSlot: string;           // pre-merged 12-hour range from backend
  building: string;
  roomId: number;
  roomCode: string;
  seatLabel: string;          // "ALL" or single seat number
  isAnonymous: boolean;
  isRecurring: boolean;
  status: ReservationStatus;
  cancelledAt: string | null;
  // Admin-only fields
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};
