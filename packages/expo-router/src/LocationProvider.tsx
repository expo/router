import { State, deepEqual } from "./fork/getPathFromState";

type SearchParams = Record<string, string | string[]>;

type UrlObject = {
  pathname: string;
  readonly params: SearchParams;
  segments: string[];
};

export function getRouteInfoFromState(
  getPathFromState: (
    state: State,
    asPath: boolean
  ) => { path: string; params: any },
  state: State
): UrlObject {
  const { path } = getPathFromState(state, false);
  const qualified = getPathFromState(state, true);
  return {
    pathname: path.split("?")["0"],
    ...getNormalizedStatePath(qualified),
  };
}

export function compareRouteInfo(a: UrlObject, b: UrlObject) {
  return (
    a.segments.length === b.segments.length &&
    a.segments.every((segment, index) => segment === b.segments[index]) &&
    a.pathname === b.pathname &&
    compareUrlSearchParams(a.params, b.params)
  );
}

export function compareUrlSearchParams(
  a: SearchParams,
  b: SearchParams
): boolean {
  return deepEqual(a, b);
}

// TODO: Split up getPathFromState to return all this info at once.
export function getNormalizedStatePath({
  path: statePath,
  params,
}: {
  path: string;
  params: any;
}): Omit<UrlObject, "pathname"> {
  const [pathname] = statePath.split("?");
  return {
    // Strip empty path at the start
    segments: pathname.split("/").filter(Boolean).map(decodeURIComponent),
    // TODO: This is not efficient, we should generate based on the state instead
    // of converting to string then back to object
    params: Object.entries(params).reduce((prev, [key, value]) => {
      if (Array.isArray(value)) {
        prev[key] = value.map(decodeURIComponent);
      } else {
        prev[key] = decodeURIComponent(value as string);
      }
      return prev;
    }, {} as SearchParams),
  };
}
