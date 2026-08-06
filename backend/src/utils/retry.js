/**
 * Sleep helper.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Exponential backoff delay with full jitter.
 * attempt 0 → ~baseDelayMs, attempt 1 → ~2×base, capped at maxDelayMs.
 *
 * @param {number} attempt Zero-based retry attempt index
 * @param {{ baseDelayMs?: number, maxDelayMs?: number }} [options]
 * @returns {number} Delay in milliseconds
 */
export function backoffDelay(attempt, options = {}) {
  const baseDelayMs = options.baseDelayMs ?? 500
  const maxDelayMs = options.maxDelayMs ?? 8_000
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt))
  return Math.floor(Math.random() * (exp + 1))
}

/**
 * Runs `fn` with a fixed number of retries and exponential backoff between tries.
 * Total attempts = retries + 1 (e.g. retries: 1 → try, wait, retry once).
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{
 *   retries?: number,
 *   baseDelayMs?: number,
 *   maxDelayMs?: number,
 *   shouldRetry?: (err: unknown, attempt: number) => boolean,
 *   onRetry?: (err: unknown, attempt: number, delayMs: number) => void,
 *   label?: string,
 * }} [options]
 * @returns {Promise<T>}
 */
export async function withRetry(fn, options = {}) {
  const retries = options.retries ?? 1
  const shouldRetry = options.shouldRetry ?? (() => true)
  let lastError

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      if (attempt >= retries || !shouldRetry(err, attempt)) {
        break
      }

      const delayMs = backoffDelay(attempt, options)
      options.onRetry?.(err, attempt, delayMs)
      await sleep(delayMs)
    }
  }

  throw lastError
}
