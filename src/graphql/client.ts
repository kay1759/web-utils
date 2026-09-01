import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "@apollo/client";
import { getCsrfToken } from "../csrf/client";
import { createAuthLink } from "./authLink";

/**
 * Dependencies used to construct an Apollo Client instance.
 */
export type CreateApolloClientDeps = {
  createAuthLink: (
    getCsrfToken: (force?: boolean) => Promise<string>,
  ) => ApolloLink;
  getCsrfToken: (force?: boolean) => Promise<string>;
};

/**
 * Create an Apollo Client instance with CSRF header support.
 *
 * @param graphqlUrl - Graphql URL
 * @param deps - Optional dependency overrides for testing
 * @returns Configured Apollo Client instance
 */
export function createApolloClient(
  graphqlUrl: string,
  deps: CreateApolloClientDeps = { createAuthLink, getCsrfToken },
): ApolloClient {
  const httpLink = new HttpLink({
   uri: graphqlUrl,
   credentials: "include",
  });

  const authLink = deps.createAuthLink(deps.getCsrfToken);

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
