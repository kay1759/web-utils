import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  configureCsrf,
  getCsrfToken,
  clearCsrfToken,
} from "../../src/csrf/client";

// ===== Global fetch mock =====
//
// Since `fetch` is defined as a global function,
// we replace it in a type-safe way using `typeof fetch`.
const mockFetch: vi.MockedFunction<typeof fetch> = vi.fn();

global.fetch = mockFetch;

describe("csrf/client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCsrfToken();

    configureCsrf({
      endpoint: "https://example.com/csrf",
    });
  });

  it("retrieves a CSRF token from the server", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrfToken: "test-csrf" }),
    } as unknown as Response);

    const token = await getCsrfToken();

    expect(token).toBe("test-csrf");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/csrf"),
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      }),
    );
  });

  it("returns the cached CSRF token on subsequent calls", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrfToken: "cached-csrf" }),
    } as unknown as Response);

    const token1 = await getCsrfToken();
    const token2 = await getCsrfToken();

    expect(token1).toBe("cached-csrf");
    expect(token2).toBe("cached-csrf");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("bypasses the cache and refetches the token when force=true", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: "first" }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: "second" }),
      } as unknown as Response);

    const token1 = await getCsrfToken();
    const token2 = await getCsrfToken(true);

    expect(token1).toBe("first");
    expect(token2).toBe("second");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("executes fetch only once when called concurrently", async () => {
    let resolveFetch!: (value: Response) => void;

    mockFetch.mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const p1 = getCsrfToken();
    const p2 = getCsrfToken();
    const p3 = getCsrfToken();

    resolveFetch({
      ok: true,
      json: async () => ({ csrfToken: "inflight-csrf" }),
    } as unknown as Response);

    const tokens = await Promise.all([p1, p2, p3]);

    expect(tokens).toEqual(["inflight-csrf", "inflight-csrf", "inflight-csrf"]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("throws an error when the HTTP response is not OK", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
    } as unknown as Response);

    await expect(getCsrfToken()).rejects.toThrow("Failed to fetch CSRF token");

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("throws an error when the CSRF token is missing in the response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as unknown as Response);

    await expect(getCsrfToken()).rejects.toThrow("CSRF token not found");

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("resets the cache when clearCsrfToken is called", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: "before-clear" }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: "after-clear" }),
      } as unknown as Response);

    const token1 = await getCsrfToken();
    clearCsrfToken();
    const token2 = await getCsrfToken();

    expect(token1).toBe("before-clear");
    expect(token2).toBe("after-clear");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws an error when the CSRF token is blank", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrfToken: "   " }),
    } as unknown as Response);

    await expect(getCsrfToken()).rejects.toThrow("CSRF token not found");
  });
});
