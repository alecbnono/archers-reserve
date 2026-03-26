export type LabStatus = "OPEN" | "CLOSED" | "MAINTENANCE" | "FULL";

export interface RoomType {
  roomId?: number;
  roomCode?: string;
  building: string;
  floor?: number;
  capacity?: number;
  status?: string;
  totalSeats?: number;
  occupiedSeats?: number;
}

export interface RoomProp {
    room: RoomType;
    selectedDate?: string;
    isRecurring?: boolean;
    selectedWeekday?: number; // 0=Mon..6=Sun, used only when isRecurring
}
