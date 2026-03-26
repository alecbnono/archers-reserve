import { getAllRooms } from "../room.service.js";
import pool from "../../../app/db.js"; 

jest.mock("../../../app/db.js", () => ({
  query: jest.fn(),
}));

describe('getAllRooms', () => {
  it('should transform database rows into RoomRow objects', async () => {
    
    const mockDbRows = [
      { room_id: 1, room_code: 'L1', building: 'LS', floor: 1, capacity: 40 },
      { room_id: 2, room_code: 'A1', building: 'AG', floor: 2, capacity: 30 }
    ];

    (pool.query as jest.Mock).mockResolvedValue({ rows: mockDbRows });

    const actual = await getAllRooms();

    expect(actual).toEqual([
      { roomId: 1, roomCode: 'L1', building: 'LS', floor: 1, capacity: 40 },
      { roomId: 2, roomCode: 'A1', building: 'AG', floor: 2, capacity: 30 }
    ]);
    
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});