import { expectType } from "tsd";

import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useSegments,
} from "../hooks";

jest.mock("react", () => {
  return {
    ...jest.requireActual("react"),
    useContext: () => ({
      routeInfo: { segments: [], pathname: "", params: {} },
    }),
  };
});

afterAll(() => {
  jest.unmock("react");
});

describe(useSegments, () => {
  it(`defaults abstract types`, () => {
    const segments = useSegments();
    expectType<string>(segments[0]);
    expectType<string[]>(segments);
  });
  it(`allows abstract types`, () => {
    const a = useSegments<["alpha"]>();
    expectType<"alpha">(a[0]);
  });
  it(`allows abstract union types`, () => {
    const a = useSegments<["a"] | ["b"] | ["b", "c"]>();
    expectType<"a" | "b">(a[0]);
    if (a[0] === "b") expectType<"c" | undefined>(a[1]);
  });
});
describe(useGlobalSearchParams, () => {
  it(`defaults abstract types`, () => {
    const params = useGlobalSearchParams();
    expectType<Record<string, string | string[] | undefined>>(params);
    expectType<string | string[] | undefined>(params.a);
  });
  it(`allows abstract types`, () => {
    const params = useGlobalSearchParams<{ a: string }>();
    expectType<{ a?: string }>(params);
    expectType<string | undefined>(params.a);
  });
});
describe(useLocalSearchParams, () => {
  it(`defaults abstract types`, () => {
    const params = useLocalSearchParams();
    expectType<Record<string, string | string[] | undefined>>(params);
    expectType<string | string[] | undefined>(params.a);
  });
  it(`allows abstract types`, () => {
    const params = useLocalSearchParams<{ a: string }>();
    expectType<{ a?: string }>(params);
    expectType<string | undefined>(params.a);
  });
});
