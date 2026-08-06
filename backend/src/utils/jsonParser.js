import { AppError } from './AppError.js'

const PREVIEW_LIMIT = 240

/**
 * Parses JSON from a model response that may be plain JSON, fenced in
 * markdown, or wrapped in extra prose.
 *
 * @param {unknown} raw
 * @returns {unknown}
 */
export function parseJsonFromText(raw) {
  if (raw == null) {
    throw jsonError('Model response is null or undefined', 'EMPTY_MODEL_RESPONSE')
  }

  if (typeof raw !== 'string') {
    throw jsonError(
      `Expected a string model response, received ${typeLabel(raw)}`,
      'INVALID_MODEL_RESPONSE_TYPE',
      { receivedType: typeLabel(raw) },
    )
  }

  const cleaned = sanitizeModelText(raw)
  if (!cleaned) {
    throw jsonError('Model response is empty', 'EMPTY_MODEL_RESPONSE')
  }

  const candidates = buildCandidates(cleaned)
  const failures = []

  for (const candidate of candidates) {
    const result = tryParse(candidate)
    if (result.ok) return result.value
    failures.push(result.error)
  }

  throw jsonError(
    'Failed to extract valid JSON from model response',
    'JSON_PARSE_ERROR',
    {
      preview: preview(cleaned),
      attempts: failures,
    },
  )
}

/**
 * Removes BOM / zero-width characters and trims whitespace.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeModelText(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
}

/**
 * Pulls the inner body out of markdown code fences when present.
 * Handles complete fences, language tags, and truncated closing fences.
 * @param {string} text
 * @returns {string}
 */
export function stripMarkdownFences(text) {
  const completeFence = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (completeFence) {
    return completeFence[1].trim()
  }

  // Truncated response: opening fence but no closing ```
  const openFence = text.match(/^```(?:json)?\s*([\s\S]*)$/i)
  if (openFence) {
    return openFence[1].replace(/```\s*$/, '').trim()
  }

  return text
}

/**
 * Finds the first balanced `{...}` or `[...]` JSON value in text,
 * respecting string literals and escapes.
 * @param {string} text
 * @returns {string | null}
 */
export function extractBalancedJson(text) {
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch !== '{' && ch !== '[') continue

    const slice = readBalancedSlice(text, i)
    if (slice) return slice
  }

  return null
}

/**
 * @param {string} text
 * @returns {string[]}
 */
function buildCandidates(text) {
  const seen = new Set()
  const candidates = []

  const add = (value) => {
    if (!value || seen.has(value)) return
    seen.add(value)
    candidates.push(value)
  }

  add(text)
  add(stripMarkdownFences(text))

  for (const source of [...candidates]) {
    add(extractBalancedJson(source))
  }

  // Prose before/after fences: also scan the original for a balanced value
  add(extractBalancedJson(text))

  return candidates
}

/**
 * @param {string} candidate
 * @returns {{ ok: true, value: unknown } | { ok: false, error: { message: string, preview: string } }}
 */
function tryParse(candidate) {
  try {
    return { ok: true, value: JSON.parse(candidate) }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown parse error'
    return {
      ok: false,
      error: {
        message,
        preview: preview(candidate),
      },
    }
  }
}

/**
 * Walks from `start` and returns the balanced JSON slice, or null if
 * the structure is incomplete / mismatched.
 * @param {string} text
 * @param {number} start
 * @returns {string | null}
 */
function readBalancedSlice(text, start) {
  const openToClose = { '{': '}', '[': ']' }
  const closeToOpen = { '}': '{', ']': '[' }
  const stack = [text[start]]
  let inString = false
  let escaped = false

  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch in openToClose) {
      stack.push(ch)
      continue
    }

    if (ch in closeToOpen) {
      const expectedOpen = closeToOpen[ch]
      if (stack.length === 0 || stack[stack.length - 1] !== expectedOpen) {
        return null
      }

      stack.pop()
      if (stack.length === 0) {
        return text.slice(start, i + 1)
      }
    }
  }

  return null
}

/**
 * @param {string} message
 * @param {string} code
 * @param {Record<string, unknown>} [details]
 */
function jsonError(message, code, details) {
  return new AppError(message, 502, { code, details })
}

/**
 * @param {string} text
 * @returns {string}
 */
function preview(text) {
  if (text.length <= PREVIEW_LIMIT) return text
  return `${text.slice(0, PREVIEW_LIMIT)}…`
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function typeLabel(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}
