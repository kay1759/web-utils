import type { DocumentNode } from "graphql";
import type { ApolloClient } from "@apollo/client";
/**
 * Execute a GraphQL query using the provided Apollo Client.
 *
 * @typeParam T - Expected response data shape
 * @param client - Configured Apollo Client instance
 * @param query - GraphQL query document
 * @param variables - Optional query variables
 * @returns GraphQL response data
 * @throws Error if the response does not contain `data`
 */
export declare const queryGraphQL: <T>(client: ApolloClient, query: DocumentNode, variables?: Record<string, unknown>) => Promise<T>;
/**
 * Execute a GraphQL mutation using the provided Apollo Client.
 *
 * @typeParam T - Expected response data shape
 * @typeParam V - Mutation variable shape
 * @param client - Configured Apollo Client instance
 * @param mutation - GraphQL mutation document
 * @param variables - Mutation variables
 * @returns GraphQL response data
 * @throws Error if the response does not contain `data`
 */
export declare const mutateGraphQL: <T, V extends Record<string, unknown>>(client: ApolloClient, mutation: DocumentNode, variables: V) => Promise<T>;
