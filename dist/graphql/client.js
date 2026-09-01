import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getCsrfToken } from "../csrf/client";
import { createAuthLink } from "./authLink";
/**
 * Create an Apollo Client instance with CSRF header support.
 *
 * @param httpLink - Apollo Link responsible for transport
 * @param deps - Optional dependency overrides for testing
 * @returns Configured Apollo Client instance
 */
export function createApolloClient(httpLink, deps = { createAuthLink, getCsrfToken }) {
    const authLink = deps.createAuthLink(deps.getCsrfToken);
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
}
