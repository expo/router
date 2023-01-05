import { fetchAsync } from "./fetchAsync";

declare let global: {
  globalEvalWithSourceUrl?: any;
};

/**
 * Load a bundle for a URL using fetch + eval on native and script tag injection on web.
 *
 * @param bundlePath Given a statement like `import('./Bacon')` `bundlePath` would be `Bacon`.
 */
export function fetchThenEvalAsync(url: string): Promise<void> {
  return fetchAsync(url).then(({ body, headers }) => {
    if (
      headers["Content-Type"] != null &&
      headers["Content-Type"].indexOf("application/json") >= 0
    ) {
      // Errors are returned as JSON.
      throw new Error(
        JSON.parse(body).message || `Unknown error fetching '${url}'`
      );
    }

    // NOTE(EvanBacon): All of this code is ignored in development mode at the root.

    // Some engines do not support `sourceURL` as a comment. We expose a
    // `globalEvalWithSourceUrl` function to handle updates in that case.
    if (global.globalEvalWithSourceUrl) {
      global.globalEvalWithSourceUrl(body, url);
    } else {
      // eslint-disable-next-line no-eval
      eval(body);
    }
  });
}
