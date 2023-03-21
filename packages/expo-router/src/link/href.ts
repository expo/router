export type Href = string | HrefObject;

export interface HrefObject {
  /** Path representing the selected route `/[id]`. */
  pathname?: string;
  /** Query parameters for the path. */
  params?: Record<string, any>;
}

/** Resolve an href object into a fully qualified, relative href. */
export const resolveHref = (href: Href): string => {
  if (typeof href === "string") {
    return resolveHref({ pathname: href ?? "" });
  }
  const path = href.pathname ?? "";
  if (!href?.params) {
    return path;
  }
  const { pathname, params } = createQualifiedPathname(path, {
    ...href.params,
  });
  return (
    pathname +
    (Object.keys(params).length ? `?${createQueryParams(params)}` : "")
  );
};

function createQualifiedPathname(
  pathname: string,
  params: Record<string, any>
): Omit<Required<HrefObject>, "query"> {
  for (const [key, value = ""] of Object.entries(params)) {
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

    delete params[key];
  }
  return { pathname, params };
}

function createQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .map((props) => props.join("="))
    .join("&");
}
