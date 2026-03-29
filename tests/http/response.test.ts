import { describe, it, expect } from "vitest";
import {
  json,
  redirect,
  error,
  defer,
  type TypedResponse,
} from "../../src/http/response";

describe("http/response", () => {
  describe("json()", () => {
    it("returns a Response with JSON body and status code", async () => {
      const res = json({ message: "OK" }, 200) as TypedResponse<{
        message: string;
      }>;

      expect(res).toBeInstanceOf(Response);
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/json");

      const body = await res.json();
      expect(body).toEqual({ message: "OK" });
    });

    it("accepts ResponseInit as the second argument", async () => {
      const res = json(
        { success: true },
        { status: 201, headers: { "X-Test": "yes" } },
      );

      expect(res.status).toBe(201);
      expect(res.headers.get("X-Test")).toBe("yes");

      const body = await res.json();
      expect(body).toEqual({ success: true });
    });

    it("returns a JSON response with status 200", async () => {
      const res = defer({ ok: true });

      expect(res).toBeInstanceOf(Response);
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/json");

      const body = await res.json();
      expect(body).toEqual({ ok: true });
    });

    it("json() preserves custom headers while forcing Content-Type", async () => {
      const res = json(
        { ok: true },
        {
          status: 200,
          headers: {
            "X-Test": "yes",
            "Content-Type": "text/plain",
          },
        },
      );

      expect(res.headers.get("X-Test")).toBe("yes");
      expect(res.headers.get("Content-Type")).toBe("application/json");
    });
  });

  describe("redirect()", () => {
    it("throws a Response with a Location header", () => {
      try {
        redirect("/dashboard");
        throw new Error("should not reach");
      } catch (e) {
        expect(e).toBeInstanceOf(Response);

        const res = e as Response;
        expect(res.status).toBe(302);
        expect(res.headers.get("Location")).toBe("/dashboard");
      }
    });

    it("allows specifying a custom status code", () => {
      try {
        redirect("/login", 301);
        throw new Error("should not reach");
      } catch (e) {
        const res = e as Response;
        expect(res.status).toBe(301);
        expect(res.headers.get("Location")).toBe("/login");
      }
    });
  });

  describe("error()", () => {
    it("throws a JSON Response with status and message", async () => {
      try {
        error(404, "Not Found");
        throw new Error("should not reach");
      } catch (e) {
        expect(e).toBeInstanceOf(Response);

        const res = e as Response;
        expect(res.status).toBe(404);

        const body = await res.json();
        expect(body).toEqual({ message: "Not Found" });
      }
    });

    it("returns an empty object when no message is provided", async () => {
      try {
        error(500);
        throw new Error("should not reach");
      } catch (e) {
        const res = e as Response;
        const body = await res.json();
        expect(body).toEqual({});
      }
    });
  });

  describe("defer()", () => {
    it("returns a Response with status 200", async () => {
      const res = defer({ user: Promise.resolve("alice") });

      expect(res).toBeInstanceOf(Response);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("user");
    });
  });
});
