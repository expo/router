import { useNavigation } from "@react-navigation/native";
import React from "react";

/** Component for setting the current screen's options dynamically. */
export function Screen<TOptions extends object = object>({
  name,
  redirect,
  options,
}: {
  name?: string;
  redirect?: boolean | string;
  initialParams?: Record<string, any>;
  options?: TOptions;
}) {
  // TODO: Maybe disable all this hook stuff when name is defined.
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions(options ?? {});
  }, [navigation, options]);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (name != null) {
        throw new Error(
          "Screen components should only use the `name` prop when nested directly inside a Layout component. When a Screen is used for dynamic options it uses the nearest navigation context."
        );
      }
      if (redirect != null) {
        throw new Error(
          "Screen components should only use the `redirect` prop when nested directly inside a Layout component."
        );
      }
    }, [name, redirect]);
  }

  return null;
}
