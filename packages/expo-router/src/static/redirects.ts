import Constants from "expo-constants";
import { match } from "path-to-regexp";
import URL from "url-parse";

export type RedirectMatchable = {
  /** Only `query` is supported in client-side redirects. */
  type: "host" | "header" | "cookie" | "query";
  key: string;
  value?: string;
};

export type Redirect = {
  /** glob pattern */
  from: string;
  to: string;
  has?: RedirectMatchable[];
  missing?: RedirectMatchable[];
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

function matchHas(url: URL<any>, has: RedirectMatchable): boolean | null {
  if (has.type === "query") {
    const target = url.query[has.key];
    if (!target) {
      // miss
      return false;
    }

    if (!has.value || match(has.value)(target)) {
      // match
      return true;
    }

    return false;
  }
  // TODO: Does it make sense to skip when an unsupported type is used?
  return null;
}

export function matchRedirect(pathname: string, redirects: Redirect[]) {
  let result = null;
  for (const redirect of redirects) {
    const p = result?.next ?? pathname;
    const url = new URL(p, true);
    const matchResult = match<Record<string, string>>(redirect.from, {
      decode: decodeURIComponent,
    })(url.pathname);

    if (matchResult) {
      if (redirect.missing) {
        const allMissing = redirect.missing.every((matchable) => {
          const result = matchHas(url, matchable);
          return result === null || result === false;
        });
        if (!allMissing) {
          continue;
        }
      }
      if (redirect.has) {
        const allHas = redirect.has.every((matchable) => {
          const result = matchHas(url, matchable);
          return result === null || result === true;
        });
        if (!allHas) {
          continue;
        }
      }

      const next = new URL(
        redirect.to.replace(/\:([a-zA-Z0-9]+)/g, (_, key) => {
          return matchResult.params[key];
        })
      );

      // assign query params
      next.set("query", {
        ...url.query,
      });

      result = {
        to: redirect.to,
        params: matchResult.params,
        next: next.href,
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
