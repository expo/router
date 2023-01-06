import React from "react";

import { RootContainer } from "./ContextNavigationContainer";
import getPathFromState, { State } from "./fork/getPathFromState";
import { useLinkingContext } from "./link/useLinkingContext";
import { useInitialRootStateContext } from "./rootStateContext";

type UrlObject = {
  pathname: string;
  readonly params: URLSearchParams;
  segments: string[];
};

function getRouteInfoFromState(
  getPathFromState: (state: State, asPath: boolean) => string,
  state: State
): UrlObject {
  const path = getPathFromState(state, false);

  return {
    pathname: path.split("?")["0"],
    //  TODO: This sometimes returns: `params=[object Object]&screen=XX&path=XX&initial=true`
    ...getNormalizedStatePath(getPathFromState(state, true)),
  };
}

function compareShallowRecords(a: Record<string, any>, b: Record<string, any>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

function compareRouteInfo(a: UrlObject, b: UrlObject) {
  return (
    a.segments.length === b.segments.length &&
    a.segments.every((segment, index) => segment === b.segments[index]) &&
    a.pathname === b.pathname &&
    compareShallowRecords(a.params, b.params)
  );
}

function useUrlObject(): UrlObject {
  const initialRootState = useInitialRootStateContext();
  const getPathFromState = useGetPathFromState();

  const [routeInfo, setRouteInfo] = React.useState<UrlObject>(
    getRouteInfoFromState(
      getPathFromState,
      // If the root state (from upstream) is not ready, use the hacky initial state.
      // Initial state can be generate because it assumes the linking configuration never changes.
      RootContainer.getRef().getRootState() ?? initialRootState
    )
  );

  const routeInfoRef = React.useRef(routeInfo);

  React.useEffect(() => {
    routeInfoRef.current = routeInfo;
  }, [routeInfo]);

  const maybeUpdateRouteInfo = React.useCallback(
    (state: State) => {
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
    const rootNavigation = RootContainer.getRef();

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
      return linking.getPathFromState(state, {
        ...linking.config,
        // @ts-expect-error
        preserveDynamicRoutes: asPath,
        preserveFragments: asPath,
      });
    },
    [linking]
  );
}

// TODO: Split up getPathFromState to return all this info at once.
function getNormalizedStatePath(
  statePath: string
): Omit<UrlObject, "pathname"> {
  const [pathname, querystring] = statePath.split("?");

  return {
    segments: pathname.split("/"),
    // TODO: This is not efficient, we should generate based on the state instead
    // of converting to string then back to object
    params: new URLSearchParams(querystring),
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
export function useSearchParams(): URLSearchParams {
  // TODO: Make this readonly
  return useLocation().params;
}

/** @returns array of selected segments. */
export function useSegments(): string[] {
  return useLocation().segments;
}
