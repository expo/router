import getDevServer from "../getDevServer";

export function wrapFetchWithBaseUrl(
  fetch: Function & { __EXPO_BASE_URL_POLYFILLED?: boolean },
  productionBaseUrl: string
) {
  if (fetch.__EXPO_BASE_URL_POLYFILLED) {
    return fetch;
  }

  if (process.env.NODE_ENV === "production") {
    if (!productionBaseUrl) {
      throw new Error(
        "You must provide a production base URL to wrapFetchWithBaseUrl"
      );
    }
  }

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? productionBaseUrl
      : // e.g. http://localhost:19006
        getDevServer().url;

  if (!baseUrl) {
    return fetch;
  }

  // Ensure no trailing slash
  const origin = baseUrl.replace(/\/$/, "");

  const _fetch = (...props: any[]) => {
    if (props[0] && typeof props[0] === "string" && props[0].startsWith("/")) {
      props[0] = `${origin}${props[0]}`;
    } else if (props[0] && typeof props[0] === "object") {
      if (
        props[0].url &&
        typeof props[0].url === "string" &&
        props[0].url.startsWith("/")
      ) {
        props[0].url = `${origin}${props[0].url}`;
      }
    }
    return fetch(...props);
  };

  _fetch.__EXPO_BASE_URL_POLYFILLED = true;

  return _fetch;
}
