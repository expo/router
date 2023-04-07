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
    const pathname = ssrLocation.pathname + ssrLocation.search;
    return linking.getStateFromPath?.(pathname, linking.config);
  }

  return linking.getStateFromPath?.(window.location.pathname, linking.config);
}
