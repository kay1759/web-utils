/**
 * Configured CSRF endpoint URL.
 */
let endpoint: string | null = null;

/**
 * Cached CSRF token stored in memory.
 */
let cached: string | null = null;

/**
 * In-flight CSRF token request promise.
 */
let inflight: Promise<string> | null = null;

/**
 * Expected JSON shape returned by the CSRF endpoint.
 */
type CsrfResponse = {
  csrfToken: string;
};

/**
 * Configure the CSRF client.
 *
 * Call this once during application bootstrap before using `getCsrfToken`.
 */
export function configureCsrf(options: { endpoint: string }): void {
  endpoint = options.endpoint;
}

/**
 * Get the configured CSRF endpoint.
 *
 * @throws Error if the client is not configured
 */
function getEndpoint(): string {
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
export async function getCsrfToken(force = false): Promise<string> {
  if (!force && cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch(getEndpoint(), {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch CSRF token: ${res.status}`);
      }

      const body: CsrfResponse = await res.json();
      const token = body?.csrfToken?.trim?.() ?? "";

      if (!token) {
        throw new Error("CSRF token not found");
      }

      cached = token;
      return token;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/**
 * Clear the cached CSRF token state.
 */
export function clearCsrfToken(): void {
  cached = null;
  inflight = null;
}
