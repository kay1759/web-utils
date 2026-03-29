import { describe, it, expect } from "vitest";
import { decodeJwt, isExpired, type JwtPayload } from "../../src/auth/jwt";

/**
 * Encode a UTF-8 string as Base64URL.
 */
function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Helper to create a Base64URL-encoded JWT payload.
 *
 * NOTE:
 * - Signature is irrelevant because `decodeJwt` does not verify it.
 * - Only the payload part is used.
 */
function createJwt(payload: Record<string, unknown>): string {
  const header = toBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify(payload));

  return `${header}.${body}.`;
}

describe("auth/jwt", () => {
  describe("decodeJwt()", () => {
    it("decodes a valid JWT payload", () => {
      const token = createJwt({
        sub: "user-123",
        exp: 2000000000,
        role: "admin",
      });

      const payload = decodeJwt(token);

      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe("user-123");
      expect(payload?.exp).toBe(2000000000);
      expect(payload?.role).toBe("admin");
    });

    it("decodes UTF-8 payload values", () => {
      const token = createJwt({
        name: "山田太郎",
      });

      const payload = decodeJwt(token);

      expect(payload).not.toBeNull();
      expect(payload?.name).toBe("山田太郎");
    });

    it("returns null for malformed JWT", () => {
      expect(decodeJwt("invalid-token")).toBeNull();
      expect(decodeJwt("a.b")).toBeNull();
      expect(decodeJwt("a..c")).toBeNull();
    });

    it("returns null for invalid Base64 payload", () => {
      const token = "a.invalid_base64!.c";
      expect(decodeJwt(token)).toBeNull();
    });

    it("decodes payload without Base64URL padding", () => {
      const token = createJwt({ foo: "bar" });
      const payload = decodeJwt(token);

      expect(payload?.foo).toBe("bar");
    });
  });

  describe("isExpired()", () => {
    it("returns false when exp is in the future", () => {
      const payload: JwtPayload = {
        exp: Math.floor(Date.now() / 1000) + 60,
      };

      expect(isExpired(payload)).toBe(false);
    });

    it("returns true when exp is in the past", () => {
      const payload: JwtPayload = {
        exp: Math.floor(Date.now() / 1000) - 60,
      };

      expect(isExpired(payload)).toBe(true);
    });

    it("returns false when exp does not exist", () => {
      const payload: JwtPayload = {
        sub: "user-123",
      };

      expect(isExpired(payload)).toBe(false);
    });

    it("uses the provided `now` parameter", () => {
      const payload: JwtPayload = {
        exp: 1000,
      };

      expect(isExpired(payload, 999)).toBe(false);
      expect(isExpired(payload, 1000)).toBe(false);
      expect(isExpired(payload, 1001)).toBe(true);
    });
  });
});
