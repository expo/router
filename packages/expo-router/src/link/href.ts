export type Href = string | { pathname?: string; query?: Record<string, any> };

export const resolveHref = (
  href: { pathname?: string; query?: Record<string, any> } | string
): string => {
  if (typeof href === "string") {
    return href ?? "";
  }
  const path = href.pathname ?? "";
  if (!href?.query) {
    return path;
  }
  const { pathname, query } = createQualifiedPathname(path, { ...href.query });
  return pathname + (Object.keys(query).length ? `?${createQuery(query)}` : "");
};

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
export function normalizePath(path: string): string {
  const result: string[] = [];
  const parts = path.split("/");
  parts.forEach((part: string) => {
    if (part === "") return;
    if (part === ".") return;
    if (part === "..") return result.pop();
    return result.push(part);
  });
  return ["", ...result].join("/");
}
