export type UserRole = "STUDENT" | "FACULTY" | "ADMIN";

export interface User {
    id: string; // DLSU ID Number (e.g., "12212345")
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    role: UserRole;
}
