/**
 * Create a JSON `Response` compatible with React Router v7 style helpers.
 *
 * @typeParam T - JSON payload type
 * @param data - Response body data
 * @param init - Status code or `ResponseInit`
 * @returns JSON response
 */
export function json(data, init) {
    const body = JSON.stringify(data);
    const headers = typeof init === "object" && init?.headers
        ? new Headers(init.headers)
        : new Headers();
    headers.set("Content-Type", "application/json");
    if (typeof init === "number") {
        return new Response(body, {
            status: init,
            headers,
        });
    }
    return new Response(body, {
        ...init,
        headers,
    });
}
/**
 * Throw a redirect `Response`.
 *
 * @param url - Redirect target
 * @param init - Status code or `ResponseInit`
 * @throws Always throws a `Response`
 */
export function redirect(url, init = 302) {
    const responseInit = typeof init === "number" ? { status: init } : init;
    const headers = new Headers(responseInit.headers);
    headers.set("Location", url);
    throw new Response(null, {
        ...responseInit,
        headers,
    });
}
/**
 * Throw a JSON error response.
 *
 * @param status - HTTP status code
 * @param message - Optional error message
 * @throws Always throws a JSON `Response`
 */
export function error(status, message) {
    throw json(message ? { message } : {}, status);
}
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
export function defer(data) {
    return json(data, 200);
}
