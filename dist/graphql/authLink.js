import { ApolloLink, Observable, } from "@apollo/client";
/**
 * Create an Apollo auth link that injects a CSRF token into request headers.
 *
 * @param getCsrfToken - Async function that returns a CSRF token
 * @returns ApolloLink that appends `x-csrf-token`
 */
export function createAuthLink(getCsrfToken) {
    return new ApolloLink((operation, forward) => {
        return new Observable((observer) => {
            let innerSub;
            void getCsrfToken()
                .then((token) => {
                operation.setContext(({ headers = {} }) => ({
                    headers: {
                        ...headers,
                        "x-csrf-token": token,
                    },
                }));
                if (!forward) {
                    observer.complete();
                    return;
                }
                innerSub = forward(operation).subscribe({
                    next: (value) => observer.next(value),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
            })
                .catch((err) => {
                observer.error(err);
            });
            return () => {
                innerSub?.unsubscribe();
            };
        });
    });
}
