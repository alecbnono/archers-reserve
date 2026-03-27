/**
 * Centralized API base URL.
 *
 * Reads VITE_API_URL at build time and strips any trailing slash
 * so every consumer can safely append paths like `${API_URL}/auth`.
 */
export const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL
    : import.meta.env.VITE_API_URL;
