import type { Request } from "express";

export type UserRole = "STUDENT" | "FACULTY" | "ADMIN";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export interface TokenPayload {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface DbUser {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  bio: string;
  profile_picture_url: string;
  is_anonymous: boolean;
  is_public: boolean;
  role: UserRole;
  created_at: Date;
}

export interface SafeUser {
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
  createdAt: Date;
}
