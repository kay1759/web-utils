/**
 * Typed extension of the standard `Response` object.
 *
 * @typeParam T - Associated payload type
 */
export type TypedResponse<T> = Response & {
    data?: T;
};
/**
 * Create a JSON `Response` compatible with React Router v7 style helpers.
 *
 * @typeParam T - JSON payload type
 * @param data - Response body data
 * @param init - Status code or `ResponseInit`
 * @returns JSON response
 */
export declare function json<T>(data: T, init?: number | ResponseInit): TypedResponse<T>;
/**
 * Throw a redirect `Response`.
 *
 * @param url - Redirect target
 * @param init - Status code or `ResponseInit`
 * @throws Always throws a `Response`
 */
export declare function redirect(url: string, init?: number | ResponseInit): never;
/**
 * Throw a JSON error response.
 *
 * @param status - HTTP status code
 * @param message - Optional error message
 * @throws Always throws a JSON `Response`
 */
export declare function error(status: number, message?: string): never;
/**
 * Create a deferred-style JSON response for API compatibility.
 *
 * @remarks
 * This helper eagerly serializes the provided object.
 * It does not implement streaming semantics.
 *
 * @typeParam T - Deferred payload shape
 * @param data - Deferred payload
 * @returns JSON response
 */
export declare function defer<T extends Record<string, unknown>>(data: T): TypedResponse<T>;
