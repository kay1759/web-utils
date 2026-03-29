import { describe, it, expect, vi } from "vitest";
import type { DocumentNode } from "graphql";
import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import { queryGraphQL, mutateGraphQL } from "../../src/graphql/execute";

const DUMMY_QUERY = {} as DocumentNode;
const DUMMY_MUTATION = {} as DocumentNode;

describe("graphql/execute", () => {
  describe("queryGraphQL", () => {
    it("returns data when query succeeds", async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          data: { result: "ok" },
        }),
      } as unknown as ApolloClient<NormalizedCacheObject>;

      const data = await queryGraphQL<{ result: string }>(
        mockClient,
        DUMMY_QUERY,
        { id: 1 },
      );

      expect(mockClient.query).toHaveBeenCalledWith({
        query: DUMMY_QUERY,
        variables: { id: 1 },
        fetchPolicy: "no-cache",
      });

      expect(data).toEqual({ result: "ok" });
    });

    it("throws error when query returns no data", async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          data: undefined,
        }),
      } as unknown as ApolloClient<NormalizedCacheObject>;

      await expect(queryGraphQL(mockClient, DUMMY_QUERY)).rejects.toThrow(
        "GraphQL query returned no data",
      );
    });
  });

  describe("mutateGraphQL", () => {
    it("returns data when mutation succeeds", async () => {
      const mockClient = {
        mutate: vi.fn().mockResolvedValue({
          data: { success: true },
        }),
      } as unknown as ApolloClient<NormalizedCacheObject>;

      const data = await mutateGraphQL<{ success: boolean }, { name: string }>(
        mockClient,
        DUMMY_MUTATION,
        { name: "Alice" },
      );

      expect(mockClient.mutate).toHaveBeenCalledWith({
        mutation: DUMMY_MUTATION,
        variables: { name: "Alice" },
        fetchPolicy: "no-cache",
      });

      expect(data).toEqual({ success: true });
    });

    it("throws error when mutation returns no data", async () => {
      const mockClient = {
        mutate: vi.fn().mockResolvedValue({
          data: undefined,
        }),
      } as unknown as ApolloClient<NormalizedCacheObject>;

      await expect(
        mutateGraphQL(mockClient, DUMMY_MUTATION, {}),
      ).rejects.toThrow("GraphQL mutation returned no data");
    });
  });
});
