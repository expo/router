import { useNavigation } from "@react-navigation/native";
import React from "react";

/** Component for setting the current screen's options dynamically. */
export function Screen<TOptions extends object = object>({
  name,
  options,
}: {
  name?: string;
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
          "Screen components should only use the name prop when nested directly inside a Layout. When a Screen is used for dynamic options it uses the nearest navigation context."
        );
      }
    }, [name]);
  }

  return null;
}
