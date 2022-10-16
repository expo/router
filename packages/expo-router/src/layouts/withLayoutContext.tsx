import React from "react";

import { useContextKey } from "../Route";
import { useSortedScreens, ScreenProps } from "../useScreens";
import { Screen } from "../views/Screen";

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function useFilterScreenChildren(
  children: React.ReactNode,
  { isCustomNavigator }: { isCustomNavigator?: boolean } = {}
) {
  return React.useMemo(() => {
    const customChildren: any[] = [];
    const screens = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child && child.type === Screen) {
        if (!child.props.name) {
          throw new Error(
            "Screen must have a name prop when used as a child of a Layout"
          );
        }
        if (process.env.NODE_ENV !== "production") {
          if (
            ["children", "component", "getComponent"].some(
              (key) => key in child.props
            )
          ) {
            throw new Error(
              "Screen must not have a children, component, or getComponent prop when used as a child of a Layout"
            );
          }
        }
        return child.props;
      } else {
        if (isCustomNavigator) {
          customChildren.push(child);
        } else {
          console.warn(
            "Layout children must be of type Screen, all other children are ignored. To use custom children, create a custom <Layout />."
          );
        }
      }
    });

    // Add an assertion for development
    if (process.env.NODE_ENV !== "production") {
      // Assert if names are not unique
      const names = screens?.map((screen) => screen.name);
      if (names && new Set(names).size !== names.length) {
        throw new Error("Screen names must be unique: " + names);
      }
    }

    return {
      screens,
      children: customChildren,
    };
  }, [children]);
}

/** Return a navigator that automatically injects matched routes and renders nothing when there are no children. Return type with children prop optional */
export function withLayoutContext<
  TOptions extends object,
  T extends React.ComponentType<any>
>(
  Nav: T,
  processor?: (options: ScreenProps<TOptions>[]) => ScreenProps<TOptions>[]
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

      const { screens } = useFilterScreenChildren(userDefinedChildren);

      const processed = processor ? processor(screens ?? []) : screens;

      const sorted = useSortedScreens(processed ?? []);

      // Prevent throwing an error when there are no screens.
      if (!sorted.length) {
        return null;
      }

      return (
        // @ts-expect-error
        <Nav {...props} id={contextKey} ref={ref} children={sorted} />
      );
    }
  );

  // @ts-expect-error
  Navigator.Screen = Screen;
  // @ts-expect-error
  return Navigator;
}
