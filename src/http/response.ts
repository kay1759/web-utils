/**
 * Typed extension of the standard `Response` object.
 *
 * @typeParam T - Associated payload type
 */
export type TypedResponse<T> = Response & { data?: T };

/**
 * Create a JSON `Response` compatible with React Router v7 style helpers.
 *
 * @typeParam T - JSON payload type
 * @param data - Response body data
 * @param init - Status code or `ResponseInit`
 * @returns JSON response
 */
export function json<T>(
  data: T,
  init?: number | ResponseInit,
): TypedResponse<T> {
  const body = JSON.stringify(data);

  const headers =
    typeof init === "object" && init?.headers
      ? new Headers(init.headers)
      : new Headers();

  headers.set("Content-Type", "application/json");

  if (typeof init === "number") {
    return new Response(body, {
      status: init,
      headers,
    }) as TypedResponse<T>;
  }

  return new Response(body, {
    ...init,
    headers,
  }) as TypedResponse<T>;
}

/**
 * Throw a redirect `Response`.
 *
 * @param url - Redirect target
 * @param init - Status code or `ResponseInit`
 * @throws Always throws a `Response`
 */
export function redirect(
  url: string,
  init: number | ResponseInit = 302,
): never {
  const responseInit: ResponseInit =
    typeof init === "number" ? { status: init } : init;

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
export function error(status: number, message?: string): never {
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
export function defer<T extends Record<string, unknown>>(
  data: T,
): TypedResponse<T> {
  return json(data, 200);
}
