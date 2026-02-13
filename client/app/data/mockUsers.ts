import type { User, UserRole } from "@/types/user.types";

export const MOCK_USERS: User[] = [
    {
        id: "12212345",
        firstName: "Juan",
        lastName: "Dela Cruz",
        email: "juan.delacruz@dlsu.edu.ph",
        role: "STUDENT",
        bio: "3rd Year Computer Science student. Frequent user of Andrew G302 for specialized dev projects. Enthusiastic about ArcherReserve!",
    },
    {
        id: "11012345",
        firstName: "Erika",
        lastName: "Villon",
        email: "erika.villon@dlsu.edu.ph",
        role: "FACULTY",
        bio: "Assistant Professor in the Software Technology department. Primarily reserves labs for hands-on machine learning lectures.",
    },
    {
        id: "ADMIN-01",
        firstName: "Tech",
        lastName: "Ramos",
        email: "tech.ramos@dlsu.edu.ph",
        role: "ADMIN",
        bio: "Senior Lab Technician. Responsible for lab maintenance and reservation management across all CCS-managed rooms.",
    },
];
