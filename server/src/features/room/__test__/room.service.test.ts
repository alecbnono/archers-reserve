import { getAllRooms, getBuildings, getRooms, RoomRow } from "../room.service.js";
import pool from "../../../app/db.js"; 

jest.mock("../../../app/db.js", () => ({
  query: jest.fn(),
}));


describe('getBuildings', () => {
    it('should get all distinct buildings into array of Strings', async () =>{

        const mockDbBuildings = [
            { building: "Andrew Gonzales Hall" }, 
            { building: "Connon Hall" }, 
            { building: "Gokongwei Hall" }, 
            { building: "St. Joseph Hall" }
        ];

        (pool.query as jest.Mock).mockResolvedValue({ rows: mockDbBuildings });

        const actual = await getBuildings();

        expect(actual).toEqual([
            "Andrew Gonzales Hall",
            "Connon Hall",
            "Gokongwei Hall",
            "St. Joseph Hall"
        ]);
    });
});

describe('getAllRooms', () => {
    it('should transform database rows into RoomRow objects', async () => {
    
        const mockDbRows = [
            { room_id: 1, room_code: 'A1904', building: 'Andrew Gonzales Hall', floor: 19, capacity: 45 },
            { room_id: 2, room_code: 'C314', building: 'Connon Hall', floor: 3, capacity: 35 }
        ];

        (pool.query as jest.Mock).mockResolvedValue({ rows: mockDbRows });

        const actual = await getAllRooms();

        expect(actual).toEqual([
        { roomId: 1, roomCode: 'A1904', building: 'Andrew Gonzales Hall', floor: 19, capacity: 45 },
        { roomId: 2, roomCode: 'C314', building: 'Connon Hall', floor: 3, capacity: 35 }
        ]); 
    });
});

// TODO: Change getRooms unit test into integrated test
describe('getRooms', ()=> {

    const mockDbRoomRows = [
        { room_id: 1, room_code: 'A1904', building: 'Andrew Gonzales Hall', floor: 19, capacity: 45 },
        { room_id: 2, room_code: 'C314', building: 'Connon Hall', floor: 3, capacity: 35 },
        { room_id: 19, room_code: 'V205', building: 'Velasco Hall', floor: 2, capacity: 24 },
        { room_id: 25, room_code: 'Y602', building: 'Yuchengco Hall', floor: 6, capacity: 41 },
        { room_id: 17, room_code: 'L335', building: 'St. La Salle Hall', floor: 3, capacity: 44 },
        { room_id: 8, room_code: 'G304B', building: 'Gokongwei Hall', floor: 3, capacity: 45 },
        { room_id: 22, room_code: 'V208B', building: 'Velasco Hall', floor: 2, capacity: 22 }
    ];

    const testCases = [
                {
                    // Case 1: No filters
                    input: {}, 
                    expected: [
                        { room_id: 1, room_code: 'A1904', building: 'Andrew Gonzales Hall', floor: 19, capacity: 45 },
                        { room_id: 2, room_code: 'C314', building: 'Connon Hall', floor: 3, capacity: 35 },
                        { room_id: 19, room_code: 'V205', building: 'Velasco Hall', floor: 2, capacity: 24 },
                        { room_id: 25, room_code: 'Y602', building: 'Yuchengco Hall', floor: 6, capacity: 41 },
                        { room_id: 17, room_code: 'L335', building: 'St. La Salle Hall', floor: 3, capacity: 44 },
                        { room_id: 8, room_code: 'G304B', building: 'Gokongwei Hall', floor: 3, capacity: 45 },
                        { room_id: 22, room_code: 'V208B', building: 'Velasco Hall', floor: 2, capacity: 22 }
                    ],
                    test: "No filter"
                },
                {
                    // Case 2: Filter by a specific building
                    input: {
                        buildings: ["Gokongwei Hall"],
                        vacant: false,
                        startTime: undefined,
                        endTime: undefined,
                        date: undefined
                    },
                    expected: [
                        { room_id: 8, room_code: 'G304B', building: 'Gokongwei Hall', floor: 3, capacity: 45 }
                    ],
                    test: "Filter by specific building"
                },
                {
                    // Case 3: Testing multiple buildings
                    input: {
                        buildings: ["Connon Hall", "Velasco Hall"],
                        vacant: false
                    },
                    expected: [
                        { room_id: 2, room_code: 'C314', building: 'Connon Hall', floor: 3, capacity: 35 },
                        { room_id: 19, room_code: 'V205', building: 'Velasco Hall', floor: 2, capacity: 24 },
                        { room_id: 22, room_code: 'V208B', building: 'Velasco Hall', floor: 2, capacity: 22 }
                    ],
                    test: "Filter by multiple buildings"
                },
                {
                    // Case 4: Testing vacancy
                    input: {
                        vacant: true
                    },
                    expected: [
                        { room_id: 1, room_code: 'A1904', building: 'Andrew Gonzales Hall', floor: 19, capacity: 45 },
                        { room_id: 2, room_code: 'C314', building: 'Connon Hall', floor: 3, capacity: 35 },
                        { room_id: 19, room_code: 'V205', building: 'Velasco Hall', floor: 2, capacity: 24 },
                        { room_id: 25, room_code: 'Y602', building: 'Yuchengco Hall', floor: 6, capacity: 41 },
                        { room_id: 17, room_code: 'L335', building: 'St. La Salle Hall', floor: 3, capacity: 44 },
                        { room_id: 8, room_code: 'G304B', building: 'Gokongwei Hall', floor: 3, capacity: 45 },
                        { room_id: 22, room_code: 'V208B', building: 'Velasco Hall', floor: 2, capacity: 22 }
                    ],
                    test: "Filter by vacancy"
                }
    ];
    for (const testCase of testCases){
        
        test (
            `case type: ${testCase.test} 
            expected objects: ${testCase.expected}`, 
            async () => {
                (pool.query as jest.Mock).mockResolvedValue({ rows: mockDbRoomRows });

                const actual = await getRooms(testCase.input);

                expect(actual).toEqual(testCase.expected);     
        });        
    }
});

// TODO: integrated test for getRoomOccupancy
