/**
 * Authentication token payload stored in cookies.
 *
 * The payload must include a `token` property and may include
 * additional application-specific fields.
 */
export type AuthTokenPayload = {
  token: string;
  [key: string]: unknown;
};

/**
 * Configured cookie name for the auth token.
 */
let tokenCookieName: string | null = null;

/**
 * Configure the authentication token module.
 *
 * Call this once during application bootstrap before using the API.
 */
export function configureAuthToken(options: { cookieName: string }): void {
  tokenCookieName = options.cookieName;
}

/**
 * Get the configured cookie name.
 *
 * @throws Error if the module is not configured
 */
function getTokenCookieName(): string {
  if (!tokenCookieName) {
    throw new Error("Auth token module is not configured");
  }
  return tokenCookieName;
}

/**
 * Store an authentication token payload in a cookie.
 *
 * @param payload - Token payload returned by the server
 *
 * @remarks
 * This is a browser-only helper.
 */
export const setToken = (
  payload: AuthTokenPayload | null | undefined,
): void => {
  if (!payload) return;

  const name = getTokenCookieName();
  setCookie(name, JSON.stringify(payload));
};

/**
 * Retrieve the stored JWT token string from cookies.
 *
 * @returns The stored token, or `null` if unavailable
 *
 * @remarks
 * This function never throws on malformed cookie contents.
 * It is intended for browser environments only.
 */
export const getToken = (): string | null => {
  try {
    const name = getTokenCookieName();
    const cookies = document.cookie ? document.cookie.split("; ") : [];

    for (const cookie of cookies) {
      const idx = cookie.indexOf("=");
      if (idx === -1) continue;

      const rawKey = cookie.slice(0, idx);
      const rawVal = cookie.slice(idx + 1);

      const key = decodeURIComponent(rawKey);
      if (key !== name) continue;

      const decoded = decodeURIComponent(rawVal);
      const parsed = JSON.parse(decoded) as Partial<AuthTokenPayload>;

      if (typeof parsed.token === "string" && parsed.token.length > 0) {
        return parsed.token;
      }
    }
  } catch {
    // Ignore malformed cookie contents
  }

  return null;
};

/**
 * Remove the stored authentication token cookie.
 */
export const removeToken = (): void => {
  const name = getTokenCookieName();
  deleteCookie(name);
};

/**
 * Set a cookie value.
 *
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Expiration in days
 */
const setCookie = (name: string, value: string, days = 14): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/`;
};

/**
 * Delete a cookie immediately by expiring it.
 *
 * @param name - Cookie name
 */
const deleteCookie = (name: string): void => {
  document.cookie = `${encodeURIComponent(
    name,
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};
