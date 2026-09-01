/**
 * Configure the CSRF client.
 *
 * Call this once during application bootstrap before using `getCsrfToken`.
 */
export declare function configureCsrf(options: {
    endpoint: string;
}): void;
/**
 * Retrieve a CSRF token from the server.
 *
 * @param force - When true, bypasses the cache
 * @returns CSRF token string
 */
export declare function getCsrfToken(force?: boolean): Promise<string>;
/**
 * Clear the cached CSRF token state.
 */
export declare function clearCsrfToken(): void;
