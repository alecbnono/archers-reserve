import type { ReservationType } from "~/types/reservation.types";


export function convertToReservationTypes(rawData: any[]): ReservationType[] {
  return rawData.map((item) => ({
    batchId: item.batchId,
    requestTime: item.requestTime,
    reservationDate: item.reservationDate,
    timeSlot: item.timeSlot,
    building: item.building,
    roomCode: item.roomCode,
    seatLabel: item.seatLabel,
    isAnonymous: item.isAnonymous,
    status: item.status,
    cancelledAt: item.cancelledAt,
    // Admin-only fields
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    role: item.role,
  }));
}