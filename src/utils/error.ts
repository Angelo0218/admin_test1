export interface ApiErrorBody {
  code?: string
  field?: string
  message?: string
  name?: string
  [key: string]: unknown
}

export interface ParsedApiError {
  raw: string
  body: ApiErrorBody | null
  code: string
  message: string
}

/**
 * Parse an error thrown by the alova response interceptor. The interceptor wraps
 * the raw response body string into a plain `Error(text)`, so callers see the
 * JSON-ish payload in `error.message`. This helper turns it back into a typed
 * object so UI code doesn't have to grep regexes against the message.
 */
export function parseApiError(err: unknown): ParsedApiError {
  const raw = err instanceof Error ? err.message : String(err)
  let body: ApiErrorBody | null = null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      body = parsed as ApiErrorBody
    }
  } catch {
    /* not JSON — leave body null */
  }
  return {
    raw,
    body,
    code: typeof body?.code === 'string' ? body.code : '',
    message: typeof body?.message === 'string' ? body.message : raw
  }
}
