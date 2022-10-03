import React from "react";

import { useContextKey } from "../Route";
import { useSortedScreens } from "../useScreens";
import { Screen, ScreenProps } from "../views/Screen";

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Return a navigator that automatically injects matched routes and renders nothing when there are no children. Return type with children prop optional */
export function withLayoutContext<
  TOptions extends object,
  T extends React.ComponentType<any>
>(
  Nav: T
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<PickPartial<React.ComponentProps<T>, "children">> &
    React.RefAttributes<unknown>
> & {
  Screen: (props: ScreenProps<TOptions>) => null;
} {
  const Navigator = React.forwardRef(
    (
      {
        children: userDefinedChildren,
        ...props
      }: PickPartial<React.ComponentProps<T>, "children">,
      ref
    ) => {
      const contextKey = useContextKey();

      const userDefinedOptions = React.useMemo(() => {
        const screens = React.Children.map(userDefinedChildren, (child) => {
          if (React.isValidElement(child) && child && child.type === Screen) {
            if (!child.props.name) {
              throw new Error(
                "Screen must have a name prop when used as a child of a Layout"
              );
            }
            if (process.env.NODE_ENV !== "production") {
              if (
                ["children", "parent", "component", "getComponent"].some(
                  (key) => key in child.props
                )
              ) {
                throw new Error(
                  "Screen must not have a children, parent, component, or getComponent prop when used as a child of a Layout"
                );
              }
            }
            return child.props;
          } else {
            console.warn(
              "Layout children must be of type Screen, all other children are ignored. To use custom children, create a custom <Layout />."
            );
          }
        });

        if (process.env.NODE_ENV !== "production") {
          // Assert if names are not unique
          const names = screens?.map((screen) => screen.name);
          if (names && new Set(names).size !== names.length) {
            throw new Error("Screen names must be unique: " + names);
          }
        }

        return screens;
      }, [userDefinedChildren]);

      const sorted = useSortedScreens(userDefinedOptions ?? []);

      // Prevent throwing an error when there are no screens.
      if (!sorted.length) {
        return null;
      }

      // @ts-expect-error
      return <Nav id={contextKey} {...props} ref={ref} children={sorted} />;
    }
  );

  // @ts-expect-error
  Navigator.Screen = Screen;
  // @ts-expect-error
  return Navigator;
}
