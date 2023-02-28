import { useRoute } from "@react-navigation/native";
import React from "react";

import { getNavigationContainerRef } from "./NavigationContainer";
import getPathFromState, {
  deepEqual,
  getPathDataFromState,
  State,
} from "./fork/getPathFromState";
import { useLinkingContext } from "./link/useLinkingContext";
import { useServerState } from "./static/useServerState";
import { useInitialRootStateContext } from "./useInitialRootStateContext";

type SearchParams = Record<string, string | string[]>;

type UrlObject = {
  pathname: string;
  readonly params: SearchParams;
  segments: string[];
};

function getRouteInfoFromState(
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

function compareRouteInfo(a: UrlObject, b: UrlObject) {
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

function useSafeInitialRootState() {
  const serverState = useServerState();
  const initialRootState = useInitialRootStateContext();

  return React.useMemo(() => {
    if (serverState) {
      return serverState;
    }

    // Check if "is ready" to prevent `console.error`s
    if (getNavigationContainerRef().isReady()) {
      return getNavigationContainerRef().getRootState() ?? initialRootState;
    }

    return initialRootState;
  }, []);
}

function useUrlObject(): UrlObject {
  const getPathFromState = useGetPathFromState();

  const [routeInfo, setRouteInfo] = React.useState<UrlObject>(
    getRouteInfoFromState(
      getPathFromState,
      // If the root state (from upstream) is not ready, use the hacky initial state.
      // Initial state can be generate because it assumes the linking configuration never changes.
      useSafeInitialRootState()
    )
  );

  const routeInfoRef = React.useRef(routeInfo);

  React.useEffect(() => {
    routeInfoRef.current = routeInfo;
  }, [routeInfo]);

  const maybeUpdateRouteInfo = React.useCallback(
    (state: State) => {
      // The state can be undefined when hot reloading a Layout Route on native.
      if (!state) {
        return;
      }
      // Prevent unnecessary updates
      const newRouteInfo = getRouteInfoFromState(getPathFromState, state);
      if (!compareRouteInfo(routeInfoRef.current, newRouteInfo)) {
        setRouteInfo(newRouteInfo);
      }
    },
    [
      // TODO: This probably never changes
      getPathFromState,
    ]
  );

  React.useEffect(() => {
    const rootNavigation = getNavigationContainerRef();

    return rootNavigation.addListener("state", ({ data }) => {
      // Attempt to use the complete state from the root, otherwise this will default to
      // sending events from the nearest layout.
      const navigationState =
        rootNavigation.getRootState() ?? (data.state as unknown as State);
      // NOTE(EvanBacon): It's probably worth asserting if the root state is missing here.
      maybeUpdateRouteInfo(navigationState);
    });
  }, [maybeUpdateRouteInfo]);

  return routeInfo;
}

function useGetPathFromState() {
  const linking = useLinkingContext();

  return React.useCallback(
    (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
      return getPathDataFromState(state, {
        ...linking.config,
        preserveDynamicRoutes: asPath,
        preserveGroups: asPath,
      });
    },
    [linking]
  );
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

const LocationContext = React.createContext<UrlObject | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  LocationContext.displayName = "LocationContext";
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  return (
    <LocationContext.Provider value={useUrlObject()}>
      {children}
    </LocationContext.Provider>
  );
}

function useLocation() {
  const location = React.useContext(LocationContext);

  if (!location) {
    throw new Error(
      "Location context is missing. Make sure you are rendering a <LocationProvider />."
    );
  }

  return location;
}

/** @returns Currently selected route as a normalized string without search parameters. e.g. `/acme?foo=bar` -> `/acme`. Segments will be normalized: `/[id]?id=normal` -> `/normal` */
export function usePathname(): string {
  return useLocation().pathname;
}

/** @returns Current URL Search Parameters. */
export function useSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return useLocation().params as Partial<TParams>;
}

/** @returns Current URL Search Parameters that only update when the path matches the current route. */
export function useLocalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return (useRoute()?.params ?? ({} as any)) as Partial<TParams>;
}

/** @returns Array of selected segments. */
export function useSegments(): string[] {
  return useLocation().segments;
}
