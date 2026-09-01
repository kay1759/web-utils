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
export const queryGraphQL = async (client, query, variables) => {
    const res = await client.query({
        query,
        variables,
        fetchPolicy: "no-cache",
    });
    if (!res.data) {
        throw new Error("GraphQL query returned no data");
    }
    return res.data;
};
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
export const mutateGraphQL = async (client, mutation, variables) => {
    const res = await client.mutate({
        mutation,
        variables,
        fetchPolicy: "no-cache",
    });
    if (!res.data) {
        throw new Error("GraphQL mutation returned no data");
    }
    return res.data;
};
