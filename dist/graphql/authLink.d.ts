import { ApolloLink } from "@apollo/client";
/**
 * Create an Apollo auth link that injects a CSRF token into request headers.
 *
 * @param getCsrfToken - Async function that returns a CSRF token
 * @returns ApolloLink that appends `x-csrf-token`
 */
export declare function createAuthLink(getCsrfToken: (force?: boolean) => Promise<string>): ApolloLink;
