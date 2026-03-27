/**
 * Centralized API base URL.
 *
 * Vite statically replaces import.meta.env.VITE_API_URL at build time
 * in both client AND server (SSR) bundles, so this works everywhere.
 */
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_URL = String(RAW_API_URL).replace(/\/+$/, "");
