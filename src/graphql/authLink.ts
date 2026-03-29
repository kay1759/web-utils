import {
  ApolloLink,
  Observable,
  type FetchResult,
  type Operation,
} from "@apollo/client";

/**
 * Create an Apollo auth link that injects a CSRF token into request headers.
 *
 * @param getCsrfToken - Async function that returns a CSRF token
 * @returns ApolloLink that appends `x-csrf-token`
 */
export function createAuthLink(
  getCsrfToken: (force?: boolean) => Promise<string>,
): ApolloLink {
  return new ApolloLink((operation: Operation, forward) => {
    return new Observable<FetchResult>((observer) => {
      let innerSub:
        | {
            unsubscribe(): void;
          }
        | undefined;

      void getCsrfToken()
        .then((token) => {
          operation.setContext(
            ({ headers = {} }: { headers?: Record<string, string> }) => ({
              headers: {
                ...headers,
                "x-csrf-token": token,
              },
            }),
          );

          if (!forward) {
            observer.complete();
            return;
          }

          innerSub = forward(operation).subscribe({
            next: (value: FetchResult) => observer.next(value),
            error: (err: unknown) => observer.error(err),
            complete: () => observer.complete(),
          });
        })
        .catch((err: unknown) => {
          observer.error(err);
        });

      return () => {
        innerSub?.unsubscribe();
      };
    });
  });
}
