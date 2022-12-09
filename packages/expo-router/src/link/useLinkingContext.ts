import {
  LinkingContext,
  LinkingOptions,
  ParamListBase,
} from "@react-navigation/native";
import * as React from "react";

export function useLinkingContext(): Required<
  Omit<LinkingOptions<ParamListBase>, "filter" | "enabled">
> {
  const linking = React.useContext(LinkingContext);

  const { options } = linking;

  if (!options?.config) {
    // This should never happen in Expo Router.
    throw new Error(
      "Couldn't find a linking config. Is your component inside a navigator?"
    );
  }

  // @ts-expect-error: non-standard option
  return options;
}
