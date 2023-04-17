import { LinkingOptions } from "@react-navigation/native";

export function getInitialState(
  linking: LinkingOptions<object>,
  ssrLocation?: URL
) {
  if (typeof window === "undefined") {
    if (!ssrLocation) {
      throw new Error(
        `You need to set a NavigationStoreContext.Provider, with a NavigationStore(ssrLocation: string) value`
      );
    }
    return linking.getStateFromPath?.(
      ssrLocation.pathname + ssrLocation.search,
      linking.config
    );
  } else if (typeof window.location !== "undefined") {
    return linking.getStateFromPath?.(
      window.location.pathname + window.location.search,
      linking.config
    );
  }

  return undefined;
}
