import type { LabType } from "@/types/lab.types";

export const MOCK_LABS: LabType[] = [
    {
        id: "LAB-001",
        building: "Gokongwei",
        roomNumber: "301",
        status: "OPEN",
        totalSeats: 40,
        occupiedSeats: 12,
    },
    {
        id: "LAB-002",
        building: "Gokongwei",
        roomNumber: "302",
        status: "OPEN",
        totalSeats: 35,
        occupiedSeats: 35, // High traffic example
    },
    {
        id: "LAB-003",
        building: "St. Joseph",
        roomNumber: "201",
        status: "OPEN",
        totalSeats: 30,
        occupiedSeats: 5,
    },
    {
        id: "LAB-004",
        building: "St. Joseph",
        roomNumber: "202",
        status: "OPEN",
        totalSeats: 30,
        occupiedSeats: 0, // Empty lab example
    },
    {
        id: "LAB-005",
        building: "Yuchengco",
        roomNumber: "401",
        status: "OPEN",
        totalSeats: 50,
        occupiedSeats: 20,
    },
    {
        id: "LAB-006",
        building: "Andrew",
        roomNumber: "302",
        status: "OPEN",
        totalSeats: 45,
        occupiedSeats: 10,
    },
    {
        id: "LAB-007",
        building: "Andrew",
        roomNumber: "303",
        status: "OPEN",
        totalSeats: 45,
        occupiedSeats: 40,
    },
    {
        id: "LAB-008",
        building: "Velasco",
        roomNumber: "401",
        status: "OPEN",
        totalSeats: 25,
        occupiedSeats: 8,
    },
];
