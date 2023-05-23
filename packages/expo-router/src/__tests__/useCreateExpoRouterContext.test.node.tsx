import { render } from "@testing-library/react-native";
import React from "react";

import { RequireContext } from "../types";
import {
  ExpoRootProps,
  useCreateExpoRouterContext,
} from "../useCreateExpoRouterContext";

function createMockContextModule(
  map: Record<string, Record<string, any>> = {}
) {
  const contextModule = jest.fn((key) => map[key]);

  Object.defineProperty(contextModule, "keys", {
    value: () => Object.keys(map),
  });

  return contextModule as unknown as RequireContext;
}

function MockComponent(props: ExpoRootProps) {
  useCreateExpoRouterContext(props);
  return null;
}

describe(useCreateExpoRouterContext, () => {
  beforeEach(() => {
    // @ts-expect-error
    jest.spyOn(Array.prototype, "reduce");
  });
  it(`computes on render`, () => {
    render(
      <MockComponent
        context={createMockContextModule({})}
        location={undefined}
      />
    );

    expect(Array.prototype.reduce).toHaveBeenCalled();
  });

  it("does not re-compute the value when props are the same", () => {
    const context = createMockContextModule({});
    const location = new URL("/hello", "https://acme.com");
    const { rerender } = render(
      <MockComponent context={context} location={location} />
    );

    // @ts-expect-error
    Array.prototype.reduce.mockClear();

    rerender(<MockComponent context={context} location={location} />);

    expect(Array.prototype.reduce).not.toHaveBeenCalled();
  });

  it("re-computes the value when context changes", () => {
    const location = new URL("/hello", "https://acme.com");
    const { rerender } = render(
      <MockComponent
        context={createMockContextModule({})}
        location={location}
      />
    );

    // @ts-expect-error
    Array.prototype.reduce.mockClear();

    rerender(
      <MockComponent
        context={createMockContextModule({ "hello.js": { default: null } })}
        location={location}
      />
    );

    expect(Array.prototype.reduce).toHaveBeenCalled();
  });
});
