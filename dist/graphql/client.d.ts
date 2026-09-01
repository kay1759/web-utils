import { ApolloClient, ApolloLink } from "@apollo/client";
/**
 * Dependencies used to construct an Apollo Client instance.
 */
export type CreateApolloClientDeps = {
    createAuthLink: (getCsrfToken: (force?: boolean) => Promise<string>) => ApolloLink;
    getCsrfToken: (force?: boolean) => Promise<string>;
};
/**
 * Create an Apollo Client instance with CSRF header support.
 *
 * @param httpLink - Apollo Link responsible for transport
 * @param deps - Optional dependency overrides for testing
 * @returns Configured Apollo Client instance
 */
export declare function createApolloClient(httpLink: ApolloLink, deps?: CreateApolloClientDeps): ApolloClient;
