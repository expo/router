import { renderHook as tlRenderHook } from "@testing-library/react-native";
import React from "react";
import { expectType } from "tsd";

import { ExpoRoot, router } from "../exports";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
  useSegments,
} from "../hooks";
import { act } from "../testing-library";
import { inMemoryContext } from "../testing-library/context-stubs";

/*
 * Creates an Expo Router context around the hook, where every router renders the hook
 * This allows you full navigation
 */
function renderHook<T>(
  renderCallback: () => T,
  routes: string[] = ["index"],
  { initialUrl = "/" }: { initialUrl?: string } = {}
) {
  return tlRenderHook(renderCallback, {
    wrapper: function Wrapper({ children }) {
      const context = {};
      for (const key of routes) {
        context[key] = () => <>{children}</>;
      }

      return (
        <ExpoRoot
          context={inMemoryContext(context)}
          location={new URL(initialUrl, "test://test")}
        />
      );
    },
  });
}

function renderHookOnce<T>(
  renderCallback: () => T,
  routes?: string[],
  options?: { initialUrl?: string }
) {
  return renderHook<T>(renderCallback, routes, options).result.current;
}

describe(useSegments, () => {
  it(`defaults abstract types`, () => {
    const segments = renderHookOnce(() => useSegments());
    expectType<string>(segments[0]);
    expectType<string[]>(segments);
  });
  it(`allows abstract types`, () => {
    const segments = renderHookOnce(() => useSegments<["alpha"]>());
    expectType<"alpha">(segments[0]);
  });
  it(`allows abstract union types`, () => {
    const segments = renderHookOnce(() =>
      useSegments<["a"] | ["b"] | ["b", "c"]>()
    );
    expectType<"a" | "b">(segments[0]);
    if (segments[0] === "b") expectType<"c" | undefined>(segments[1]);
  });
});

describe(useGlobalSearchParams, () => {
  it(`return styles of deeply nested routes`, () => {
    const { result } = renderHook(
      () => useGlobalSearchParams(),
      ["[fruit]/[shape]/[...veg?]"],
      {
        initialUrl: "/apple/square",
      }
    );

    expect(result.current).toEqual({
      fruit: "apple",
      shape: "square",
    });

    act(() => router.push("/banana/circle/carrot"));

    expect(result.current).toEqual({
      fruit: "banana",
      shape: "circle",
      veg: "carrot",
    });
  });

  it(`defaults abstract types`, () => {
    const params = renderHookOnce(() => useGlobalSearchParams());
    expectType<Record<string, string | string[] | undefined>>(params);
    expectType<string | string[] | undefined>(params.a);
  });
  it(`allows abstract types`, () => {
    const params = renderHookOnce(() => useGlobalSearchParams<{ a: string }>());
    expectType<{ a?: string }>(params);
    expectType<string | undefined>(params.a);
  });
});

describe(useLocalSearchParams, () => {
  it(`return styles of deeply nested routes`, () => {
    const { result } = renderHook(
      () => useGlobalSearchParams(),
      ["[fruit]/[shape]/[...veg?]"],
      {
        initialUrl: "/apple/square",
      }
    );

    expect(result.current).toEqual({
      fruit: "apple",
      shape: "square",
    });

    act(() => router.push("/banana/circle/carrot"));

    expect(result.current).toEqual({
      fruit: "banana",
      shape: "circle",
      veg: "carrot",
    });
  });

  it(`defaults abstract types`, () => {
    const params = renderHookOnce(() => useLocalSearchParams());
    expectType<Record<string, string | string[] | undefined>>(params);
    expectType<string | string[] | undefined>(params.a);
  });
  it(`allows abstract types`, () => {
    const params = renderHookOnce(() => useLocalSearchParams<{ a: string }>());
    expectType<{ a?: string }>(params);
    expectType<string | undefined>(params.a);
  });
});

describe(usePathname, () => {
  it(`return pathname of deeply nested routes`, () => {
    const { result } = renderHook(
      () => usePathname(),
      ["[fruit]/[shape]/[...veg?]"],
      {
        initialUrl: "/apple/square",
      }
    );

    expect(result.current).toEqual("/apple/square");

    act(() => router.push("/banana/circle/carrot"));
    expect(result.current).toEqual("/banana/circle/carrot");

    act(() => router.push("/banana/circle/carrot/beetroot"));
    expect(result.current).toEqual("/banana/circle/carrot/beetroot");

    act(() => router.push("/banana/circle/carrot/beetroot/beans"));
    expect(result.current).toEqual("/banana/circle/carrot/beetroot/beans");

    act(() => router.push("/banana/circle/carrot/beetroot?foo=bar"));
    expect(result.current).toEqual("/banana/circle/carrot/beetroot");
  });
});
