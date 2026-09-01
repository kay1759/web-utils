/**
 * Configured CSRF endpoint URL.
 */
let endpoint = null;
/**
 * Cached CSRF token stored in memory.
 */
let cached = null;
/**
 * In-flight CSRF token request promise.
 */
let inflight = null;
/**
 * Configure the CSRF client.
 *
 * Call this once during application bootstrap before using `getCsrfToken`.
 */
export function configureCsrf(options) {
    endpoint = options.endpoint;
}
/**
 * Get the configured CSRF endpoint.
 *
 * @throws Error if the client is not configured
 */
function getEndpoint() {
    if (!endpoint) {
        throw new Error("CSRF client is not configured");
    }
    return endpoint;
}
/**
 * Retrieve a CSRF token from the server.
 *
 * @param force - When true, bypasses the cache
 * @returns CSRF token string
 */
export async function getCsrfToken(force = false) {
    if (!force && cached)
        return cached;
    if (inflight)
        return inflight;
    inflight = (async () => {
        try {
            const res = await fetch(getEndpoint(), {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error(`Failed to fetch CSRF token: ${res.status}`);
            }
            const body = await res.json();
            const token = body?.csrfToken?.trim?.() ?? "";
            if (!token) {
                throw new Error("CSRF token not found");
            }
            cached = token;
            return token;
        }
        finally {
            inflight = null;
        }
    })();
    return inflight;
}
/**
 * Clear the cached CSRF token state.
 */
export function clearCsrfToken() {
    cached = null;
    inflight = null;
}
