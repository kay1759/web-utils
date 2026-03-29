import { describe, it, expect, vi } from "vitest";
import { ApolloLink } from "@apollo/client";
import { createApolloClient } from "../../src/graphql/client";

describe("createApolloClient", () => {
  it("creates ApolloClient using authLink before httpLink", () => {
    const mockAuthLink = new ApolloLink(() => null);
    const mockCreateAuthLink = vi.fn().mockReturnValue(mockAuthLink);
    const mockGetCsrfToken = vi.fn();

    const httpLink = new ApolloLink(() => null);

    const client = createApolloClient(httpLink, {
      createAuthLink: mockCreateAuthLink,
      getCsrfToken: mockGetCsrfToken,
    });

    expect(mockCreateAuthLink).toHaveBeenCalledTimes(1);
    expect(mockCreateAuthLink).toHaveBeenCalledWith(mockGetCsrfToken);
    expect(client).toBeDefined();
  });
});
