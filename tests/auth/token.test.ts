// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  configureAuthToken,
  setToken,
  getToken,
  removeToken,
} from "../../src/auth/token";

/**
 * Mock implementation of `document.cookie`.
 *
 * In JSDOM, `document.cookie` is handled as a plain string.
 * We emulate browser-like behavior using a getter / setter pair.
 */
let cookieStore = "";

// Define a custom cookie property on document
Object.defineProperty(document, "cookie", {
  configurable: true,
  get: () => cookieStore,
  set: (value: string) => {
    /**
     * Emulate browser cookie behavior:
     * - Only the first "key=value" pair is relevant
     * - Attributes like `expires`, `path`, etc. are ignored
     */
    const [pair] = value.split(";");
    const [key] = pair.split("=");

    const cookies = cookieStore
      .split("; ")
      .filter(Boolean)
      // remove existing cookie with the same key
      .filter((c) => !c.startsWith(`${key}=`));

    cookies.push(pair);
    cookieStore = cookies.join("; ");
  },
});

/**
 * Reset cookie state and configure token settings before each test.
 */
beforeEach(() => {
  cookieStore = "";

  configureAuthToken({
    cookieName: "test_token",
  });
});

describe("auth/token", () => {
  it("stores token JSON in cookie", () => {
    setToken({ token: "jwt-123", role: "user" });

    expect(cookieStore).toContain("test_token=");
  });

  it("retrieves token string from cookie", () => {
    setToken({ token: "jwt-abc" });

    const token = getToken();

    expect(token).toBe("jwt-abc");
  });

  it("returns null when token cookie does not exist", () => {
    const token = getToken();

    expect(token).toBeNull();
  });

  it("returns null when cookie JSON is malformed", () => {
    // Manually inject malformed JSON (URL-encoded "{invalid-json")
    cookieStore = "test_token=%7Binvalid-json";

    const token = getToken();

    expect(token).toBeNull();
  });

  it("removes token cookie", () => {
    setToken({ token: "jwt-remove" });
    expect(getToken()).toBe("jwt-remove");

    removeToken();
    expect(getToken()).toBeNull();
  });

  it("does nothing when setToken is called with a falsy value", () => {
    setToken(null);

    expect(cookieStore).toBe("");
  });

  it("returns null when token property does not exist", () => {
    cookieStore = "test_token=%7B%22role%22%3A%22admin%22%7D";

    const token = getToken();

    expect(token).toBeNull();
  });

  it("returns null when token is an empty string", () => {
    cookieStore = "test_token=%7B%22token%22%3A%22%22%7D";

    const token = getToken();

    expect(token).toBeNull();
  });
});
