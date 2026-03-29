/**
 * Type definition for a decoded JWT payload.
 *
 * - Includes standard JWT claims defined in RFC 7519
 * - Allows application-specific custom claims
 *
 * Important:
 * - This utility performs decoding only
 * - Signature verification is NOT performed
 * - Server-side verification is mandatory for security
 */
export type JwtPayload = {
  /**
   * Subject (for example, user ID)
   */
  sub?: string;

  /**
   * Expiration time as UNIX timestamp in seconds
   */
  exp?: number;

  /**
   * Issued-at time as UNIX timestamp in seconds
   */
  iat?: number;

  /**
   * Additional custom claims
   */
  [key: string]: unknown;
};

/**
 * Decode a JWT payload without verifying its signature.
 *
 * @param token - JWT string in the form `header.payload.signature`
 * @returns Decoded payload, or `null` if decoding fails
 *
 * @remarks
 * This is intended for lightweight browser-side inspection only.
 * Do not use it for authentication or authorization decisions.
 */
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Check whether a decoded JWT payload is expired.
 *
 * @param payload - Decoded JWT payload
 * @param now - Current UNIX timestamp in seconds
 * @returns `true` if expired, otherwise `false`
 *
 * @remarks
 * If `exp` is absent, the token is treated as non-expiring by this helper.
 */
export const isExpired = (
  payload: JwtPayload,
  now = Date.now() / 1000,
): boolean => {
  if (payload.exp == null) return false;
  return payload.exp < now;
};
