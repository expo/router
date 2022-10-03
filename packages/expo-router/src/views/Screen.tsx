import React from "react";

import { useNavigation } from "../useNavigation";

export type ScreenProps<
  TOptions extends Record<string, any> = Record<string, any>
> = {
  /** Name is required when used inside a Layout component. */
  name?: string;
  /**
   * An absolute path like `/(root)` to the parent route or a relative path like `../../` to the parent route.
   * This should not be used inside of a Layout component.
   * @example `/(root)` maps to a layout route `/app/(root).tsx`.
   */
  parent?: string;

  /** Should redirect away from this screen. */
  redirect?: boolean;

  initialParams?: { [key: string]: any };
  options?: TOptions;
};

/** Component for setting the current screen's options dynamically. */
export function Screen<TOptions extends object = object>({
  name,
  parent,
  redirect,
  options,
}: ScreenProps<TOptions>) {
  // TODO: Maybe disable all this hook stuff when name is defined.
  const navigation = useNavigation(parent);

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
