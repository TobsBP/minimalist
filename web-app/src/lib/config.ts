// Backend base URL. Reused from docker-compose (NEXT_PUBLIC_API_URL -> http://back-app:8080).
// Read server-side only: the BFF proxy in src/app/api/* talks to the backend, the browser never does.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// Name of the httpOnly cookie that stores the JWT.
export const AUTH_COOKIE = 'minimalist_token'

// Cookie lifetime in seconds. Matches the backend token expiration (2h, see TokenService).
export const TOKEN_MAX_AGE = 60 * 60 * 2
