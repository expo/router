import Constants from "expo-constants";
import { match } from "path-to-regexp";

export type Redirect = {
  /** glob pattern */
  from: string;
  to: string;
};

export function nextRedirect(
  pathname: string,
  redirects: Redirect[] = getRuntimeRedirects()
): string {
  const redirect = matchRedirect(pathname, redirects);
  if (redirect) {
    return redirect.next;
  }
  return pathname;
}

export function matchRedirect(pathname: string, redirects: Redirect[]) {
  let result = null;
  for (const redirect of redirects) {
    const matchResult = match(redirect.from, { decode: decodeURIComponent })(
      result?.next ?? pathname
    );
    if (matchResult) {
      result = {
        to: redirect.to,
        params: matchResult.params,
        next: redirect.to.replace(/\:([a-zA-Z0-9]+)/g, (_, key) => {
          return matchResult.params[key];
        }),
      };
    }
  }
  return result;
}

export function getRuntimeRedirects() {
  return Constants.manifest?.extra?.router?.redirects ?? [];
}

export function assertValidRedirects(
  redirects: any
): asserts redirects is Redirect[] {
  if (!Array.isArray(redirects)) {
    throw new Error("Redirects must be an array.");
  }

  for (const redirect of redirects) {
    if (typeof redirect.from !== "string") {
      throw new Error("Redirect.from must be a string.");
    }
    if (typeof redirect.to !== "string") {
      throw new Error("Redirect.to must be a string.");
    }
  }
}
