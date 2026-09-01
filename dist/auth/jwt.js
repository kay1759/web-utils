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
export const decodeJwt = (token) => {
    try {
        const [, payload] = token.split(".");
        if (!payload)
            return null;
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        const json = new TextDecoder().decode(bytes);
        return JSON.parse(json);
    }
    catch {
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
export const isExpired = (payload, now = Date.now() / 1000) => {
    if (payload.exp == null)
        return false;
    return payload.exp < now;
};
