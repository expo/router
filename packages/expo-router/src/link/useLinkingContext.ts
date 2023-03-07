import {
  LinkingContext,
  LinkingOptions,
  ParamListBase,
} from "@react-navigation/native";
import * as React from "react";

import getPathFromState from "../fork/getPathFromState";

export type RouterLinkingContext = Required<
  Omit<LinkingOptions<ParamListBase>, "filter" | "enabled">
> & {
  getPathFromState: typeof getPathFromState;
};

export function useLinkingContext(): RouterLinkingContext {
  const linking = React.useContext(LinkingContext);

  const { options } = linking;

  assertLinkingOptions(options);

  return options;
}

function assertLinkingOptions(
  options: LinkingOptions<ParamListBase> | undefined
): asserts options is RouterLinkingContext {
  if (!options?.config) {
    // This should never happen in Expo Router.
    throw new Error(
      "Couldn't find a linking config. Is your component inside a navigator?"
    );
  }
}
