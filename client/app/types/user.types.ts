export type UserRole = "STUDENT" | "FACULTY" | "ADMIN";

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    profilePictureUrl: string;
    isAnonymous: boolean;
    isPublic: boolean;
    role: UserRole;
    createdAt: string;
}
