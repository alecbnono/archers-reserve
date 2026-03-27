/**
 * Centralized API base URL.
 *
 * Vite statically replaces import.meta.env.VITE_API_URL at build time
 * in both client AND server (SSR) bundles, so this works everywhere.
 *
 * If VITE_API_URL is not set during build, .replace() will throw on
 * undefined — this is intentional (fail-fast).
 */
export const API_URL = (import.meta.env.VITE_API_URL as string).replace(
  /\/+$/,
  "",
);
