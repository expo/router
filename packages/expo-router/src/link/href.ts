import { matchFragmentName } from "../matchers";

export type Href =
  | string
  | {
      /** Path representing the selected route `/[id]` */
      pathname?: string;
      /** Query parameters for the path. */
      query?: Record<string, any>;
    };

/** Resolve an href object into a fully qualified, relative href. */
export const resolveHref = (
  href: { pathname?: string; query?: Record<string, any> } | string
): string => {
  if (typeof href === "string") {
    return resolveHref({ pathname: href ?? "" });
  }
  const path = stripFragmentRoutes(href.pathname ?? "");
  if (!href?.query) {
    return path;
  }
  const { pathname, query } = createQualifiedPathname(path, { ...href.query });
  return pathname + (Object.keys(query).length ? `?${createQuery(query)}` : "");
};

function stripFragmentRoutes(pathname: string): string {
  return pathname
    .split("/")
    .filter((segment) => matchFragmentName(segment) == null)
    .join("/");
}

function createQualifiedPathname(pathname: string, query: Record<string, any>) {
  for (const [key, value = ""] of Object.entries(query)) {
    const dynamicKey = `[${key}]`;
    const deepDynamicKey = `[...${key}]`;
    if (pathname.includes(dynamicKey)) {
      pathname = pathname.replace(
        dynamicKey,
        Array.isArray(value) ? value.join("/") : value
      );
    } else if (pathname.includes(deepDynamicKey)) {
      pathname = pathname.replace(
        deepDynamicKey,
        Array.isArray(value) ? value.join("/") : value
      );
    } else {
      continue;
    }

    delete query[key];
  }
  return { pathname, query };
}

function createQuery(query: Record<string, any>) {
  return Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&");
}
