/**
 * Production API config.
 *
 * Supports either:
 * - VITE_API_URL = https://…onrender.com/api   (what you set on Vercel)
 * - VITE_API_BASE_URL = https://…onrender.com  (origin only)
 *
 * Leave both empty in local `npm run dev` — Vite proxies `/api` → localhost:5001.
 * On Vercel, empty also works if vercel.json rewrites `/api` → Render.
 */
function resolveApiRoot() {
  const raw =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    ''
  return String(raw).trim().replace(/\/$/, '')
}

export const API_BASE_URL = resolveApiRoot()

/** Resolve an API path against the configured base URL. */
export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const root = resolveApiRoot()
  if (!root) return normalized

  // VITE_API_URL=…/api + path=/api/trip → …/api/trip (no double /api)
  if (root.endsWith('/api') && normalized.startsWith('/api/')) {
    return `${root}${normalized.slice(4)}`
  }

  return `${root}${normalized}`
}
