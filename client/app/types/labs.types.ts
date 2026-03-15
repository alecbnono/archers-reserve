export interface RoomType {
    roomId: number;
    roomCode: string;
    building: string;
    floor: number;
    capacity: number;
}

export interface RoomProp {
    room: RoomType;
    selectedDate?: string;
}
