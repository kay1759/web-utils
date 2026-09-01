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
 * Configure the authentication token module.
 *
 * Call this once during application bootstrap before using the API.
 */
export declare function configureAuthToken(options: {
    cookieName: string;
}): void;
/**
 * Store an authentication token payload in a cookie.
 *
 * @param payload - Token payload returned by the server
 *
 * @remarks
 * This is a browser-only helper.
 */
export declare const setToken: (payload: AuthTokenPayload | null | undefined) => void;
/**
 * Retrieve the stored JWT token string from cookies.
 *
 * @returns The stored token, or `null` if unavailable
 *
 * @remarks
 * This function never throws on malformed cookie contents.
 * It is intended for browser environments only.
 */
export declare const getToken: () => string | null;
/**
 * Remove the stored authentication token cookie.
 */
export declare const removeToken: () => void;
