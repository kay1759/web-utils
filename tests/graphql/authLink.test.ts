import { describe, it, expect, vi } from "vitest";
import { Observable, type ApolloLink, type Operation } from "@apollo/client";
import { createAuthLink } from "../../src/graphql/authLink";

type OperationContext = {
  headers?: Record<string, string>;
};

type TestOperation = Pick<
  Operation,
  "query" | "variables" | "getContext" | "setContext"
>;

function createOperation(): TestOperation {
  let context: OperationContext = {};

  return {
    query: {} as Operation["query"],
    variables: {},
    getContext: () => context,
    setContext: (
      next:
        | Partial<OperationContext>
        | ((prev: OperationContext) => Partial<OperationContext>),
    ) => {
      context = {
        ...context,
        ...(typeof next === "function" ? next(context) : next),
      };
    },
  };
}

async function runLink(
  link: ApolloLink,
  initialContext: OperationContext = {},
): Promise<OperationContext> {
  const operation = createOperation();
  operation.setContext(initialContext);

  await new Promise<void>((resolve, reject) => {
    link
      .request(
        operation as unknown as Operation,
        () =>
          new Observable((observer) => {
            observer.next({});
            observer.complete();
          }),
      )
      ?.subscribe({
        complete: resolve,
        error: reject,
      });
  });

  return operation.getContext();
}

describe("createAuthLink", () => {
  it("attaches x-csrf-token header when token is available", async () => {
    const getCsrfToken = vi.fn().mockResolvedValue("test-csrf");

    const link = createAuthLink(getCsrfToken);
    const context = await runLink(link);

    expect(getCsrfToken).toHaveBeenCalledTimes(1);
    expect(getCsrfToken).toHaveBeenCalledWith();
    expect(context.headers?.["x-csrf-token"]).toBe("test-csrf");
  });

  it("preserves existing headers", async () => {
    const getCsrfToken = vi.fn().mockResolvedValue("test-csrf");

    const link = createAuthLink(getCsrfToken);
    const context = await runLink(link, {
      headers: {
        authorization: "Bearer abc",
      },
    });

    expect(context.headers).toEqual({
      authorization: "Bearer abc",
      "x-csrf-token": "test-csrf",
    });
  });

  it("propagates an error when token retrieval fails", async () => {
    const getCsrfToken = vi.fn().mockRejectedValue(new Error("fail"));

    const link = createAuthLink(getCsrfToken);

    await expect(runLink(link)).rejects.toThrow("fail");
  });
});
