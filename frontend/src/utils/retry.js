/**
 * Sleep helper. Rejects with AbortError if `signal` aborts during the wait.
 * @param {number} ms
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>}
 */
export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const abortErr = new Error('Aborted')
      abortErr.name = 'AbortError'
      reject(abortErr)
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    function onAbort() {
      clearTimeout(timer)
      const abortErr = new Error('Aborted')
      abortErr.name = 'AbortError'
      reject(abortErr)
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * Exponential backoff with full jitter.
 * @param {number} attempt Zero-based retry index
 * @param {{ baseDelayMs?: number, maxDelayMs?: number }} [options]
 * @returns {number}
 */
export function backoffDelay(attempt, options = {}) {
  const baseDelayMs = options.baseDelayMs ?? 500
  const maxDelayMs = options.maxDelayMs ?? 8_000
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt))
  return Math.floor(Math.random() * (exp + 1))
}

/**
 * Runs `fn` with retries and exponential backoff.
 * Total attempts = retries + 1.
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{
 *   retries?: number,
 *   baseDelayMs?: number,
 *   maxDelayMs?: number,
 *   shouldRetry?: (err: unknown, attempt: number) => boolean,
 *   onRetry?: (err: unknown, attempt: number, delayMs: number) => void,
 *   signal?: AbortSignal,
 * }} [options]
 * @returns {Promise<T>}
 */
export async function withRetry(fn, options = {}) {
  const retries = options.retries ?? 1
  const shouldRetry = options.shouldRetry ?? (() => true)
  let lastError

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (options.signal?.aborted) {
      const abortErr = new Error('Aborted')
      abortErr.name = 'AbortError'
      throw abortErr
    }

    try {
      return await fn()
    } catch (err) {
      lastError = err

      if (
        (err && typeof err === 'object' && err.name === 'AbortError') ||
        options.signal?.aborted
      ) {
        throw err
      }

      if (attempt >= retries || !shouldRetry(err, attempt)) {
        break
      }

      const delayMs = backoffDelay(attempt, options)
      options.onRetry?.(err, attempt, delayMs)
      await sleep(delayMs, options.signal)
    }
  }

  throw lastError
}
