export type LabStatus = "OPEN" | "CLOSED" | "MAINTENANCE" | "FULL";

export interface LabType {
    id: string;
    building: string;
    roomNumber: string;
    status: LabStatus;
    totalSeats: number;
    occupiedSeats: number;
}

export interface LabProp {
    lab: LabType;
}

export interface LabSeatType {
    id: string; // e.g., "G302-01"
    labId: string;
}
