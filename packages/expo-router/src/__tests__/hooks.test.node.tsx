import { renderHook } from "@testing-library/react-native";
import { expectType } from "tsd";

import { useInitializeExpoRouter } from "../global-state/router-store";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useSegments,
} from "../hooks";
import { FileStub, inMemoryContext } from "../testing-library/context-stubs";

function initialiseExpoRouter(
  context: Record<string, FileStub>,
  initialUrl = "/"
) {
  return function Wrapper({ children }) {
    useInitializeExpoRouter(
      inMemoryContext(context),
      new URL(initialUrl, "test://test")
    );
    return children;
  };
}

describe(useSegments, () => {
  it(`defaults abstract types`, () => {
    const { result } = renderHook(() => useSegments(), {
      wrapper: initialiseExpoRouter({}),
    });
    const segments = result.current;
    expectType<string>(segments[0]);
    expectType<string[]>(segments);
  });
  it(`allows abstract types`, () => {
    const { result } = renderHook(() => useSegments<["alpha"]>(), {
      wrapper: initialiseExpoRouter({}),
    });
    const segments = result.current;
    expectType<"alpha">(segments[0]);
  });
  it(`allows abstract union types`, () => {
    const { result } = renderHook(
      () => useSegments<["a"] | ["b"] | ["b", "c"]>(),
      {
        wrapper: initialiseExpoRouter({}),
      }
    );
    const segments = result.current;
    expectType<"a" | "b">(segments[0]);
    if (segments[0] === "b") expectType<"c" | undefined>(segments[1]);
  });
});
describe(useGlobalSearchParams, () => {
  it(`defaults abstract types`, () => {
    const { result } = renderHook(() => useGlobalSearchParams(), {
      wrapper: initialiseExpoRouter({}),
    });
    const params = result.current;
    expectType<Record<string, string | string[] | undefined>>(params);
    expectType<string | string[] | undefined>(params.a);
  });
  it(`allows abstract types`, () => {
    const { result } = renderHook(
      () => useGlobalSearchParams<{ a: string }>(),
      {
        wrapper: initialiseExpoRouter({}),
      }
    );
    const params = result.current;
    expectType<{ a?: string }>(params);
    expectType<string | undefined>(params.a);
  });
});
describe(useLocalSearchParams, () => {
  it(`defaults abstract types`, () => {
    const { result } = renderHook(() => useLocalSearchParams(), {
      wrapper: initialiseExpoRouter({}),
    });
    const params = result.current;
    expectType<Record<string, string | string[] | undefined>>(params);
    expectType<string | string[] | undefined>(params.a);
  });
  it(`allows abstract types`, () => {
    const { result } = renderHook(() => useLocalSearchParams<{ a: string }>(), {
      wrapper: initialiseExpoRouter({}),
    });
    const params = result.current;
    expectType<{ a?: string }>(params);
    expectType<string | undefined>(params.a);
  });
});
