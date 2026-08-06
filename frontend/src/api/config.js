/**
 * Backend origin for production (e.g. https://miraego-api.onrender.com).
 * Leave empty in local dev — Vite proxies `/api` → localhost:5001.
 */
export const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').replace(
  /\/$/,
  '',
)

/** Resolve an API path against the configured base URL. */
export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalized}`
}
