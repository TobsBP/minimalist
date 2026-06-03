// Client-facing HTTP helper. Module services call the local BFF routes (/api/*) through this,
// never the backend directly — the JWT lives in an httpOnly cookie the browser can't read.

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(path, { ...init, headers })
  const text = await res.text()
  const data = text ? safeJson(text) : null

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : typeof data === 'string'
          ? data
          : '') || res.statusText
    throw new ApiError(message || 'Request failed', res.status)
  }

  return data as T
}
